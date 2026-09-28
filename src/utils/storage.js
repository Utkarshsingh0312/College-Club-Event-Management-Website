import { INITIAL_EVENTS, INITIAL_REGISTRATIONS } from '../data/seedData.js';


const STORAGE_KEYS = {
  EVENTS: 'clubsphere_events',
  REGISTRATIONS: 'clubsphere_registrations',
  AUTH: 'clubsphere_auth',
};

// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    console.warn('localStorage is not available, falling back to in-memory store', e);
    return false;
  }
};

// Internal memory fallback if localStorage is blocked
const memoryStore = {
  [STORAGE_KEYS.EVENTS]: null,
  [STORAGE_KEYS.REGISTRATIONS]: null,
  [STORAGE_KEYS.AUTH]: null,
};

const getItem = (key) => {
  if (isLocalStorageAvailable()) {
    return localStorage.getItem(key);
  }
  return memoryStore[key];
};

const setItem = (key, value) => {
  if (isLocalStorageAvailable()) {
    localStorage.setItem(key, value);
  }
  memoryStore[key] = value;
};

// Calculate event status dynamically
export const calculateEventStatus = (event) => {
  if (!event || !event.date) return 'Upcoming';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Compare event date
  const eventDate = new Date(event.date);
  eventDate.setHours(23, 59, 59, 999);

  if (eventDate < today) {
    return 'Completed';
  }

  // Compare registration deadline if present
  if (event.registrationDeadline) {
    const deadline = new Date(event.registrationDeadline);
    deadline.setHours(23, 59, 59, 999);
    if (deadline < today) {
      return 'Registration Closed';
    }
  }

  return 'Upcoming';
};

// Initialize seed data if empty
export const initializeData = () => {
  const existingEvents = getItem(STORAGE_KEYS.EVENTS);
  if (!existingEvents) {
    setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
  }

  const existingRegs = getItem(STORAGE_KEYS.REGISTRATIONS);
  if (!existingRegs) {
    setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(INITIAL_REGISTRATIONS));
  }
};

// Call initialization immediately on module load
initializeData();

// Get all registrations
export const getRegistrations = () => {
  try {
    const raw = getItem(STORAGE_KEYS.REGISTRATIONS);
    if (!raw) {
      setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(INITIAL_REGISTRATIONS));
      return INITIAL_REGISTRATIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse registrations:', err);
    return INITIAL_REGISTRATIONS;
  }
};

// Get all events with computed live registration counts and status
export const getEvents = () => {
  try {
    let raw = getItem(STORAGE_KEYS.EVENTS);
    let eventsList = [];

    if (!raw) {
      setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
      eventsList = [...INITIAL_EVENTS];
    } else {
      eventsList = JSON.parse(raw);
    }

    const registrations = getRegistrations();

    // Map through events to compute registeredCount and status dynamically
    return eventsList.map((event) => {
      const eventRegs = registrations.filter((r) => r.eventId === event.id);
      const registeredCount = eventRegs.length;
      const status = calculateEventStatus(event);
      const maxParticipants = Number(event.maxParticipants) || 100;
      const seatsLeft = Math.max(0, maxParticipants - registeredCount);
      const isFull = registeredCount >= maxParticipants;

      return {
        ...event,
        registeredCount,
        seatsLeft,
        isFull,
        status,
      };
    });
  } catch (err) {
    console.error('Failed to fetch events:', err);
    return INITIAL_EVENTS;
  }
};

// Get single event by ID
export const getEventById = (id) => {
  const allEvents = getEvents();
  return allEvents.find((evt) => evt.id === id) || null;
};

// Add new event
export const addEvent = (eventData) => {
  const raw = getItem(STORAGE_KEYS.EVENTS);
  const events = raw ? JSON.parse(raw) : [...INITIAL_EVENTS];

  const newId = `evt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const newEvent = {
    id: newId,
    name: eventData.name?.trim() || 'Untitled Event',
    tagline: eventData.tagline?.trim() || '',
    category: eventData.category || 'Workshop',
    date: eventData.date,
    time: eventData.time || '10:00 AM',
    venue: eventData.venue?.trim() || '',
    organizer: eventData.organizer?.trim() || 'Campus Club',
    description: eventData.description?.trim() || '',
    registrationDeadline: eventData.registrationDeadline || eventData.date,
    maxParticipants: Number(eventData.maxParticipants) || 100,
    isFeatured: Boolean(eventData.isFeatured),
    image:
      eventData.image?.trim() ||
      'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80',
    tags: eventData.tags || [eventData.category || 'Event'],
    createdAt: new Date().toISOString(),
  };

  // If new event is set as featured, optionally unfeature other events or keep
  if (newEvent.isFeatured) {
    events.forEach((evt) => {
      evt.isFeatured = false;
    });
  }

  events.unshift(newEvent);
  setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));

  // Trigger cross-component sync event
  window.dispatchEvent(new Event('clubsphere_data_changed'));
  return newEvent;
};

// Update existing event
export const updateEvent = (id, updatedData) => {
  const raw = getItem(STORAGE_KEYS.EVENTS);
  let events = raw ? JSON.parse(raw) : [...INITIAL_EVENTS];

  const index = events.findIndex((evt) => evt.id === id);
  if (index === -1) {
    throw new Error('Event not found');
  }

  // If updated to featured, clear others
  if (updatedData.isFeatured) {
    events.forEach((evt) => {
      evt.isFeatured = false;
    });
  }

  const updatedEvent = {
    ...events[index],
    ...updatedData,
    maxParticipants: Number(updatedData.maxParticipants) || events[index].maxParticipants || 100,
    updatedAt: new Date().toISOString(),
  };

  events[index] = updatedEvent;
  setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  window.dispatchEvent(new Event('clubsphere_data_changed'));
  return updatedEvent;
};

// Delete event
export const deleteEvent = (id) => {
  const raw = getItem(STORAGE_KEYS.EVENTS);
  let events = raw ? JSON.parse(raw) : [];

  const filtered = events.filter((evt) => evt.id !== id);
  setItem(STORAGE_KEYS.EVENTS, JSON.stringify(filtered));

  // Also remove registrations for this deleted event
  const regs = getRegistrations();
  const filteredRegs = regs.filter((r) => r.eventId !== id);
  setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(filteredRegs));

  window.dispatchEvent(new Event('clubsphere_data_changed'));
  return true;
};

// Add registration with duplicate checking & seat limits
export const addRegistration = (registrationData) => {
  const { eventId, fullName, email, college, year, phone } = registrationData;
  const registrations = getRegistrations();
  const event = getEventById(eventId);

  if (!event) {
    throw new Error('Event not found');
  }

  // Check if registration closed or completed
  if (event.status === 'Completed') {
    throw new Error('This event has already concluded. Registrations are closed.');
  }

  if (event.status === 'Registration Closed') {
    throw new Error('Registration deadline has passed for this event.');
  }

  // Check capacity
  if (event.registeredCount >= event.maxParticipants) {
    throw new Error('Registration Full. All seats have been occupied.');
  }

  // Check duplicate registration (case-insensitive email + eventId)
  const normalizedEmail = email.trim().toLowerCase();
  const isDuplicate = registrations.some(
    (reg) => reg.eventId === eventId && reg.email.trim().toLowerCase() === normalizedEmail
  );

  if (isDuplicate) {
    const error = new Error("You've already registered for this event using this email address.");
    error.name = 'DuplicateRegistrationError';
    error.isDuplicate = true;
    throw error;
  }

  // Generate unique Registration ID e.g. CS-2026-00429
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const regId = `CS-2026-${randomSuffix}`;

  const newReg = {
    id: regId,
    eventId,
    eventName: event.name,
    fullName: fullName.trim(),
    email: normalizedEmail,
    college: college.trim(),
    year,
    phone: phone.trim(),
    registeredAt: new Date().toISOString(),
    status: 'Confirmed',
  };

  registrations.unshift(newReg);
  setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
  window.dispatchEvent(new Event('clubsphere_data_changed'));

  return { registration: newReg, event };
};

// Auth utilities
export const getStoredAuth = () => {
  try {
    const raw = getItem(STORAGE_KEYS.AUTH);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const setStoredAuth = (adminUser) => {
  setItem(STORAGE_KEYS.AUTH, JSON.stringify(adminUser));
  window.dispatchEvent(new Event('clubsphere_auth_changed'));
};

export const clearStoredAuth = () => {
  if (isLocalStorageAvailable()) {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  }
  memoryStore[STORAGE_KEYS.AUTH] = null;
  window.dispatchEvent(new Event('clubsphere_auth_changed'));
};

// Reset system demo data
export const resetToSeedData = () => {
  setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
  setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(INITIAL_REGISTRATIONS));
  window.dispatchEvent(new Event('clubsphere_data_changed'));
};
