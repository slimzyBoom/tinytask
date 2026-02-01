# TinyTasks 🧩  
*A student-first micro-task platform*

TinyTasks is a student-focused platform that enables students to **get small tasks done** and **earn money helping others**, all within a trusted, campus-aware environment.

Unlike traditional freelancing or gig platforms, TinyTasks is designed around **student realities**: short tasks, tight schedules, trust concerns, and safety.

---

## 🚀 Vision

To create the most trusted and accessible way for students to exchange help and earn money through small, real-world and remote tasks.

TinyTasks is **not**:
- A job board
- A freelancing marketplace
- An employer–employee platform
- A platform for companies or non-students (MVP)

---

## 🎯 Core Value

- **For students who need help**:  
  Get small tasks done quickly by fellow students you can trust.

- **For students who want to earn**:  
  Make flexible income between classes without formal employment.

- **For the platform**:  
  Enable safe, structured micro-transactions between students.

---

## 🧠 Key Principles

- **Trust is earned progressively**, not assumed
- **Safety before scale**
- **One account, multiple roles** (users can post and complete tasks)
- **Money is protected by escrow**
- **Behavior matters as much as identity**

---

## 👥 Who This Platform Is For

- Currently enrolled students
- Students who:
  - Need help with assignments, errands, or small tasks
  - Want to earn money flexibly
- Early MVP focus: campus-dense environments

---

## 🔑 Core Features (MVP)

### 1. User Accounts
- Email + password authentication
- Email verification
- Single account for both posting and completing tasks

---

### 2. Task Types

TinyTasks supports three task types based on **risk level**:

#### 🟢 Remote Tasks (Lowest Risk)
- Fully online (typing, design, research, tutoring, etc.)
- Available to verified students

#### 🟡 Public Location Tasks
- Physical tasks in open, visible campus locations
- Daytime only (6am–6pm)
- Requires higher trust level

#### 🔴 Private Location Tasks (Highest Risk)
- Tasks in private spaces (hostels, apartments)
- Heavy safety warnings
- Strict access control

---

### 3. Tiered Verification System

Verification is **progressive and contextual**.

| Tier | Purpose | Requirements | Capabilities |
|----|--------|-------------|--------------|
| Tier 0 | Observer | Email verification | Browse tasks |
| Tier 1 | Basic Student | Student ID + face verification | Post tasks, apply to remote tasks |
| Tier 2 | Trusted Student | NIN or enhanced biometrics + good history | Withdraw earnings, public tasks |
| Tier 3 | Fully Verified | Strong reputation + history | Private location tasks |

Verification increases only when users attempt **higher-risk actions**.

---

### 4. Payments & Escrow
- Payments handled via Paystack
- Poster funds task **before** work begins
- Money held in escrow
- Funds released:
  - On completion confirmation, or
  - Automatically after timeout
- Disputes freeze escrow until resolved

---

### 5. Messaging
- In-app messaging unlocked only after tasker selection
- Used for coordination and proof sharing
- Messages auto-expire after a fixed period

---

### 6. Reviews & Reputation
- 5-star rating system
- Both poster and tasker rate each other
- Ratings influence:
  - Feed visibility
  - Tier progression
  - Trust score

---

### 7. Safety & Moderation
- Task classification by location
- Daytime enforcement for physical tasks
- Location obfuscation in feeds
- Location tracking during high-risk tasks
- Reporting system for users, tasks, messages, and reviews
- Manual admin moderation and dispute resolution

---

## 🏗️ System Architecture (High Level)


### Backend
- Node.js + Express + Typescript
- REST APIs for core features
- WebSockets for:
  - Messaging
  - Notifications
  - Location updates

### Data Layer
- MongoDB 
- Redis (sessions, background jobs)
- Cloudinary for images and uploads

### External Services
- Paystack (payments)
- Identity verification providers
- Maps & geolocation services
- Email delivery service

---

## 🔐 Security & Trust Model

- Role- and tier-based access control
- Strict task and payment state machines
- Encrypted sensitive data
- Rate limiting and abuse detection
- Full audit trail for verification and disputes

---

## 📊 Success Metrics (MVP)

- Task completion rate > 85%
- Dispute rate < 5%
- 3-month user retention > 40%
- Healthy balance between task posters and taskers

---

## 🧭 Product Philosophy

TinyTasks is built on the idea that:
> **Trust is not declared — it is demonstrated.**

Identity, behavior, and community feedback work together to create a safe and useful student marketplace.

---

## 📌 Status

This project is under active development.  
Features and scope may evolve based on user research and testing.

---

## 🤝 Contributing

More details coming soon.

For now:
- Follow clean architecture
- Respect the trust and safety model
- Avoid shortcuts that compromise user protection
