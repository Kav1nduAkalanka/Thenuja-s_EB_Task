/**
 * oGV B2C Performance & Flyer Portal - Kanban Edition
 * AIESEC in University of Moratuwa · Term 27.28
 * Default Seed Data with 3-Column Kanban Workflow & Type Tags
 */

const INITIAL_DATA = {
  users: [
    {
      id: "u-member-1",
      name: "Kavinda Perera",
      email: "kavinda.perera@aiesec.net",
      password: "password123",
      role: "member",
      teamId: "team-alpha",
      teamName: "Team Alpha (Global Classroom)",
      avatar: "👨‍🎓",
      approved: true,
      bio: "oGV B2C Content Creator"
    },
    {
      id: "u-member-2",
      name: "Nimasha Fernando",
      email: "nimasha.fernando@aiesec.net",
      password: "password123",
      role: "member",
      teamId: "team-alpha",
      teamName: "Team Alpha (Global Classroom)",
      avatar: "👩‍🎓",
      approved: true,
      bio: "Country-based campaigns lead"
    },
    {
      id: "u-member-3",
      name: "Tharindu Silva",
      email: "tharindu.silva@aiesec.net",
      password: "password123",
      role: "member",
      teamId: "team-beta",
      teamName: "Team Beta (Eco Pioneers)",
      avatar: "👨‍💼",
      approved: true,
      bio: "Trend & meme marketing specialist"
    },
    {
      id: "u-member-4",
      name: "Rashmi De Silva",
      email: "rashmi.de.silva@aiesec.net",
      password: "password123",
      role: "member",
      teamId: "team-beta",
      teamName: "Team Beta (Eco Pioneers)",
      avatar: "👩‍💼",
      approved: true,
      bio: "Project-based SDG showcase curator"
    },
    {
      id: "u-leader-1",
      name: "Senuri Jayawardena",
      email: "senuri.jayawardena@aiesec.net",
      password: "password123",
      role: "leader",
      teamId: "team-alpha",
      teamName: "Team Alpha (Global Classroom)",
      avatar: "👩‍💻",
      approved: true,
      bio: "Team Leader · oGV B2C Marketing"
    },
    {
      id: "u-leader-2",
      name: "Kasun Wickramasinghe",
      email: "kasun.wickramasinghe@aiesec.net",
      password: "password123",
      role: "leader",
      teamId: "team-beta",
      teamName: "Team Beta (Eco Pioneers)",
      avatar: "👨‍💻",
      approved: true,
      bio: "Team Leader · Physical & Digital Activations"
    },
    {
      id: "u-lcvp",
      name: "Dulani Fernando",
      email: "dulani.fernando@aiesec.net",
      password: "password123",
      role: "lcvp",
      department: "oGV B2C",
      avatar: "👩‍⚖️",
      approved: true,
      bio: "LCVP oGV B2C · Term 27.28"
    },
    {
      id: "u-admin",
      name: "Thenuja (Candidate LCVP TM)",
      email: "thenuja.tm@aiesec.net",
      password: "password123",
      role: "admin",
      department: "Talent Management",
      avatar: "🌟",
      approved: true,
      bio: "Candidate LCVP TM · Evaluator & Administrator"
    }
  ],

  teams: [
    { id: "team-alpha", name: "Team Alpha (Global Classroom)", leaderId: "u-leader-1" },
    { id: "team-beta", name: "Team Beta (Eco Pioneers)", leaderId: "u-leader-2" }
  ],

  /**
   * Kanban Columns:
   * 1. 'member' (Team Member column - newly submitted or being revised)
   * 2. 'leader' (Team Leader column - reviewed & moved by TL, awaiting LCVP check)
   * 3. 'lcvp'   (LCVP column - final approved by LCVP, Ready to Post!)
   *
   * Types:
   * 'trend_based'   -> 📌 Trend Based
   * 'country_based' -> 🌍 Country Based
   * 'project_based' -> 🎯 Project Based
   */
  flyers: [
    // Column 1: Team Member Submissions
    {
      id: "KB-01",
      title: "TikTok / Reel Trend: 'Tell Me You Volunteered Without Telling Me'",
      caption: "Fast-paced Instagram reel & flyer template riding on the viral campus sound. Focus on relatable exchange memories.",
      canvaUrl: "https://www.canva.com/design/DAGTrendReelsWinter26/view",
      types: ["trend_based"],
      column: "member", // In Column 1: Team Member
      uploaderId: "u-member-3",
      uploaderName: "Tharindu Silva",
      uploaderRole: "member",
      teamId: "team-beta",
      teamName: "Team Beta (Eco Pioneers)",
      uploadDate: "2026-11-23T11:20:00",
      month: "2026-11",
      comments: [
        {
          id: "c-101",
          authorName: "Kasun Wickramasinghe",
          authorRole: "Team Leader",
          text: "Love the dynamic pacing! Make sure the font on the 3-second hook is readable on mobile screens.",
          timestamp: "2026-11-23 12:45"
        }
      ]
    },
    {
      id: "KB-02",
      title: "Discover Egypt: Pyramids & Cairo Leadership Adventure",
      caption: "Country focus carousel showcasing living expenses, volunteer accommodations, and cultural spots in Cairo & Alexandria.",
      canvaUrl: "https://www.canva.com/design/DAGEgyptCountryPromo26/view",
      types: ["country_based"],
      column: "member", // In Column 1: Team Member
      uploaderId: "u-member-1",
      uploaderName: "Kavinda Perera",
      uploaderRole: "member",
      teamId: "team-alpha",
      teamName: "Team Alpha (Global Classroom)",
      uploadDate: "2026-11-23T14:15:00",
      month: "2026-11",
      comments: []
    },

    // Column 2: Team Leader Column (Reviewed by TL, awaiting LCVP final check)
    {
      id: "KB-03",
      title: "Global Classroom Vietnam: Teach English in Da Nang",
      caption: "SDG 4 Project-focused flyer detailing 6-week teaching opportunity, volunteer support package, and partner schools.",
      canvaUrl: "https://www.canva.com/design/DAGVietnamWinter26/view",
      types: ["country_based", "project_based"],
      column: "leader", // In Column 2: Team Leader
      uploaderId: "u-member-1",
      uploaderName: "Kavinda Perera",
      uploaderRole: "member",
      teamId: "team-alpha",
      teamName: "Team Alpha (Global Classroom)",
      uploadDate: "2026-11-22T09:30:00",
      month: "2026-11",
      comments: [
        {
          id: "c-102",
          authorName: "Senuri Jayawardena",
          authorRole: "Team Leader",
          text: "Reviewed and brand-checked! Verified dates and Moratuwa logo. Moved to Team Leader column for Dulani's final sign-off.",
          timestamp: "2026-11-22 14:10"
        }
      ]
    },
    {
      id: "KB-04",
      title: "EcoLeaders Brazil: Amazon Rainforest Biodiversity Project",
      caption: "SDG 13 Climate Action flyer with engaging visuals of wildlife conservation and environmental advocacy in São Paulo.",
      canvaUrl: "https://www.canva.com/design/DAGBrazilEco26/view",
      types: ["project_based"],
      column: "leader", // In Column 2: Team Leader
      uploaderId: "u-member-2",
      uploaderName: "Nimasha Fernando",
      uploaderRole: "member",
      teamId: "team-alpha",
      teamName: "Team Alpha (Global Classroom)",
      uploadDate: "2026-11-22T16:00:00",
      month: "2026-11",
      comments: [
        {
          id: "c-103",
          authorName: "Senuri Jayawardena",
          authorRole: "Team Leader",
          text: "Strong visuals on climate action. Ready for LCVP final move.",
          timestamp: "2026-11-22 18:20"
        }
      ]
    },

    // Column 3: LCVP Column (Final Approved by LCVP -> Ready to Post!)
    {
      id: "KB-05",
      title: "Campus Exchange Fair 2026 - Civil Foyer Launch Promo",
      caption: "On-ground physical activation promotional flyer announcing 40+ destinations and 1-on-1 consultancy booth.",
      canvaUrl: "https://www.canva.com/design/DAGExchangeFairMora26/view",
      types: ["project_based", "trend_based"],
      column: "lcvp", // In Column 3: LCVP Approved
      uploaderId: "u-member-1",
      uploaderName: "Kavinda Perera",
      uploaderRole: "member",
      teamId: "team-alpha",
      teamName: "Team Alpha (Global Classroom)",
      uploadDate: "2026-11-20T10:00:00",
      month: "2026-11",
      comments: [
        {
          id: "c-104",
          authorName: "Senuri Jayawardena",
          authorRole: "Team Leader",
          text: "Checked booth schedule and venue permission. Approved from team.",
          timestamp: "2026-11-20 11:30"
        },
        {
          id: "c-105",
          authorName: "Dulani Fernando",
          authorRole: "LCVP oGV B2C",
          text: "Verified with LCVP BD. Excellent flyer! Moved to LCVP column. Ready to post across all official Mora channels.",
          timestamp: "2026-11-20 15:45"
        }
      ]
    },
    {
      id: "KB-06",
      title: "Winter Rush Trend: 'Choose Your Next Chapter' Story Series",
      caption: "Viral interactive story series prompting undergraduates to vote on destinations. High engagement format.",
      canvaUrl: "https://www.canva.com/design/DAGWinterRushStory26/view",
      types: ["trend_based", "country_based"],
      column: "lcvp", // In Column 3: LCVP Approved
      uploaderId: "u-member-2",
      uploaderName: "Nimasha Fernando",
      uploaderRole: "member",
      teamId: "team-alpha",
      teamName: "Team Alpha (Global Classroom)",
      uploadDate: "2026-11-21T13:00:00",
      month: "2026-11",
      comments: [
        {
          id: "c-106",
          authorName: "Dulani Fernando",
          authorRole: "LCVP oGV B2C",
          text: "Top engagement format. Final approval granted. Scheduled for Meta Business Suite.",
          timestamp: "2026-11-21 16:30"
        }
      ]
    }
  ],

  // oGV B2C Official KPIs
  kpis: {
    campaignsTotal: { label: "Campaigns & Events", current: 18, target: 24, unit: "Events" },
    socialReach: { label: "Social Media Reach", current: 48500, target: 60000, unit: "Views" },
    leadNurturingRate: { label: "Lead Nurturing Rate", current: 72, target: 75, unit: "%" },
    ogvSignUps: { label: "oGV Sign-Ups (SU)", current: 156, target: 190, unit: "SU" },
    suToAplConversion: { label: "SU → APL Conversion", current: 36.4, target: 40.0, unit: "%" }
  },

  notifications: [
    { id: "n-1", userId: "u-member-1", text: "Your Canva flyer 'Campus Exchange Fair 2026' was moved to the LCVP column by Dulani Fernando! 🎉 (Ready to Post)", timestamp: "2026-11-20 15:45", read: false },
    { id: "n-2", userId: "u-lcvp", text: "2 cards in Team Leader column waiting for your final review.", timestamp: "2026-11-22 18:20", read: false }
  ]
};
