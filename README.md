# 🚑 Ambulance Dispatch System

## 🔖 Project Title & Description
**Ambulance Dispatch System** — a web application built with **Next.js** and **Supabase** that enables individuals to request ambulance services and gives administrators tools to manage dispatch, patient records, and service history.  

**Who it's for:**  
- **Users (Patients/Callers):** Need a simple way to request an ambulance quickly.  
- **Administrators (Dispatchers/Managers):** Need tools to track requests, assign ambulances, and manage service history.  

**Why it matters:** Streamlines emergency workflows, improves response times, and organizes patient/service records for better healthcare outcomes.  

---

## 🛠️ Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/), Tailwind CSS, React Hook Form  
- **Backend & Database:** [Supabase](https://supabase.com/) (Postgres, Auth, Storage, Realtime)  
- **Testing:** Jest, React Testing Library, Cypress (E2E)  
- **Deployment:** Vercel (Next.js) + Supabase Cloud  
- **Dev Tools:** GitHub (repo, issues, CI/CD), Supabase CLI, Docker (optional for local db)  

---

## 🧠 AI Integration Strategy

- **Code Generation:** Use AI to scaffold API routes (`app/api/*/route.ts`) and React components. Provide Supabase schema + file tree for context.  
- **Testing:** AI-assisted unit and E2E tests. Example: “Generate 5 Jest tests for this request form, covering required fields and invalid input.”  
- **Documentation:** AI maintains inline comments, docstrings, and keeps README + schema docs updated when features change.  
- **Context-aware Prompts:** Supply AI with:
  - DB schema migrations  
  - Next.js file structure (`tree`)  
  - Diffs for new features  

---

## 🎯 Project Goals

- **Primary Objective:** A fast, reliable ambulance request + dispatch system.  
- **Problem Solved:** Reduces friction in emergency requests, improves coordination for ambulance providers.  
- **Value Provided:** Faster response times, transparent service tracking, and better patient care.  

---

## 📦 Project Scope

### Included
- User-facing ambulance request form (`/request`)  
- Admin dashboard for requests + ambulance availability  
- Ambulance assignment flow  
- Basic patient records & service history  

### Excluded (Future Enhancements)
- Real-time GPS streaming  
- Hospital integration  
- Payment processing  
- Advanced role management  

---

## 🗄️ Supabase Schema (Draft)

```sql
-- Requests
create table requests (
  id uuid primary key default gen_random_uuid(),
  caller_name text not null,
  phone text not null,
  address text not null,
  latitude double precision,
  longitude double precision,
  emergency_description text not null,
  priority text check (priority in ('low','medium','high')) default 'medium',
  status text check (status in ('pending','assigned','dispatched','arrived','completed')) default 'pending',
  created_at timestamptz default now()
);

-- Ambulances
create table ambulances (
  id uuid primary key default gen_random_uuid(),
  identifier text not null unique,
  status text check (status in ('available','en_route','busy','offline')) default 'available',
  last_lat double precision,
  last_lng double precision,
  last_seen_at timestamptz
);

-- Assignments
create table assignments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references requests(id),
  ambulance_id uuid references ambulances(id),
  assigned_by uuid, -- admin user id
  dispatched_at timestamptz,
  arrived_at timestamptz,
  completed_at timestamptz,
  notes text
);

