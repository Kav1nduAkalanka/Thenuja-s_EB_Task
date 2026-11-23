/**
 * oGV B2C Performance & Flyer Portal - Kanban Edition
 * Interactive UI Controller, Drag & Drop, and Workflow Engine
 * AIESEC in University of Moratuwa · Term 27.28
 */

class KanbanApp {
  constructor() {
    this.currentView = "kanban";
    this.selectedTypeFilter = "all";
    this.selectedCardId = null;
    this.draggedCardId = null;
  }

  init() {
    window.store.subscribe((state, user) => {
      this.updateUserNavigation(user);
      this.updateNotifications();
      this.renderCurrentView();
    });

    this.updateUserNavigation(window.store.currentUser);
    this.updateNotifications();
    this.renderCurrentView();
  }

  // --- View Routing ---

  navigateTo(viewName) {
    this.currentView = viewName;

    document.querySelectorAll(".nav-link-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.view === viewName);
    });

    document.querySelectorAll(".view-section").forEach(sec => {
      sec.classList.remove("active");
    });

    const target = document.getElementById(`view-${viewName}`);
    if (target) target.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
    this.renderCurrentView();
  }

  renderCurrentView() {
    if (this.currentView === "kanban") {
      this.renderKanbanBoard();
    } else if (this.currentView === "scoreboard") {
      this.renderScoreboard();
    } else if (this.currentView === "admin-panel") {
      this.renderAdminPanel();
    }
  }

  // --- Fast Role Switcher ---

  switchDemoRole(role) {
    let targetUser = null;
    if (role === "member") {
      targetUser = window.store.state.users.find(u => u.email === "kavinda.perera@aiesec.net");
    } else if (role === "leader") {
      targetUser = window.store.state.users.find(u => u.email === "senuri.jayawardena@aiesec.net");
    } else if (role === "lcvp") {
      targetUser = window.store.state.users.find(u => u.email === "dulani.fernando@aiesec.net");
    } else if (role === "admin") {
      targetUser = window.store.state.users.find(u => u.email === "thenuja.tm@aiesec.net");
    }

    if (targetUser) {
      window.store.setCurrentUser(targetUser);
    }
  }

  updateUserNavigation(user) {
    if (!user) return;

    const avatarEl = document.getElementById("navUserAvatar");
    const nameEl = document.getElementById("navUserName");
    const roleEl = document.getElementById("navUserRole");

    if (avatarEl) avatarEl.textContent = user.avatar || "👤";
    if (nameEl) nameEl.textContent = user.name;
    if (roleEl) {
      const titles = { member: "Team Member", leader: "Team Leader", lcvp: "LCVP oGV B2C", admin: "Candidate LCVP TM" };
      roleEl.textContent = titles[user.role] || user.role;
    }

    document.querySelectorAll(".demo-role-chip").forEach(chip => chip.classList.remove("active"));
    const activeChip = document.getElementById(
      user.role === "member" ? "chipMember" :
      user.role === "leader" ? "chipLeader" :
      user.role === "lcvp" ? "chipLCVP" : "chipAdmin"
    );
    if (activeChip) activeChip.classList.add("active");
  }

  // --- Type Filters ---

  setTypeFilter(type) {
    this.selectedTypeFilter = type;
    document.querySelectorAll(".filter-pill").forEach(pill => {
      pill.classList.toggle("active", pill.dataset.type === type);
    });
    this.renderKanbanBoard();
  }

  // --- Render Kanban Board ---

  renderKanbanBoard() {
    const allFlyers = window.store.state.flyers;
    const typeFilter = this.selectedTypeFilter;
    const teamFilter = document.getElementById("kanbanTeamFilter")?.value || "all";
    const searchQuery = document.getElementById("kanbanSearchInput")?.value.toLowerCase().trim() || "";

    // Filter flyers
    let filtered = allFlyers;

    if (typeFilter !== "all") {
      filtered = filtered.filter(f => (f.types || []).includes(typeFilter));
    }

    if (teamFilter !== "all") {
      filtered = filtered.filter(f => f.teamId === teamFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(f => 
        f.title.toLowerCase().includes(searchQuery) ||
        (f.caption && f.caption.toLowerCase().includes(searchQuery)) ||
        f.uploaderName.toLowerCase().includes(searchQuery)
      );
    }

    // Partition into 3 columns:
    const memberCards = filtered.filter(f => f.column === "member");
    const leaderCards = filtered.filter(f => f.column === "leader");
    const lcvpCards = filtered.filter(f => f.column === "lcvp");

    // Update column counters
    document.getElementById("count-member").textContent = `${memberCards.length} Card${memberCards.length === 1 ? '' : 's'}`;
    document.getElementById("count-leader").textContent = `${leaderCards.length} Card${leaderCards.length === 1 ? '' : 's'}`;
    document.getElementById("count-lcvp").textContent = `${lcvpCards.length} Card${lcvpCards.length === 1 ? '' : 's'}`;

    // Render cards into respective columns
    this.renderColumnCards("list-member", memberCards, "member");
    this.renderColumnCards("list-leader", leaderCards, "leader");
    this.renderColumnCards("list-lcvp", lcvpCards, "lcvp");
  }

  renderColumnCards(containerId, cards, columnKey) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (cards.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; color: var(--deep-slate); padding: 2.5rem 1rem; border: 1.5px dashed var(--grey-lilac); border-radius: 8px; background: rgba(255,255,255,0.4);">
          <div style="font-size: 1.75rem; margin-bottom: 0.35rem;">📭</div>
          <div style="font-size: 0.85rem; font-weight: 600;">No cards in this column</div>
          <div style="font-size: 0.74rem; color: var(--grey-lilac); margin-top: 0.25rem;">Drag cards here or click move buttons</div>
        </div>
      `;
      return;
    }

    const currentUser = window.store.currentUser || { role: "member" };

    container.innerHTML = cards.map(f => {
      // Build Type Tags HTML
      const tagsHtml = (f.types || []).map(t => {
        if (t === "trend_based") return `<span class="tag-pill tag-trend">📌 Trend Based</span>`;
        if (t === "country_based") return `<span class="tag-pill tag-country">🌍 Country Based</span>`;
        if (t === "project_based") return `<span class="tag-pill tag-project">🎯 Project Based</span>`;
        return "";
      }).join("");

      const commentsCount = (f.comments || []).length;

      // Determine Action Button based on column and current user role
      let moveActionButton = "";
      if (columnKey === "member") {
        if (currentUser.role === "leader" || currentUser.role === "lcvp" || currentUser.role === "admin") {
          moveActionButton = `
            <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); app.moveCardToColumn('${f.id}', 'leader')">
              Move to TL ➡️
            </button>
          `;
        } else {
          moveActionButton = `
            <span style="font-size: 0.72rem; color: var(--deep-slate); font-style: italic;">
              ⏳ Awaiting TL
            </span>
          `;
        }
      } else if (columnKey === "leader") {
        if (currentUser.role === "lcvp" || currentUser.role === "admin") {
          moveActionButton = `
            <button class="btn btn-success btn-sm" onclick="event.stopPropagation(); app.moveCardToColumn('${f.id}', 'lcvp')">
              Approve to LCVP ➡️
            </button>
          `;
        } else {
          moveActionButton = `
            <span style="font-size: 0.72rem; color: #0284C7; font-weight: 600;">
              ⏳ Awaiting LCVP
            </span>
          `;
        }
      } else if (columnKey === "lcvp") {
        moveActionButton = `
          <span class="badge" style="background:#D1FAE5; color:#065F46; font-size:0.7rem;">
            ✅ Ready to Post
          </span>
        `;
      }

      return `
        <div class="kanban-card" draggable="true" 
             data-card-id="${f.id}"
             ondragstart="app.handleDragStart(event, '${f.id}')"
             ondragend="app.handleDragEnd(event)"
             onclick="app.openCardModal('${f.id}')">
          
          <!-- Types Tags -->
          <div class="card-tags-row">
            ${tagsHtml}
          </div>

          <!-- Title -->
          <h4 class="card-title">${f.title}</h4>

          <!-- Canva Link Banner Button -->
          <div class="card-canva-banner" onclick="event.stopPropagation()">
            <div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; font-weight: 700; color: #6D28D9;">
              <span>🎨</span>
              <span>Canva Link</span>
            </div>
            <a href="${f.canvaUrl}" target="_blank" class="btn btn-canva btn-sm" style="padding: 0.2rem 0.55rem; font-size: 0.7rem;">
              Open ↗
            </a>
          </div>

          <!-- Caption excerpt if present -->
          ${f.caption ? `<p class="card-caption">${f.caption}</p>` : ''}

          <!-- Uploader info -->
          <div class="card-uploader-meta">
            <span>By <strong>${f.uploaderName}</strong></span>
            <span>💬 ${commentsCount} note${commentsCount === 1 ? '' : 's'}</span>
          </div>

          <!-- Bottom Footer with Quick Move & Details -->
          <div class="card-action-footer">
            <button class="btn btn-outline btn-sm" style="font-size: 0.72rem; padding: 0.25rem 0.5rem;" onclick="event.stopPropagation(); app.openCardModal('${f.id}')">
              Details & Comments
            </button>
            <div>
              ${moveActionButton}
            </div>
          </div>

        </div>
      `;
    }).join("");
  }

  // --- Drag and Drop Handlers ---

  handleDragStart(event, cardId) {
    this.draggedCardId = cardId;
    event.dataTransfer.setData("text/plain", cardId);
    event.target.classList.add("dragging");
  }

  handleDragEnd(event) {
    event.target.classList.remove("dragging");
    document.querySelectorAll(".kanban-card-list").forEach(list => list.classList.remove("drag-over"));
  }

  handleDragOver(event) {
    event.preventDefault();
    const list = event.currentTarget;
    list.classList.add("drag-over");
  }

  handleDragLeave(event) {
    const list = event.currentTarget;
    list.classList.remove("drag-over");
  }

  handleDrop(event, targetColumn) {
    event.preventDefault();
    const list = event.currentTarget;
    list.classList.remove("drag-over");

    const cardId = event.dataTransfer.getData("text/plain") || this.draggedCardId;
    if (!cardId) return;

    this.moveCardToColumn(cardId, targetColumn);
  }

  moveCardToColumn(cardId, targetColumn) {
    const currentUser = window.store.currentUser || { name: "Evaluator", role: "admin" };
    const res = window.store.moveFlyerToColumn(cardId, targetColumn, currentUser);

    if (!res.success) {
      alert(`⚠️ Action Blocked:\n${res.message}`);
    } else {
      // Re-render
      this.renderKanbanBoard();
      if (this.selectedCardId === cardId) {
        this.openCardModal(cardId);
      }
    }
  }

  // --- Modal: Card Detail & Comments ---

  openCardModal(cardId) {
    const f = window.store.state.flyers.find(item => item.id === cardId);
    if (!f) return;

    this.selectedCardId = cardId;
    const currentUser = window.store.currentUser || { role: "member" };

    // Column Badge
    const colBadge = document.getElementById("modalCardColumnBadge");
    const colNames = { member: "1. Team Member Column", leader: "2. Team Leader Column", lcvp: "3. LCVP Column (Ready to Post)" };
    const colStyles = {
      member: "background: var(--deep-slate); color: #FFF;",
      leader: "background: #2563EB; color: #FFF;",
      lcvp: "background: #059669; color: #FFF;"
    };
    colBadge.textContent = colNames[f.column];
    colBadge.style = colStyles[f.column];

    document.getElementById("modalCardId").textContent = f.id;
    document.getElementById("modalCardTitle").textContent = f.title;
    document.getElementById("modalCardCaption").textContent = f.caption || "No extra caption specified.";
    document.getElementById("modalCardUploader").textContent = `${f.uploaderName} (${f.uploaderRole.toUpperCase()})`;
    document.getElementById("modalCardTeam").textContent = f.teamName || "Team Alpha";
    document.getElementById("modalCardDate").textContent = f.uploadDate ? f.uploadDate.replace('T', ' ').substring(0, 16) : "Today";

    // Canva Link Button
    const canvaBtn = document.getElementById("modalOpenCanvaBtn");
    canvaBtn.href = f.canvaUrl;

    // Type Tags
    const typesCont = document.getElementById("modalCardTypes");
    typesCont.innerHTML = (f.types || []).map(t => {
      if (t === "trend_based") return `<span class="tag-pill tag-trend">📌 Trend Based</span>`;
      if (t === "country_based") return `<span class="tag-pill tag-country">🌍 Country Based</span>`;
      if (t === "project_based") return `<span class="tag-pill tag-project">🎯 Project Based</span>`;
      return "";
    }).join("");

    // Progression Indicator
    const progressEl = document.getElementById("modalProgressIndicator");
    const isStep1 = true;
    const isStep2 = f.column === "leader" || f.column === "lcvp";
    const isStep3 = f.column === "lcvp";

    progressEl.innerHTML = `
      <div style="font-weight:700; color:${isStep1 ? 'var(--deep-slate)' : '#9CA3AF'};">
        1. Member Upload ✅
      </div>
      <span>→</span>
      <div style="font-weight:700; color:${isStep2 ? '#2563EB' : '#9CA3AF'};">
        2. TL Review ${isStep2 ? '✅' : '⏳'}
      </div>
      <span>→</span>
      <div style="font-weight:700; color:${isStep3 ? '#059669' : '#9CA3AF'};">
        3. LCVP Final ${isStep3 ? '🎉 Approved' : '⏳'}
      </div>
    `;

    // Comments Thread
    this.renderCardModalComments(f.comments || []);

    // Movement Action Footer
    this.renderCardModalFooter(f, currentUser);

    document.getElementById("cardDetailModal").classList.add("show");
  }

  closeCardModal() {
    document.getElementById("cardDetailModal").classList.remove("show");
    this.selectedCardId = null;
  }

  renderCardModalComments(comments) {
    const thread = document.getElementById("modalCommentsThread");
    const countEl = document.getElementById("modalCommentCount");
    if (!thread) return;

    if (countEl) countEl.textContent = `${comments.length} comment${comments.length === 1 ? '' : 's'}`;

    if (comments.length === 0) {
      thread.innerHTML = `
        <div style="color:var(--deep-slate); font-size:0.8rem; font-style:italic; padding:0.5rem 0;">
          No comments or feedback notes yet. TL and LCVP can add feedback below.
        </div>
      `;
      return;
    }

    thread.innerHTML = comments.map(c => `
      <div class="comment-bubble" style="${c.isMovementLog ? 'border-left-color: #059669; background: #F0FDF4;' : ''}">
        <div class="comment-header">
          <span style="font-weight:700; color:var(--near-black);">
            ${c.authorName} <span class="badge" style="font-size:0.64rem; padding:0.1rem 0.4rem; background:var(--light-grey);">${c.authorRole}</span>
          </span>
          <span style="color:var(--deep-slate); font-size:0.7rem;">${c.timestamp}</span>
        </div>
        <div class="comment-text">${c.text}</div>
      </div>
    `).join("");

    thread.scrollTop = thread.scrollHeight;
  }

  submitModalComment() {
    const input = document.getElementById("modalNewCommentInput");
    const text = input ? input.value : "";
    if (!text.trim() || !this.selectedCardId) return;

    const user = window.store.currentUser || { name: "Evaluator", role: "admin" };
    const roleTitles = { member: "Team Member", leader: "Team Leader", lcvp: "LCVP oGV B2C", admin: "Candidate LCVP TM" };

    window.store.addComment(this.selectedCardId, {
      text: text,
      authorName: user.name,
      authorRole: roleTitles[user.role] || user.role
    });

    input.value = "";
    const f = window.store.state.flyers.find(item => item.id === this.selectedCardId);
    if (f) this.renderCardModalComments(f.comments || []);
    this.renderKanbanBoard();
  }

  renderCardModalFooter(card, currentUser) {
    const footer = document.getElementById("modalMovementFooter");
    if (!footer) return;

    let html = `<button class="btn btn-secondary" onclick="app.closeCardModal()">Close</button>`;

    // Column 1 Actions (Team Member Column)
    if (card.column === "member") {
      if (currentUser.role === "leader" || currentUser.role === "lcvp" || currentUser.role === "admin") {
        html += `
          <button class="btn btn-primary" onclick="app.handleModalMove('leader')">
            👍 Review & Move to Team Leader Column ➡️
          </button>
        `;
      } else {
        html += `
          <span style="font-size:0.8rem; color:var(--deep-slate); font-style:italic;">
            Awaiting Team Leader review & movement.
          </span>
        `;
      }
    }

    // Column 2 Actions (Team Leader Column)
    if (card.column === "leader") {
      // Allow move back to member for revision
      if (currentUser.role === "leader" || currentUser.role === "lcvp" || currentUser.role === "admin") {
        html += `
          <button class="btn btn-danger btn-sm" onclick="app.handleModalMoveBack('member')">
            ↩️ Move Back to Member (Request Changes)
          </button>
        `;
      }

      if (currentUser.role === "lcvp" || currentUser.role === "admin") {
        html += `
          <button class="btn btn-success" onclick="app.handleModalMove('lcvp')">
            🚀 Final Approval & Move to LCVP Column (Ready to Post) ➡️
          </button>
        `;
      } else {
        html += `
          <span style="font-size:0.8rem; color:#0284C7; font-weight:600;">
            Awaiting LCVP final check & movement.
          </span>
        `;
      }
    }

    // Column 3 Actions (LCVP Column)
    if (card.column === "lcvp") {
      html += `
        <span class="badge" style="background:#D1FAE5; color:#065F46; font-size:0.8rem; padding:0.4rem 0.8rem;">
          🎉 Final Approved & Ready to Post!
        </span>
      `;
    }

    footer.innerHTML = html;
  }

  handleModalMove(targetColumn) {
    if (!this.selectedCardId) return;
    const commentNote = prompt("Add optional review note for this move (or leave blank):", "");
    const currentUser = window.store.currentUser || { name: "Evaluator", role: "admin" };

    const res = window.store.moveFlyerToColumn(this.selectedCardId, targetColumn, currentUser, commentNote);
    if (!res.success) {
      alert(res.message);
    } else {
      alert(res.message);
      this.openCardModal(this.selectedCardId);
      this.renderKanbanBoard();
    }
  }

  handleModalMoveBack(targetColumn) {
    if (!this.selectedCardId) return;
    const reason = prompt("Explain the changes requested for the member:", "Please update the template branding colors.");
    if (!reason || !reason.trim()) {
      alert("A reason note is required when moving a card back to the Team Member.");
      return;
    }
    const currentUser = window.store.currentUser || { name: "Evaluator", role: "admin" };
    window.store.moveFlyerToColumn(this.selectedCardId, targetColumn, currentUser, `Changes Requested: ${reason.trim()}`);
    alert("Card moved back to Team Member column with feedback note!");
    this.openCardModal(this.selectedCardId);
    this.renderKanbanBoard();
  }

  // --- Modal: Upload Canva Flyer Card ---

  openUploadModal() {
    document.getElementById("uploadCanvaModal").classList.add("show");
  }

  closeUploadModal() {
    document.getElementById("uploadCanvaModal").classList.remove("show");
    document.getElementById("uploadCanvaForm").reset();
  }

  handleUploadCanvaSubmit(event) {
    event.preventDefault();
    const title = document.getElementById("canvaTitle").value;
    const canvaUrl = document.getElementById("canvaUrl").value;
    const caption = document.getElementById("canvaCaption").value;

    // Get ticked types
    const tickedCheckboxes = document.querySelectorAll('input[name="flyerTypeOption"]:checked');
    const types = Array.from(tickedCheckboxes).map(cb => cb.value);

    if (types.length === 0) {
      alert("Please tick at least one flyer type (Trend based, Country based, or Project based).");
      return;
    }

    const user = window.store.currentUser || {
      id: "u-member-1",
      name: "Kavinda Perera",
      role: "member",
      teamId: "team-alpha",
      teamName: "Team Alpha (Global Classroom)"
    };

    window.store.uploadFlyer({
      title,
      caption,
      canvaUrl,
      types,
      uploader: user
    });

    this.closeUploadModal();
    alert("🎉 Canva card uploaded! It is now in Column 1 (Team Member) waiting for Team Leader review.");
    this.renderKanbanBoard();
  }

  // --- View: Scoreboard ---

  renderScoreboard() {
    const month = document.getElementById("scoreboardMonthSelect")?.value || "2026-11";
    const scores = window.store.calculateMonthlyScores(month);

    // Member scoreboard table
    const mTable = document.getElementById("memberScoreboardTableBody");
    if (mTable) {
      mTable.innerHTML = scores.members.map((m, idx) => `
        <tr>
          <td>
            <strong>#${idx + 1}</strong>
            ${idx === 0 ? ' <span title="Best of Month">👑</span>' : ''}
          </td>
          <td>
            <div style="display:flex; align-items:center; gap:0.4rem;">
              <span>${m.user.avatar || '👨‍🎓'}</span>
              <strong>${m.user.name}</strong>
            </div>
          </td>
          <td>${m.user.teamName || 'Team Alpha'}</td>
          <td><span class="badge" style="background:#D1FAE5; color:#065F46;">${m.approvedCount} in LCVP Col</span></td>
          <td>${m.inProgressCount} In Progress</td>
          <td>${m.typesCount} / 3 Categories</td>
          <td><strong style="font-size:1rem; color:var(--near-black);">${m.points} pts</strong></td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="app.generateBestMemberCert('${month}')">
              Award Cert
            </button>
          </td>
        </tr>
      `).join("");
    }

    // Leader scoreboard table
    const lTable = document.getElementById("leaderScoreboardTableBody");
    if (lTable) {
      lTable.innerHTML = scores.leaders.map((l, idx) => `
        <tr>
          <td>
            <strong>#${idx + 1}</strong>
            ${idx === 0 ? ' <span title="Best TL of Month">🌟</span>' : ''}
          </td>
          <td>
            <div style="display:flex; align-items:center; gap:0.4rem;">
              <span>${l.user.avatar || '👩‍💻'}</span>
              <strong>${l.user.name}</strong>
            </div>
          </td>
          <td>${l.teamName}</td>
          <td><span class="badge" style="background:#D1FAE5; color:#065F46;">${l.teamApproved} Approved</span></td>
          <td>${l.teamInLeaderCol} In Review</td>
          <td>${l.personalApproved} Personal</td>
          <td><strong style="font-size:1rem; color:var(--near-black);">${l.totalScore} pts</strong></td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="app.generateBestLeaderCert('${month}')">
              Award Cert
            </button>
          </td>
        </tr>
      `).join("");
    }
  }

  // --- RnR Certificates ---

  generateBestMemberCert(month = "2026-11") {
    const scores = window.store.calculateMonthlyScores(month);
    const best = scores.bestMember;
    if (!best) return;

    document.getElementById("certRecipientName").textContent = best.user.name;
    document.getElementById("certAwardTitle").textContent = "🌟 BEST TEAM MEMBER OF THE MONTH 🌟";
    document.getElementById("certDateDisplay").textContent = month === "2026-11" ? "November 2026" : "October 2026";
    document.getElementById("rnrCertModal").classList.add("show");
  }

  generateBestLeaderCert(month = "2026-11") {
    const scores = window.store.calculateMonthlyScores(month);
    const best = scores.bestLeader;
    if (!best) return;

    document.getElementById("certRecipientName").textContent = best.user.name;
    document.getElementById("certAwardTitle").textContent = "👑 BEST TEAM LEADER OF THE MONTH 👑";
    document.getElementById("certDateDisplay").textContent = month === "2026-11" ? "November 2026" : "October 2026";
    document.getElementById("rnrCertModal").classList.add("show");
  }

  closeCertModal() {
    document.getElementById("rnrCertModal").classList.remove("show");
  }

  // --- View: Admin Safety ---

  renderAdminPanel() {
    const allUsers = window.store.state.users;
    const pendingUsers = allUsers.filter(u => !u.approved);

    const pendingTbody = document.getElementById("pendingUsersTableBody");
    if (pendingTbody) {
      if (pendingUsers.length === 0) {
        pendingTbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--deep-slate); padding:1.25rem;">✅ All leadership accounts confirmed.</td></tr>`;
      } else {
        pendingTbody.innerHTML = pendingUsers.map(u => `
          <tr>
            <td><strong>${u.name}</strong></td>
            <td>${u.email}</td>
            <td><span class="badge" style="background:#E2E8F0; color:#1E293B;">${u.role.toUpperCase()}</span></td>
            <td>${u.teamName || 'oGV B2C'}</td>
            <td><span class="badge" style="background:#FEF3C7; color:#B45309;">Pending Confirmation</span></td>
            <td>
              <button class="btn btn-success btn-sm" onclick="app.approvePendingUser('${u.id}')">
                Confirm & Approve
              </button>
            </td>
          </tr>
        `).join("");
      }
    }

    const allTbody = document.getElementById("allUsersTableBody");
    if (allTbody) {
      allTbody.innerHTML = allUsers.map(u => `
        <tr>
          <td>
            <div style="display:flex; align-items:center; gap:0.4rem;">
              <span>${u.avatar || '👤'}</span>
              <strong>${u.name}</strong>
              ${u.id === window.store.currentUser?.id ? '<span class="badge" style="background:#D1FAE5; color:#065F46; font-size:0.6rem;">Active</span>' : ''}
            </div>
          </td>
          <td>${u.email}</td>
          <td><span class="badge" style="background:#E2E8F0; color:#334155;">${u.role.toUpperCase()}</span></td>
          <td>${u.teamName || 'General'}</td>
          <td><span class="badge" style="background:${u.approved ? '#D1FAE5' : '#FEF3C7'}; color:${u.approved ? '#065F46' : '#B45309'};">${u.approved ? 'Active' : 'Pending'}</span></td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="app.loginAsUser('${u.id}')">
              Switch As
            </button>
          </td>
        </tr>
      `).join("");
    }
  }

  approvePendingUser(userId) {
    if (window.store.approveUser(userId)) {
      alert("Leadership account confirmed!");
      this.renderAdminPanel();
    }
  }

  loginAsUser(userId) {
    const user = window.store.state.users.find(u => u.id === userId);
    if (user) {
      window.store.setCurrentUser(user);
      this.navigateTo("kanban");
    }
  }

  resetDataToDefaults() {
    if (confirm("Reset Kanban data back to original Term 27.28 demo seed?")) {
      window.store.resetToDefaults();
      alert("Kanban reset to original seed!");
      this.renderKanbanBoard();
    }
  }

  // --- Notifications ---

  updateNotifications() {
    const user = window.store.currentUser;
    const notifs = user ? window.store.state.notifications.filter(n => n.userId === user.id) : [];
    const unread = notifs.filter(n => !n.read).length;

    const badge = document.getElementById("notifBadge");
    if (badge) {
      if (unread > 0) {
        badge.textContent = unread;
        badge.style.display = "inline-flex";
      } else {
        badge.style.display = "none";
      }
    }

    const list = document.getElementById("notifList");
    if (list) {
      if (notifs.length === 0) {
        list.innerHTML = `<div style="font-size:0.8rem; color:var(--deep-slate); text-align:center; padding:1rem;">No notifications.</div>`;
      } else {
        list.innerHTML = notifs.map(n => `
          <div style="background:${n.read ? 'var(--surface-alt)' : '#FFFBEB'}; border-left:3px solid ${n.read ? 'var(--grey-lilac)' : 'var(--deep-slate)'}; padding:0.5rem; border-radius:4px; font-size:0.75rem;">
            <div style="color:var(--near-black); line-height:1.3;">${n.text}</div>
            <div style="color:var(--deep-slate); font-size:0.68rem; margin-top:0.25rem;">${n.timestamp}</div>
          </div>
        `).join("");
      }
    }
  }

  toggleNotifications() {
    const dropdown = document.getElementById("notifDropdown");
    if (dropdown) {
      dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    }
  }

  markAllNotificationsRead() {
    const user = window.store.currentUser;
    if (user) {
      window.store.markNotificationsRead(user.id);
      this.updateNotifications();
    }
  }

  showCandidateTaskModal() {
    document.getElementById("candidateTaskModal").classList.add("show");
  }

  closeCandidateTaskModal() {
    document.getElementById("candidateTaskModal").classList.remove("show");
  }
}

window.app = new KanbanApp();
document.addEventListener("DOMContentLoaded", () => {
  window.app.init();
});
