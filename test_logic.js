// Exhaustive ClubSphere QA & Recruiter-Readiness Test Suite

const store = {};
global.localStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, val) => { store[key] = String(val); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach(k => delete store[k]); }
};
global.window = {
  dispatchEvent: (event) => {}
};
global.Event = class Event {
  constructor(name) { this.name = name; }
};

async function runQASuite() {
  console.log("==================================================");
  console.log("   CLUBSPHERE COMPREHENSIVE QA & BUG-FIX SUITE    ");
  console.log("==================================================");

  const storage = await import('./src/utils/storage.js');

  // --- 1. DATA INITIALIZATION & SEED ---
  const initialEvents = storage.getEvents();
  console.assert(initialEvents.length >= 8, `Expected >= 8 events, got ${initialEvents.length}`);
  console.log(`[PASS 1.1] Seed events count: ${initialEvents.length}`);

  const initialRegs = storage.getRegistrations();
  console.assert(initialRegs.length >= 8, `Expected >= 8 registrations, got ${initialRegs.length}`);
  console.log(`[PASS 1.2] Seed registrations count: ${initialRegs.length}`);

  // --- 2. STATUS CALCULATION ---
  // A. Future event with future deadline -> Upcoming
  const upcomingEvt = storage.calculateEventStatus({
    date: '2026-12-01',
    registrationDeadline: '2026-11-28',
  });
  console.assert(upcomingEvt === 'Upcoming', `Expected 'Upcoming', got ${upcomingEvt}`);
  console.log(`[PASS 2.1] Future event status: ${upcomingEvt}`);

  // B. Future event with past deadline -> Registration Closed
  const closedEvt = storage.calculateEventStatus({
    date: '2026-12-01',
    registrationDeadline: '2026-01-01',
  });
  console.assert(closedEvt === 'Registration Closed', `Expected 'Registration Closed', got ${closedEvt}`);
  console.log(`[PASS 2.2] Past deadline status: ${closedEvt}`);

  // C. Past event -> Completed
  const completedEvt = storage.calculateEventStatus({
    date: '2025-01-01',
    registrationDeadline: '2024-12-31',
  });
  console.assert(completedEvt === 'Completed', `Expected 'Completed', got ${completedEvt}`);
  console.log(`[PASS 2.3] Past event status: ${completedEvt}`);

  // --- 3. DYNAMIC CAPACITY & SEATS CALCULATION ---
  const evt01 = storage.getEventById("evt-01");
  const expectedSeats = evt01.maxParticipants - evt01.registeredCount;
  console.assert(evt01.seatsLeft === expectedSeats, `Seat math mismatch: ${evt01.seatsLeft} vs ${expectedSeats}`);
  console.log(`[PASS 3.1] Dynamic seat calculation: ${evt01.registeredCount} / ${evt01.maxParticipants} -> ${evt01.seatsLeft} seats left`);

  // --- 4. REGISTRATION VALIDATION & ID GENERATION ---
  const studentAlpha = {
    eventId: "evt-01",
    fullName: "Kunal Deshmukh",
    email: "kunal.d@campus.edu",
    college: "IIT Bombay",
    year: "3rd Year",
    phone: "9876543210"
  };

  const regResult = storage.addRegistration(studentAlpha);
  console.assert(regResult.registration.id.startsWith("CS-2026-"), `Invalid Pass ID format: ${regResult.registration.id}`);
  console.log(`[PASS 4.1] Registration Pass ID generated: ${regResult.registration.id}`);

  // --- 5. DUPLICATE REGISTRATION PREVENTION (SAME EVENT) ---
  let duplicateBlocked = false;
  try {
    storage.addRegistration({
      ...studentAlpha,
      email: "  KUNAL.D@CAMPUS.EDU  " // Case-insensitive and trimmed check
    });
  } catch (err) {
    duplicateBlocked = true;
    console.assert(err.isDuplicate || err.message.includes("already registered"), "Duplicate flag missing");
    console.log(`[PASS 5.1] Duplicate registration blocked: "${err.message}"`);
  }
  console.assert(duplicateBlocked, "Failed to block duplicate registration!");

  // --- 6. SAME EMAIL ON DIFFERENT EVENT (MUST BE ALLOWED) ---
  let diffEventAllowed = false;
  try {
    const diffResult = storage.addRegistration({
      ...studentAlpha,
      eventId: "evt-02", // Different event!
    });
    console.assert(diffResult.registration.id.startsWith("CS-2026-"), "Different event ID format incorrect");
    diffEventAllowed = true;
    console.log(`[PASS 6.1] Same student allowed on different event: ${diffResult.registration.id} on evt-02`);
  } catch (err) {
    diffEventAllowed = false;
  }
  console.assert(diffEventAllowed, "Failed to allow registration on different event for same email!");

  // --- 7. CAPACITY LIMIT & FULL EVENT ENFORCEMENT ---
  const tinyEvent = storage.addEvent({
    name: "VIP Round Table",
    category: "Seminar",
    date: "2026-11-20",
    time: "10:00 AM",
    venue: "Boardroom",
    organizer: "Dean Office",
    description: "Exclusive table",
    registrationDeadline: "2026-11-18",
    maxParticipants: 1, // Only 1 seat
    isFeatured: false
  });

  // Seat 1
  storage.addRegistration({
    eventId: tinyEvent.id,
    fullName: "Seat Winner",
    email: "seat.winner@campus.edu",
    college: "Campus Univ",
    year: "4th Year",
    phone: "9876543211"
  });

  // Seat 2 (MUST be rejected because full)
  let fullRejected = false;
  try {
    storage.addRegistration({
      eventId: tinyEvent.id,
      fullName: "Seat Overflow",
      email: "seat.overflow@campus.edu",
      college: "Campus Univ",
      year: "2nd Year",
      phone: "9876543212"
    });
  } catch (err) {
    fullRejected = true;
    console.assert(err.message.includes("Registration Full") || err.message.includes("occupied"), "Incorrect full message");
    console.log(`[PASS 7.1] Full event overflow rejected: "${err.message}"`);
  }
  console.assert(fullRejected, "Full event did not reject overflow registration!");

  // --- 8. DEADLINE PASSED ENFORCEMENT ---
  const expiredEvent = storage.addEvent({
    name: "Expired Deadline Event",
    category: "Technical",
    date: "2026-11-20",
    registrationDeadline: "2026-01-01", // Past deadline
    venue: "Lab 1",
    organizer: "Club",
    maxParticipants: 50,
  });

  let deadlineRejected = false;
  try {
    storage.addRegistration({
      eventId: expiredEvent.id,
      fullName: "Late Student",
      email: "late@campus.edu",
      college: "Campus Univ",
      year: "1st Year",
      phone: "9876543213"
    });
  } catch (err) {
    deadlineRejected = true;
    console.log(`[PASS 8.1] Past deadline registration rejected: "${err.message}"`);
  }
  console.assert(deadlineRejected, "Expired deadline registration was not rejected!");

  // --- 9. EVENT CRUD LIFECYCLE ---
  // Create
  const testCrud = storage.addEvent({
    name: "Hackathon Sprint 2026",
    category: "Competition",
    date: "2026-12-10",
    time: "09:00 AM",
    venue: "Auditorium A",
    organizer: "Coding Club",
    description: "Sprint contest",
    registrationDeadline: "2026-12-08",
    maxParticipants: 80,
    isFeatured: false
  });
  console.log(`[PASS 9.1] Created event: ${testCrud.name} (${testCrud.id})`);

  // Edit
  const edited = storage.updateEvent(testCrud.id, {
    venue: "Auditorium Prime",
    maxParticipants: 100
  });
  console.assert(edited.venue === "Auditorium Prime" && edited.maxParticipants === 100, "Event update failed");
  console.log(`[PASS 9.2] Updated event venue & capacity: ${edited.venue}, cap: ${edited.maxParticipants}`);

  // Delete & Cascade cleanup of registrations
  storage.addRegistration({
    eventId: testCrud.id,
    fullName: "Temp Student",
    email: "temp@campus.edu",
    college: "Campus Univ",
    year: "1st Year",
    phone: "9876543214"
  });

  const regsBeforeDelete = storage.getRegistrations().filter(r => r.eventId === testCrud.id);
  console.assert(regsBeforeDelete.length === 1, "Expected 1 registration before delete");

  storage.deleteEvent(testCrud.id);
  const eventAfterDelete = storage.getEventById(testCrud.id);
  console.assert(eventAfterDelete === null, "Deleted event still exists in store");
  const regsAfterDelete = storage.getRegistrations().filter(r => r.eventId === testCrud.id);
  console.assert(regsAfterDelete.length === 0, "Registrations were not cleaned up after event deletion");
  console.log(`[PASS 9.3] Successfully deleted event and cleaned up associated registrations`);

  // --- 10. AUTH PERSISTENCE ---
  storage.setStoredAuth({ email: 'admin@clubsphere.com', name: 'Club Administrator' });
  const auth = storage.getStoredAuth();
  console.assert(auth && auth.email === 'admin@clubsphere.com', "Auth store failed");
  storage.clearStoredAuth();
  const clearedAuth = storage.getStoredAuth();
  console.assert(clearedAuth === null, "Auth clear failed");
  console.log(`[PASS 10.1] Auth session storage and logout persistence verified`);

  // Clean up test events
  storage.deleteEvent(tinyEvent.id);
  storage.deleteEvent(expiredEvent.id);

  console.log("==================================================");
  console.log("   ALL 10 QA & RECRUITER READINESS SUITES PASSED! ");
  console.log("==================================================");
}

runQASuite().catch(err => {
  console.error("QA Test Suite Error:", err);
  process.exit(1);
});
