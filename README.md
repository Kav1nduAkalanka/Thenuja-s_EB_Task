# AIESEC in CS Performance & Deliverables Tracker
**AIESEC in University of Moratuwa · Term 27.28**  
*LCVP TM Candidate Task · Candidate: Thenuja · Deadline: 24th November 2026*

---

## 📌 Executive Overview

The **AIESEC in CS Tracker** is an enterprise-grade performance management and campaign deliverables system featuring:
- **High-Density Kanban Workspace UI/UX:** Clean, responsive 3-column kanban board, collapsible navigation sidebar, 2-column detailed modal drawer, breadcrumbs, and status badges.
- **Role-Based Access Control (RBAC):** Strict governance across 4 distinct entity clearance levels:
  $$\text{Team Member (L1: Creator)} \longrightarrow \text{Team Leader (L2: Reviewer)} \longrightarrow \text{LCVP (L3: Sign-off)} \longrightarrow \text{LCVP TM / Admin (L4: Governance)}$$
- **Comprehensive Workspace Views:**
  1. 📋 **Kanban Board** with 3 stages (*Submissions*, *Leader Review*, *Ready to Post*), WIP limits, and HTML5 drag-and-drop.
  2. 🗺️ **Roadmap / Timeline** with weekly Gantt scheduling across Term 27.28.
  3. 🚀 **Releases Archive** showcasing verified deliverables ready for social media publishing.
  4. 🏆 **Scoreboard & Recognition (RnR)** with monthly rankings, points calculations, and celebration confetti.
  5. 👥 **Team Directory** with squad rosters (Team Alpha & Team Beta) and clearance levels.
  6. 🛡️ **Governance & Safety (RBAC)** for admin account authorization and registry audits.
- **Interactive Keyboard Shortcuts:**
  - `c` &mdash; Quick Create Deliverable issue modal
  - `/` &mdash; Instant focus on Search filter
  - `[` &mdash; Toggle collapsible navigation sidebar
  - `Esc` &mdash; Close any active modal / drawer

---

## 🛡️ Role-Based Access Control (RBAC) Specification

| Role | Clearance Level | Permitted Workflow Operations | Restricted Operations |
|---|---|---|---|
| **Team Member** | Level 1: Creation & Execution | &bull; Create deliverable & link Canva asset<br>&bull; Tag campaign classification (`Trend`, `Country`, `Project`)<br>&bull; View card progress and comments<br>&bull; View personal score and rankings | ❌ Cannot move cards to Column 2 or Column 3<br>❌ Cannot access Admin Safety panel |
| **Team Leader** | Level 2: Quality Review | &bull; Review Column 1 submissions<br>&bull; Add review feedback comments<br>&bull; Move cards from Column 1 &rarr; Column 2<br>&bull; Request revisions (return card to Column 1)<br>&bull; View team velocity metrics | ❌ Cannot move cards to Column 3 (Final Authorization)<br>❌ Cannot access Admin Safety panel |
| **LCVP oGV B2C** | Level 3: Final Authorization | &bull; Final check on Column 2 deliverables<br>&bull; Authorize publication (Move Column 2 &rarr; Column 3: Ready to Post)<br>&bull; Release executive campaign assets<br>&bull; Access LC-wide analytics | ❌ Cannot approve pending leadership registrations |
| **Candidate LCVP TM** | Level 4: Super-Admin & Governance | &bull; Full governance & audit log oversight<br>&bull; Confirm/Approve pending Team Leader and LCVP accounts<br>&bull; Reset registry data & inspect telemetry | Full access across all entity functions |

---

## 🎨 Design System & Aesthetic Standards

- **Color Palette:**
  - AIESEC Blue: `#0052CC` (hover: `#0747A6`, light: `#DEEBFF`, border: `#B3D4FF`)
  - Dark Slate Text: `#172B4D`
  - Subtle Muted Text: `#5E6C84` / `#6B778C`
  - Canvas Background: `#F4F5F7`
  - Card Surfaces: `#FFFFFF` with subtle borders (`#DFE1E6`) and elevation shadows.
  - Status Badges:
    - `SUBMISSIONS`: Blue (`#DEEBFF` / `#0052CC`)
    - `LEADER REVIEW`: Amber (`#FFF0B3` / `#172B4D`)
    - `READY TO POST`: Green (`#E3FCEF` / `#006644`)
- **Typography:** Inter with optimal typographic scales, tracking, and monospace keys (`OGV-101`).

---

## 🚀 Running the Portal

### 1. Standalone Instant Run (Zero Configuration Required):
Open [index.html](file:///home/kavi-athena/Eb/index.html) in your browser. All React 18, Tailwind, and Babel components are fully self-contained.

### 2. Simple HTTP Server:
```bash
cd /home/kavi-athena/Eb
python3 -m http.server 3000
```
Open `http://localhost:3000` in any web browser.
