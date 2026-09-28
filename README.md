# ClubSphere — College Club Event Management Platform

> **Your Campus. Your Clubs. Your Events.**

ClubSphere is a production-quality, responsive College Club Event Management web application designed for students to discover, search, filter, and register for campus activities, and for club administrators to schedule events, manage capacity, and track registrations in real time.

---

## 🌟 Features

### Student Experience
- **Campus Live Feed & Hero:** Interactive hero previewing live registrations, quick filters, and campus activity statistics.
- **Campus Community Statistics:** Dynamic highlights of 25+ events, 500+ student connections, 15+ workshops, and 10+ competitions.
- **Featured Event Split Showcase:** Prominently highlights flagship campus events (e.g., **HackSphere 2026**) with live capacity gauges, countdowns, and quick registration triggers.
- **Event Discovery (`/events`):**
  - Live search across Event Name, Description, and Venue.
  - Category pill filter with real-time counters (**All**, **Technical**, **Workshop**, **Cultural**, **Sports**, **Competition**, **Seminar**).
  - Sorting options: **Upcoming**, **Date: Earliest**, **Date: Latest**, and **Name: A–Z**.
  - Capacity & status badges: **Available**, **Only X seats left**, **Registration Full**, **Registration Closed**, **Completed**.
- **Event Details (`/events/:id`):** High-resolution banner, full description, schedule coordinates, host club, capacity progress bar, and 404 handler.
- **Fast-Pass Registration Modal:**
  - Form validation for Full Name, College, Academic Year dropdown, valid email, and Indian 10-digit mobile number format (`[6-9]\d{9}`).
  - **Duplicate Registration Prevention:** Disallows registering the same email address for the same event while permitting registration for different events.
  - **Confirmation Pass:** Generates a unique Registration ID (e.g. `CS-2026-00421`) with one-click copy and instant confirmation screen.

### Admin Experience
- **Secure Authentication (`/admin/login`):**
  - Protected admin routes with session persistence in `localStorage`.
  - Unauthenticated visitors are redirected to the login interface.
- **Dynamic Dashboard (`/admin`):**
  - 4 real-time computed statistics cards: **Total Events**, **Upcoming Events**, **Total Registrations**, **Active Events**.
  - Recent Registrations feed and upcoming schedule with capacity indicators.
- **Event Management (`/admin/events`):**
  - Full management table with thumbnail previews, categories, dates, venues, registration counts, and status.
  - Automatic status calculation: **Upcoming**, **Registration Closed** (past deadline), **Completed** (past event date).
  - **Add Event (`/admin/events/new`):** Validation for all fields, curated image presets, and featured event toggle.
  - **Edit Event (`/admin/events/edit/:id`):** Pre-fills existing data and updates live across the application.
  - **Delete Event:** Confirmation dialog before permanent removal and automatic cascade cleanup of event registrations.
- **Registrations Manager (`/admin/registrations`):**
  - Search by student name, email, event, college, or Registration ID.
  - Multi-filtering by Event, Academic Year, and date sorting.
  - **Registration Detail Modal:** Student Info, Event Info, and Verification Record.
  - **CSV Export:** Robust Blob-based CSV download for on-ground campus gate scanning.
- **Reset Demo Data:** One-click utility in the admin sidebar to restore initial seed data anytime.

---

## 🛠️ Tech Stack

- **React 18**
- **Vite 5**
- **Tailwind CSS 3**
- **React Router 6**
- **Lucide React** (icons)
- **localStorage** (client-side data persistence with reactive window events)

---

## 🚀 Installation & Running

```bash
# Navigate to project directory
cd clubsphere

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Production Build

```bash
npm run build
```

---

## 🔐 Admin Credentials

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@clubsphere.com` | `admin123` |

*(An **Auto-fill** button is also available on `/admin/login` for fast evaluation).*

---

## 🌐 Routes

| Path | View | Access |
|---|---|---|
| `/` | Landing page, Hero, Stats, Featured Event, About | Public |
| `/events` | Event discovery, search, filter, and sorting | Public |
| `/events/:id` | Event detail page & registration trigger | Public |
| `/admin/login` | Administrator sign-in portal | Public |
| `/admin` | Admin dashboard with live stats & recent feeds | Protected |
| `/admin/events` | Event management table & deletion | Protected |
| `/admin/events/new` | Event creation form | Protected |
| `/admin/events/edit/:id` | Event editing form | Protected |
| `/admin/registrations` | Registration manager, details modal & CSV export | Protected |

---

## 🏛️ Architecture & Persistence

ClubSphere uses browser `localStorage` as its local data engine:
- Storage Keys: `clubsphere_events`, `clubsphere_registrations`, `clubsphere_auth`.
- **Automatic Seed Initialization:** If `localStorage` is empty on first boot, it populates realistic seed events and registrations.
- **Dynamic Synchronization:** Custom `clubsphere_data_changed` and `clubsphere_auth_changed` events keep components and routes synchronized across views and tabs in real time without page refreshes.
- **Relational Integrity:** Deleting an event safely removes its associated registration records to prevent orphan data.

---

### Testing

Run the automated test suite:

```bash
npm test
```

---

## 🚀 Deployment

ClubSphere is configured for fast edge deployment on **Vercel**:

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Routing**: `vercel.json` provides edge rewrites to support clean React Router Single Page Application navigation across all routes without 404s on page refresh.

---

## 🛡️ License
Built for campus communities. © 2026 ClubSphere.
