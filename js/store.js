/**
 * oGV B2C Performance & Flyer Portal - Kanban Edition
 * State Management & Reactive LocalStorage Persistence
 */

class PortalStore {
  constructor() {
    this.STORAGE_KEY = "ogv_portal_kanban_db_v2";
    this.CURRENT_USER_KEY = "ogv_portal_kanban_user_v2";
    this.listeners = [];
    this.state = this.loadState();
    this.currentUser = this.loadCurrentUser();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load state:", e);
    }
    const initial = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.saveState(initial);
    return initial;
  }

  saveState(state = this.state) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save state:", e);
    }
  }

  loadCurrentUser() {
    try {
      const saved = localStorage.getItem(this.CURRENT_USER_KEY);
      if (saved) {
        const user = JSON.parse(saved);
        return this.state.users.find(u => u.id === user.id) || user;
      }
    } catch (e) {
      console.error("Failed to load user:", e);
    }
    // Default to first member
    return this.state.users.find(u => u.email === "kavinda.perera@aiesec.net") || null;
  }

  setCurrentUser(user) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.CURRENT_USER_KEY);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.saveState();
    this.listeners.forEach(fn => fn(this.state, this.currentUser));
  }

  // --- Kanban Card Movement ---

  /**
   * Move card between columns:
   * 1. 'member' -> Column 1: Team Member
   * 2. 'leader' -> Column 2: Team Leader
   * 3. 'lcvp'   -> Column 3: LCVP (Ready to Post)
   */
  moveFlyerToColumn(flyerId, targetColumn, moverUser, commentText = "") {
    const flyer = this.state.flyers.find(f => f.id === flyerId);
    if (!flyer) return { success: false, message: "Flyer card not found." };

    const oldColumn = flyer.column;
    if (oldColumn === targetColumn) {
      return { success: true, message: "Card already in this column." };
    }

    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 16);
    const roleTitles = { member: "Team Member", leader: "Team Leader", lcvp: "LCVP oGV B2C", admin: "LCVP TM" };

    // Permission validations
    if (oldColumn === "member" && targetColumn === "leader") {
      // Moving from Team Member to Team Leader: Should be done by Team Leader or LCVP or Admin
      if (moverUser.role === "member") {
        return { 
          success: false, 
          message: "Only a Team Leader or LCVP can review and move a card from the Team Member column to the Team Leader column. Switch role to Team Leader (Senuri) to perform this move!" 
        };
      }
    }

    if (targetColumn === "lcvp") {
      // Moving to LCVP column: Should be done by LCVP or Admin
      if (moverUser.role !== "lcvp" && moverUser.role !== "admin") {
        return { 
          success: false, 
          message: "Only the LCVP can give final approval and move a card to the LCVP column. Switch role to LCVP (Dulani) to perform this move!" 
        };
      }
    }

    // Apply movement
    flyer.column = targetColumn;
    flyer.lastMovedAt = now.toISOString();

    // Add movement comment if text provided or auto-log movement
    const colNames = { member: "Team Member", leader: "Team Leader", lcvp: "LCVP (Ready to Post)" };
    const movementNote = commentText && commentText.trim() 
      ? commentText.trim()
      : `Moved card from [${colNames[oldColumn]}] to [${colNames[targetColumn]}] column.`;

    flyer.comments.push({
      id: `c-${Date.now()}`,
      authorName: moverUser.name,
      authorRole: roleTitles[moverUser.role] || moverUser.role,
      text: movementNote,
      timestamp: timestamp,
      isMovementLog: true
    });

    // Notify uploader and stakeholders
    if (targetColumn === "leader") {
      this.addNotification({
        userId: flyer.uploaderId,
        text: `👍 Team Leader ${moverUser.name} reviewed your card "${flyer.title}" and moved it to the Team Leader column!`
      });
      this.addNotification({
        userId: "u-lcvp",
        text: `New card in Team Leader column awaiting your final check: "${flyer.title}".`
      });
    } else if (targetColumn === "lcvp") {
      this.addNotification({
        userId: flyer.uploaderId,
        text: `🎉 Congratulations! LCVP ${moverUser.name} moved your card "${flyer.title}" to the LCVP column! It is now Ready to Post!`
      });
      // Also notify Team Leader
      const team = this.state.teams.find(t => t.id === flyer.teamId);
      if (team && team.leaderId) {
        this.addNotification({
          userId: team.leaderId,
          text: `Flyer "${flyer.title}" from ${flyer.uploaderName} was approved by LCVP and is Ready to Post!`
        });
      }
    } else if (targetColumn === "member") {
      // Sent back to member (e.g. for revision)
      this.addNotification({
        userId: flyer.uploaderId,
        text: `⚠️ Card "${flyer.title}" was moved back to the Team Member column with feedback: "${commentText || 'Please review comments'}"`
      });
    }

    this.notify();
    return { success: true, message: `Card moved to ${colNames[targetColumn]} column!` };
  }

  // --- Add Flyer (Canva Link + Types) ---

  uploadFlyer({ title, caption, canvaUrl, types, uploader }) {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Determine initial column:
    // Members upload to 'member' column
    // Team Leaders can upload directly to 'leader' column
    // LCVP can upload directly to 'lcvp' column
    let initialCol = "member";
    if (uploader.role === "leader") {
      initialCol = "leader";
    } else if (uploader.role === "lcvp") {
      initialCol = "lcvp";
    }

    const newFlyer = {
      id: `KB-${String(this.state.flyers.length + 1).padStart(2, '0')}`,
      title: title.trim(),
      caption: caption ? caption.trim() : "",
      canvaUrl: canvaUrl.trim(),
      types: Array.isArray(types) && types.length > 0 ? types : ["trend_based"],
      column: initialCol,
      uploaderId: uploader.id,
      uploaderName: uploader.name,
      uploaderRole: uploader.role,
      teamId: uploader.teamId || "team-alpha",
      teamName: uploader.teamName || "Team Alpha (Global Classroom)",
      uploadDate: now.toISOString(),
      month: month,
      comments: [
        {
          id: `c-init-${Date.now()}`,
          authorName: uploader.name,
          authorRole: uploader.role === "member" ? "Team Member" : uploader.role === "leader" ? "Team Leader" : "LCVP",
          text: `Created flyer card with Canva design link. Types: ${(types || []).join(", ")}.`,
          timestamp: now.toISOString().replace('T', ' ').substring(0, 16)
        }
      ]
    };

    this.state.flyers.unshift(newFlyer);

    // Notify appropriate person
    if (initialCol === "member") {
      const team = this.state.teams.find(t => t.id === uploader.teamId);
      if (team && team.leaderId) {
        this.addNotification({
          userId: team.leaderId,
          text: `New Canva flyer uploaded by ${uploader.name} in Member column: "${newFlyer.title}".`
        });
      }
    } else if (initialCol === "leader") {
      this.addNotification({
        userId: "u-lcvp",
        text: `Team Leader ${uploader.name} added a flyer card to the TL column: "${newFlyer.title}".`
      });
    }

    this.notify();
    return newFlyer;
  }

  // --- Add Comment to Card ---

  addComment(flyerId, { text, authorName, authorRole }) {
    const flyer = this.state.flyers.find(f => f.id === flyerId);
    if (!flyer || !text.trim()) return false;

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    flyer.comments.push({
      id: `c-${Date.now()}`,
      authorName: authorName,
      authorRole: authorRole,
      text: text.trim(),
      timestamp: timestamp
    });

    // Notify uploader if commenter is someone else
    const currentUserId = this.currentUser ? this.currentUser.id : null;
    if (currentUserId && currentUserId !== flyer.uploaderId) {
      this.addNotification({
        userId: flyer.uploaderId,
        text: `💬 ${authorName} (${authorRole}) commented on your card "${flyer.title}": "${text.substring(0, 60)}..."`
      });
    }

    this.notify();
    return true;
  }

  // --- User Auth & Registration ---

  login(email, password) {
    const user = this.state.users.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim()
    );
    if (!user) {
      return { success: false, message: "No account found with this email." };
    }
    if (user.password !== password) {
      return { success: false, message: "Invalid password. Try 'password123'." };
    }
    if (!user.approved) {
      return { 
        success: false, 
        message: "Account pending confirmation by LCVP TM." 
      };
    }
    this.setCurrentUser(user);
    return { success: true, user };
  }

  registerUser({ name, email, password, role, teamId, teamName }) {
    if (this.state.users.some(u => u.email.toLowerCase() === email.toLowerCase().trim())) {
      return { success: false, message: "An account with this email already exists." };
    }

    const isMember = role === "member";
    const approved = isMember; // Team Leader & LCVP require admin confirmation

    const newUser = {
      id: `u-${role}-${Date.now().toString(36)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password || "password123",
      role: role,
      teamId: teamId || 'team-alpha',
      teamName: teamName || 'Team Alpha (Global Classroom)',
      avatar: role === 'member' ? '👨‍🎓' : role === 'leader' ? '👩‍💻' : role === 'lcvp' ? '👩‍⚖️' : '🌟',
      approved: approved,
      bio: `${role.toUpperCase()} · Term 27.28`
    };

    this.state.users.push(newUser);
    this.notify();
    return { 
      success: true, 
      user: newUser, 
      approved,
      message: approved 
        ? "Account created successfully! You are logged in." 
        : "Account created! Awaiting admin safety confirmation by LCVP TM." 
    };
  }

  approveUser(userId) {
    const user = this.state.users.find(u => u.id === userId);
    if (user) {
      user.approved = true;
      this.notify();
      return true;
    }
    return false;
  }

  // --- Scoreboard Engine ---

  calculateMonthlyScores(targetMonth = "2026-11") {
    // Flyers belonging to target month
    const flyersInMonth = this.state.flyers.filter(f => f.month === targetMonth);

    // Member scores: Count cards in 'lcvp' column as approved deliverables
    const members = this.state.users.filter(u => u.role === "member");
    const memberScores = members.map(m => {
      const userFlyers = flyersInMonth.filter(f => f.uploaderId === m.id);
      const approvedCards = userFlyers.filter(f => f.column === "lcvp"); // Moved to LCVP column!
      const inProgressCards = userFlyers.filter(f => f.column !== "lcvp");

      // 10 points per card in LCVP column
      let points = approvedCards.length * 10;

      // Type diversity bonus: 2 bonus points if creator made at least 2 distinct types (trend, country, project)
      const allTypes = new Set();
      userFlyers.forEach(f => (f.types || []).forEach(t => allTypes.add(t)));
      if (allTypes.size >= 2) {
        points += 5; // Diversity bonus
      }

      return {
        user: m,
        totalUploaded: userFlyers.length,
        approvedCount: approvedCards.length,
        inProgressCount: inProgressCards.length,
        points: points,
        typesCount: allTypes.size
      };
    });

    memberScores.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.approvedCount - a.approvedCount;
    });

    // Leader scores: Count team flyers in 'lcvp' column + personal flyers
    const leaders = this.state.users.filter(u => u.role === "leader" && u.approved);
    const leaderScores = leaders.map(leader => {
      const teamMemberIds = this.state.users
        .filter(u => u.role === "member" && u.teamId === leader.teamId)
        .map(u => u.id);

      const teamFlyers = flyersInMonth.filter(f => teamMemberIds.includes(f.uploaderId));
      const teamApproved = teamFlyers.filter(f => f.column === "lcvp");
      const teamInLeaderCol = teamFlyers.filter(f => f.column === "leader");

      const personalFlyers = flyersInMonth.filter(f => f.uploaderId === leader.id);
      const personalApproved = personalFlyers.filter(f => f.column === "lcvp");

      // 5 points per team approved card, 3 points for cards in leader review, 10 points for personal approved
      const points = (teamApproved.length * 5) + (teamInLeaderCol.length * 3) + (personalApproved.length * 10);

      return {
        user: leader,
        teamName: leader.teamName,
        teamMembersCount: teamMemberIds.length,
        teamUploaded: teamFlyers.length,
        teamApproved: teamApproved.length,
        teamInLeaderCol: teamInLeaderCol.length,
        personalApproved: personalApproved.length,
        totalScore: points
      };
    });

    leaderScores.sort((a, b) => b.totalScore - a.totalScore);

    return {
      month: targetMonth,
      members: memberScores,
      leaders: leaderScores,
      bestMember: memberScores[0] || null,
      bestLeader: leaderScores[0] || null
    };
  }

  addNotification({ userId, text }) {
    this.state.notifications.unshift({
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: userId,
      text: text,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    });
  }

  markNotificationsRead(userId) {
    this.state.notifications.forEach(n => {
      if (n.userId === userId) n.read = true;
    });
    this.notify();
  }

  resetToDefaults() {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.state = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.currentUser = this.state.users.find(u => u.email === "kavinda.perera@aiesec.net");
    this.saveState();
    this.notify();
  }
}

window.store = new PortalStore();
