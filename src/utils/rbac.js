/**
 * Role-Based Access Control (RBAC) Module
 * AIESEC in University of Moratuwa · Term 27.28
 * Functions: oGV B2C & Talent Management
 */

export const ROLES = {
  MEMBER: 'member',
  LEADER: 'leader',
  LCVP: 'lcvp',
  ADMIN: 'admin'
};

export const PERMISSIONS = {
  CAN_CREATE_FLYER: 'CAN_CREATE_FLYER',
  CAN_REVIEW_STAGE_1: 'CAN_REVIEW_STAGE_1',     // Move Member -> Team Leader
  CAN_APPROVE_FINAL: 'CAN_APPROVE_FINAL',       // Move Team Leader -> LCVP (Ready to Post)
  CAN_REJECT_TO_STAGE_1: 'CAN_REJECT_TO_STAGE_1', // Move Team Leader -> Member (Request Changes)
  CAN_COMMENT: 'CAN_COMMENT',
  CAN_ACCESS_ADMIN: 'CAN_ACCESS_ADMIN',
  CAN_VIEW_METRICS: 'CAN_VIEW_METRICS'
};

export const ROLE_PERMISSIONS = {
  [ROLES.MEMBER]: [
    PERMISSIONS.CAN_CREATE_FLYER,
    PERMISSIONS.CAN_COMMENT,
    PERMISSIONS.CAN_VIEW_METRICS
  ],
  [ROLES.LEADER]: [
    PERMISSIONS.CAN_CREATE_FLYER,
    PERMISSIONS.CAN_REVIEW_STAGE_1,
    PERMISSIONS.CAN_REJECT_TO_STAGE_1,
    PERMISSIONS.CAN_COMMENT,
    PERMISSIONS.CAN_VIEW_METRICS
  ],
  [ROLES.LCVP]: [
    PERMISSIONS.CAN_CREATE_FLYER,
    PERMISSIONS.CAN_REVIEW_STAGE_1,
    PERMISSIONS.CAN_APPROVE_FINAL,
    PERMISSIONS.CAN_REJECT_TO_STAGE_1,
    PERMISSIONS.CAN_COMMENT,
    PERMISSIONS.CAN_VIEW_METRICS
  ],
  [ROLES.ADMIN]: [
    PERMISSIONS.CAN_CREATE_FLYER,
    PERMISSIONS.CAN_REVIEW_STAGE_1,
    PERMISSIONS.CAN_APPROVE_FINAL,
    PERMISSIONS.CAN_REJECT_TO_STAGE_1,
    PERMISSIONS.CAN_COMMENT,
    PERMISSIONS.CAN_ACCESS_ADMIN,
    PERMISSIONS.CAN_VIEW_METRICS
  ]
};

export const ROLE_DEFINITIONS = {
  [ROLES.MEMBER]: {
    name: 'Team Member',
    department: 'oGV B2C Marketing',
    initials: 'TM',
    clearanceLevel: 'Level 1: Execution & Creation',
    description: 'Permitted to upload Canva assets, tag campaign categories, and inspect approval status.',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
  },
  [ROLES.LEADER]: {
    name: 'Team Leader',
    department: 'oGV B2C Management',
    initials: 'TL',
    clearanceLevel: 'Level 2: Team Review & Quality Control',
    description: 'Permitted to review Member submissions, add revision comments, and escalate cards to Column 2.',
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200'
  },
  [ROLES.LCVP]: {
    name: 'LCVP oGV B2C',
    department: 'Local Committee Executive Board',
    initials: 'VP',
    clearanceLevel: 'Level 3: Executive Governance & Final Authorization',
    description: 'Sole authority to authorize publication (move cards to Column 3) and direct executive releases.',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  [ROLES.ADMIN]: {
    name: 'Candidate LCVP TM',
    department: 'Talent Management & Operations',
    initials: 'AD',
    clearanceLevel: 'Level 4: Super-Admin & Safety Governance',
    description: 'Oversees safety validation, confirms leadership accounts, and monitors audit logs.',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
  }
};

/**
 * Check if a role possesses a specific permission
 */
export function hasPermission(role, permission) {
  const perms = ROLE_PERMISSIONS[role] || [];
  return perms.includes(permission);
}

/**
 * Validate a proposed column movement against RBAC rules
 */
export function canTransition(role, currentColumn, targetColumn) {
  if (currentColumn === targetColumn) return { allowed: true };

  // Step 1 -> Step 2 (Member -> Team Leader)
  if (currentColumn === 'member' && targetColumn === 'leader') {
    if (!hasPermission(role, PERMISSIONS.CAN_REVIEW_STAGE_1)) {
      return {
        allowed: false,
        reason: 'Permission Denied: Only Team Leaders, LCVP, or TM Admins hold permission [CAN_REVIEW_STAGE_1] to move deliverables to the Team Leader review queue.'
      };
    }
  }

  // Step 2 -> Step 3 (Team Leader -> LCVP)
  if (targetColumn === 'lcvp') {
    if (!hasPermission(role, PERMISSIONS.CAN_APPROVE_FINAL)) {
      return {
        allowed: false,
        reason: 'Permission Denied: Only the LCVP or TM Admin holds permission [CAN_APPROVE_FINAL] to grant final publication authorization.'
      };
    }
  }

  // Step 2 -> Step 1 (Team Leader -> Member)
  if (currentColumn === 'leader' && targetColumn === 'member') {
    if (!hasPermission(role, PERMISSIONS.CAN_REJECT_TO_STAGE_1)) {
      return {
        allowed: false,
        reason: 'Permission Denied: Insufficient clearance to return deliverable for revision.'
      };
    }
  }

  return { allowed: true };
}
