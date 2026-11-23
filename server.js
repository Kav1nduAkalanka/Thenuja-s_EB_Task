import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                    process.env.SUPABASE_ANON_KEY || 
                    process.env.VITE_SUPABASE_ANON_KEY || 
                    process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

const isPlaceholderUrl = !supabaseUrl || 
  supabaseUrl.includes('placeholder') || 
  supabaseUrl.includes('ogv-mora-2728.supabase.co');

let supabase = null;
if (supabaseUrl && supabaseKey && !isPlaceholderUrl) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log(`[Supabase] Client initialized for remote instance: ${supabaseUrl}`);
  } catch (err) {
    console.warn(`[Supabase] Failed to initialize client:`, err.message);
  }
} else {
  console.log(`[Supabase] Running in local fallback mode. Waiting for user's remote Supabase credentials in .env.`);
}

// Fallback in-memory / demo data
const DEFAULT_USERS = [
  { id: "u-member-1", name: "Kavinda Perera", email: "kavinda.perera@aiesec.net", role: "member", teamName: "Team Alpha (Global Classroom)", initials: "KP", title: "Content Creator", avatarBg: "bg-[#0052CC]", is_approved: true },
  { id: "u-member-2", name: "Nimasha Fernando", email: "nimasha.fernando@aiesec.net", role: "member", teamName: "Team Alpha (Global Classroom)", initials: "NF", title: "Campaign Specialist", avatarBg: "bg-[#00B8D9]", is_approved: true },
  { id: "u-member-3", name: "Tharindu Silva", email: "tharindu.silva@aiesec.net", role: "member", teamName: "Team Beta (Eco Pioneers)", initials: "TS", title: "Digital Marketer", avatarBg: "bg-[#6554C0]", is_approved: true },
  { id: "u-leader-1", name: "Senuri Jayawardena", email: "senuri.jayawardena@aiesec.net", role: "leader", teamName: "Team Alpha (Global Classroom)", initials: "SJ", title: "Team Leader - Alpha", avatarBg: "bg-[#FFAB00]", is_approved: true },
  { id: "u-leader-2", name: "Kasun Wickramasinghe", email: "kasun.wickramasinghe@aiesec.net", role: "leader", teamName: "Team Beta (Eco Pioneers)", initials: "KW", title: "Team Leader - Beta", avatarBg: "bg-[#36B37E]", is_approved: true },
  { id: "u-lcvp", name: "Dulani Fernando", email: "dulani.fernando@aiesec.net", role: "lcvp", teamName: "Executive Board", initials: "DF", title: "LCVP oGV B2C", avatarBg: "bg-[#006644]", is_approved: true },
  { id: "u-admin", name: "Thenuja", email: "thenuja.tm@aiesec.net", role: "admin", teamName: "Talent Management", initials: "TM", title: "Candidate LCVP TM", avatarBg: "bg-[#403294]", is_approved: true }
];

let inMemoryCards = [
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

// Helper: RBAC Column Transition Rule
function validateTransition(userRole, currentColumn, targetColumn) {
  if (currentColumn === targetColumn) return { allowed: true };

  // Member -> Leader requires leader, lcvp, or admin
  if (currentColumn === 'member' && targetColumn === 'leader') {
    if (!['leader', 'lcvp', 'admin'].includes(userRole)) {
      return {
        allowed: false,
        reason: 'Permission Denied: Only Team Leaders, LCVP, or TM Admins can escalate deliverables to Leader Review.'
      };
    }
  }

  // To LCVP (Ready to Post) requires lcvp or admin
  if (targetColumn === 'lcvp') {
    if (!['lcvp', 'admin'].includes(userRole)) {
      return {
        allowed: false,
        reason: 'Permission Denied: Only LCVP oGV B2C or TM Admin can authorize publication (Ready to Post).'
      };
    }
  }

  // Leader -> Member (Revision) requires leader, lcvp, or admin
  if (currentColumn === 'leader' && targetColumn === 'member') {
    if (!['leader', 'lcvp', 'admin'].includes(userRole)) {
      return {
        allowed: false,
        reason: 'Permission Denied: Only Team Leaders or higher can request revisions.'
      };
    }
  }

  return { allowed: true };
}

// -----------------------------------------------------------------------------
// REST API ENDPOINTS
// -----------------------------------------------------------------------------

// 1. Health & Status
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  let message = 'Supabase remote instance not connected (using local storage fallback)';

  if (supabase) {
    try {
      const { data, error } = await supabase.from('flyers').select('count', { count: 'exact', head: true });
      if (!error) {
        dbStatus = 'connected';
        message = 'Remote Supabase database connection verified successfully';
      } else {
        message = `Supabase query returned: ${error.message}`;
      }
    } catch (e) {
      message = `Connection attempt failed: ${e.message}`;
    }
  }

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    supabaseConfigured: !!(supabaseUrl && !isPlaceholderUrl),
    message
  });
});

// 2. GET Flyers (Campaign Deliverables with Comments)
app.get('/api/flyers', async (req, res) => {
  if (supabase) {
    try {
      const { data: flyers, error: flyerErr } = await supabase
        .from('flyers')
        .select('*, comments(*)')
        .order('created_at', { ascending: false });

      if (!flyerErr && flyers) {
        // Format to frontend card structure
        const formatted = flyers.map(f => ({
          id: f.id,
          key: f.key || `OGV-${f.id.replace('KB-', '')}`,
          title: f.title,
          caption: f.caption,
          canvaUrl: f.canva_url,
          types: f.types || ['trend_based'],
          column: f.column,
          priority: f.priority || 'medium',
          uploaderName: f.uploader_name,
          uploaderId: f.uploader_id,
          uploaderRole: f.uploader_role || 'member',
          teamName: f.team_name,
          createdAt: f.created_at,
          startDate: f.start_date,
          dueDate: f.due_date,
          comments: (f.comments || []).sort((a,b) => new Date(a.created_at) - new Date(b.created_at)).map(c => ({
            id: c.id,
            authorName: c.author_name,
            authorRole: c.author_role,
            text: c.text,
            timestamp: c.created_at,
            isMovementLog: c.is_movement_log
          }))
        }));
        return res.json({ source: 'supabase', data: formatted });
      } else {
        console.warn('[Supabase] Failed to fetch flyers, falling back:', flyerErr?.message);
      }
    } catch (e) {
      console.warn('[Supabase] Fetch error:', e.message);
    }
  }

  // Fallback
  res.json({ source: 'memory', data: inMemoryCards });
});

// 3. POST Flyer (Create Deliverable)
app.post('/api/flyers', async (req, res) => {
  const { title, canvaUrl, caption, priority, types, uploaderName, uploaderId, uploaderRole, teamName } = req.body;

  if (!title || !canvaUrl) {
    return res.status(400).json({ error: 'Title and Canva URL are required' });
  }

  const count = inMemoryCards.length + 1;
  const newId = `KB-${String(count).padStart(2, '0')}`;
  const newKey = `OGV-10${count}`;
  const now = new Date();
  const ts = now.toISOString();

  const newCard = {
    id: newId,
    key: newKey,
    title,
    caption: caption || '',
    canvaUrl,
    types: types && types.length > 0 ? types : ['trend_based'],
    column: 'member',
    priority: priority || 'medium',
    uploaderName: uploaderName || 'Team Member',
    uploaderId: uploaderId || 'u-member-1',
    uploaderRole: uploaderRole || 'member',
    teamName: teamName || 'Team Alpha (Global Classroom)',
    createdAt: ts,
    comments: [
      {
        id: `c-init-${Date.now()}`,
        authorName: uploaderName || 'Team Member',
        authorRole: uploaderRole || 'member',
        text: `Created deliverable. Classification: ${(types || ['trend_based']).join(', ')}.`,
        timestamp: ts
      }
    ]
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('flyers').insert([
        {
          id: newId,
          key: newKey,
          title,
          caption: caption || '',
          canva_url: canvaUrl,
          types: types || ['trend_based'],
          priority: priority || 'medium',
          column: 'member',
          uploader_id: uploaderId || null,
          uploader_name: uploaderName || 'Team Member',
          uploader_role: uploaderRole || 'member',
          team_name: teamName || 'Team Alpha (Global Classroom)',
          created_at: ts,
          last_moved_at: ts
        }
      ]).select();

      if (!error) {
        // Insert initial comment
        await supabase.from('comments').insert([
          {
            flyer_id: newId,
            author_id: uploaderId || null,
            author_name: uploaderName || 'Team Member',
            author_role: uploaderRole || 'member',
            text: `Created deliverable. Classification: ${(types || ['trend_based']).join(', ')}.`,
            is_movement_log: false,
            created_at: ts
          }
        ]);
        return res.status(201).json({ source: 'supabase', data: newCard });
      }
    } catch (e) {
      console.warn('[Supabase] Insert error:', e.message);
    }
  }

  inMemoryCards = [newCard, ...inMemoryCards];
  res.status(201).json({ source: 'memory', data: newCard });
});

// 4. PATCH Flyer Column (RBAC Transition)
app.patch('/api/flyers/:id/column', async (req, res) => {
  const { id } = req.params;
  const { targetColumn, userRole, userId, userName, commentText } = req.body;

  let currentCard = inMemoryCards.find(c => c.id === id);

  if (supabase) {
    try {
      const { data: dbCard } = await supabase.from('flyers').select('*').eq('id', id).single();
      if (dbCard) {
        currentCard = {
          column: dbCard.column,
          comments: []
        };
      }
    } catch (e) {}
  }

  const currentColumn = currentCard ? currentCard.column : 'member';
  const check = validateTransition(userRole || 'member', currentColumn, targetColumn);
  if (!check.allowed) {
    return res.status(403).json({ error: check.reason });
  }

  const now = new Date();
  const ts = now.toISOString();
  const colNames = { member: 'Submissions', leader: 'Leader Review', lcvp: 'Ready to Post' };
  const note = commentText || `Moved from [${colNames[currentColumn] || currentColumn}] to [${colNames[targetColumn] || targetColumn}].`;

  const newComment = {
    id: `c-move-${Date.now()}`,
    authorName: userName || 'AIESEC Reviewer',
    authorRole: userRole || 'Reviewer',
    text: note,
    timestamp: ts,
    isMovementLog: true
  };

  if (supabase) {
    try {
      const { error: patchErr } = await supabase
        .from('flyers')
        .update({
          column: targetColumn,
          last_moved_at: ts
        })
        .eq('id', id);

      if (!patchErr) {
        await supabase.from('comments').insert([
          {
            flyer_id: id,
            author_id: userId || null,
            author_name: userName || 'AIESEC Reviewer',
            author_role: userRole || 'Reviewer',
            text: note,
            is_movement_log: true,
            created_at: ts
          }
        ]);
        return res.json({ source: 'supabase', success: true, targetColumn, comment: newComment });
      }
    } catch (e) {
      console.warn('[Supabase] Patch column error:', e.message);
    }
  }

  // Update in-memory
  inMemoryCards = inMemoryCards.map(c => {
    if (c.id === id) {
      return {
        ...c,
        column: targetColumn,
        comments: [...(c.comments || []), newComment]
      };
    }
    return c;
  });

  res.json({ source: 'memory', success: true, targetColumn, comment: newComment });
});

// 5. POST Comment
app.post('/api/flyers/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { authorName, authorRole, authorId, text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Comment text is required' });
  }

  const now = new Date();
  const ts = now.toISOString();
  const newComment = {
    id: `c-${Date.now()}`,
    authorName: authorName || 'Team Member',
    authorRole: authorRole || 'member',
    text,
    timestamp: ts,
    isMovementLog: false
  };

  if (supabase) {
    try {
      const { error } = await supabase.from('comments').insert([
        {
          flyer_id: id,
          author_id: authorId || null,
          author_name: authorName || 'Team Member',
          author_role: authorRole || 'member',
          text,
          is_movement_log: false,
          created_at: ts
        }
      ]);
      if (!error) {
        return res.status(201).json({ source: 'supabase', data: newComment });
      }
    } catch (e) {
      console.warn('[Supabase] Insert comment error:', e.message);
    }
  }

  inMemoryCards = inMemoryCards.map(c => {
    if (c.id === id) {
      return { ...c, comments: [...(c.comments || []), newComment] };
    }
    return c;
  });

  res.status(201).json({ source: 'memory', data: newComment });
});

// 6. GET Users
app.get('/api/users', async (req, res) => {
  if (supabase) {
    try {
      const { data: users, error } = await supabase.from('users').select('*').order('created_at', { ascending: true });
      if (!error && users && users.length > 0) {
        const formatted = users.map(u => ({
          id: u.id,
          name: u.full_name,
          email: u.email,
          role: u.role,
          teamName: u.team_name,
          title: u.title,
          initials: u.initials || u.full_name.split(' ').map(n=>n[0]).join(''),
          avatarBg: u.avatar_bg || 'bg-[#0052CC]',
          is_approved: u.is_approved
        }));
        return res.json({ source: 'supabase', data: formatted });
      }
    } catch (e) {}
  }
  res.json({ source: 'memory', data: DEFAULT_USERS });
});

// 7. Seed Remote Supabase Database
app.post('/api/seed', async (req, res) => {
  if (!supabase) {
    return res.status(400).json({ error: 'Supabase remote instance not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env' });
  }

  try {
    // 1. Seed users
    for (const u of DEFAULT_USERS) {
      await supabase.from('users').upsert({
        id: u.id,
        email: u.email,
        full_name: u.name,
        role: u.role,
        team_name: u.teamName,
        title: u.title,
        initials: u.initials,
        avatar_bg: u.avatarBg,
        is_approved: true
      });
    }

    // 2. Seed flyers
    for (const c of inMemoryCards) {
      await supabase.from('flyers').upsert({
        id: c.id,
        key: c.key,
        title: c.title,
        caption: c.caption,
        canva_url: c.canvaUrl,
        types: c.types,
        priority: c.priority,
        column: c.column,
        uploader_id: c.uploaderId,
        uploader_name: c.uploaderName,
        uploader_role: c.uploaderRole,
        team_name: c.teamName,
        start_date: c.startDate,
        due_date: c.dueDate
      });

      // 3. Seed comments
      if (c.comments) {
        for (const comm of c.comments) {
          await supabase.from('comments').upsert({
            id: comm.id,
            flyer_id: c.id,
            author_name: comm.authorName,
            author_role: comm.authorRole,
            text: comm.text,
            is_movement_log: !!comm.isMovementLog
          });
        }
      }
    }

    res.json({ success: true, message: 'Database successfully seeded with Term 27.28 initial deliverables and users.' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Static frontend serving
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(distPath, 'index.html'), (err) => {
      if (err) {
        res.sendFile(path.join(__dirname, 'index.html'));
      }
    });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`[AIESEC Tracker Backend] Running on http://localhost:${PORT}`);
  console.log(`[AIESEC Tracker Backend] API Health: http://localhost:${PORT}/api/health`);
});
