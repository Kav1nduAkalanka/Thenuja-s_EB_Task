export const USERS = [
  { id: "u-member-1", name: "Kavinda Perera", email: "kavinda.perera@aiesec.net", role: "member", teamName: "Team Alpha (Global Classroom)", initials: "KP", title: "Content Creator", avatarBg: "bg-[#0052CC]" },
  { id: "u-member-2", name: "Nimasha Fernando", email: "nimasha.fernando@aiesec.net", role: "member", teamName: "Team Alpha (Global Classroom)", initials: "NF", title: "Campaign Specialist", avatarBg: "bg-[#00B8D9]" },
  { id: "u-member-3", name: "Tharindu Silva", email: "tharindu.silva@aiesec.net", role: "member", teamName: "Team Beta (Eco Pioneers)", initials: "TS", title: "Digital Marketer", avatarBg: "bg-[#6554C0]" },
  { id: "u-leader-1", name: "Senuri Jayawardena", email: "senuri.jayawardena@aiesec.net", role: "leader", teamName: "Team Alpha (Global Classroom)", initials: "SJ", title: "Team Leader - Alpha", avatarBg: "bg-[#FFAB00]" },
  { id: "u-leader-2", name: "Kasun Wickramasinghe", email: "kasun.wickramasinghe@aiesec.net", role: "leader", teamName: "Team Beta (Eco Pioneers)", initials: "KW", title: "Team Leader - Beta", avatarBg: "bg-[#36B37E]" },
  { id: "u-lcvp", name: "Dulani Fernando", email: "dulani.fernando@aiesec.net", role: "lcvp", teamName: "Executive Board", initials: "DF", title: "LCVP oGV B2C", avatarBg: "bg-[#006644]" },
  { id: "u-admin", name: "Thenuja", email: "thenuja.tm@aiesec.net", role: "admin", teamName: "Talent Management", initials: "TM", title: "Candidate LCVP TM", avatarBg: "bg-[#403294]" }
];

export const INITIAL_CARDS = [
  { 
    id: "KB-01", 
    key: "OGV-101",
    title: "B2C Digital Campaign: Undergraduate Volunteer Testimonials Reel", 
    caption: "Fast-paced social media reel highlighting verified exchange experiences for Moratuwa undergraduates. High visual energy with upbeat trending audio.", 
    canvaUrl: "https://www.canva.com/design/DAGTrendReelsWinter26/view", 
    types: ["trend_based"], 
    column: "member", 
    priority: "high",
    uploaderName: "Tharindu Silva", 
    uploaderId: "u-member-3", 
    uploaderRole: "member", 
    teamName: "Team Beta (Eco Pioneers)", 
    createdAt: "2026-11-23 11:20", 
    startDate: "2026-11-20",
    dueDate: "2026-11-26",
    comments: [
      { id: "c-1", authorName: "Kasun Wickramasinghe", authorRole: "Team Leader", text: "Design verified. Ensure high logo contrast on the opening frame before escalating to Leader Review.", timestamp: "2026-11-23 12:45" }
    ] 
  },
  { 
    id: "KB-02", 
    key: "OGV-102",
    title: "Destination Portfolio: Egypt Cultural & Leadership Exchange Guide", 
    caption: "Comprehensive destination carousel for volunteer housing, local culture, and Cairo community leadership opportunities for Term 27.28 applicants.", 
    canvaUrl: "https://www.canva.com/design/DAGEgyptCountryPromo26/view", 
    types: ["country_based"], 
    column: "leader", 
    priority: "medium",
    uploaderName: "Kavinda Perera", 
    uploaderId: "u-member-1", 
    uploaderRole: "member", 
    teamName: "Team Alpha (Global Classroom)", 
    createdAt: "2026-11-22 14:00", 
    startDate: "2026-11-18",
    dueDate: "2026-11-25",
    comments: [
      { id: "c-2", authorName: "Senuri Jayawardena", authorRole: "Team Leader", text: "Great work on the typography and visa infographic. Reviewed and approved by Team Leader.", timestamp: "2026-11-22 16:30" }
    ] 
  },
  { 
    id: "KB-03", 
    key: "OGV-103",
    title: "Global Classroom SDG 4 Education Campaign: Winter Cohort", 
    caption: "Primary SDG 4 Quality Education awareness flyer for faculty noticeboards and Instagram story series with registered link in bio CTA.", 
    canvaUrl: "https://www.canva.com/design/DAGSDG4EducationMora/view", 
    types: ["project_based"], 
    column: "lcvp", 
    priority: "high",
    uploaderName: "Nimasha Fernando", 
    uploaderId: "u-member-2", 
    uploaderRole: "member", 
    teamName: "Team Alpha (Global Classroom)", 
    createdAt: "2026-11-21 09:00", 
    startDate: "2026-11-15",
    dueDate: "2026-11-24",
    comments: [
      { id: "c-3", authorName: "Dulani Fernando", authorRole: "LCVP oGV B2C", text: "LCVP Final Sign-off Granted: Certified Ready to Post on all official B2C channels.", timestamp: "2026-11-21 15:00" }
    ] 
  },
  { 
    id: "KB-04", 
    key: "OGV-104",
    title: "Vietnam Cultural Exchange: Ho Chi Minh City Youth Program", 
    caption: "Teaching English and cultural immersion program flyer tailored to first-year engineering and IT undergraduates seeking leadership development.", 
    canvaUrl: "https://www.canva.com/design/DAGVietnamExchange26/view", 
    types: ["country_based", "project_based"], 
    column: "member", 
    priority: "low",
    uploaderName: "Kavinda Perera", 
    uploaderId: "u-member-1", 
    uploaderRole: "member", 
    teamName: "Team Alpha (Global Classroom)", 
    createdAt: "2026-11-23 15:00", 
    startDate: "2026-11-22",
    dueDate: "2026-11-28",
    comments: [] 
  },
  { 
    id: "KB-05", 
    key: "OGV-105",
    title: "Instagram Carousel: 5 Reasons to Volunteer Abroad in 2027", 
    caption: "High-converting carousel post addressing common parental concerns, university credit validation, and international safety protocols.", 
    canvaUrl: "https://www.canva.com/design/DAG5ReasonsCarousel27/view", 
    types: ["trend_based"], 
    column: "leader", 
    priority: "medium",
    uploaderName: "Tharindu Silva", 
    uploaderId: "u-member-3", 
    uploaderRole: "member", 
    teamName: "Team Beta (Eco Pioneers)", 
    createdAt: "2026-11-22 10:30", 
    startDate: "2026-11-19",
    dueDate: "2026-11-25",
    comments: [
      { id: "c-5", authorName: "Kasun Wickramasinghe", authorRole: "Team Leader", text: "Reviewed. Visual alignment matches Brand Guidelines 27.28. Escalated for LCVP final sign-off.", timestamp: "2026-11-22 14:00" }
    ] 
  }
];
