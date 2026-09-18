import type { Role, AdminUser } from './types';

const ROLES_STORAGE_KEY = 'vapdealspot_admin_roles';
const USERS_STORAGE_KEY = 'vapdealspot_admin_users';

const DEFAULT_ROLES: Role[] = [
  {
    id: 'role_super_admin',
    name: 'Super Admin',
    description: 'Full access to all modules and configurations.',
    permissions: [
      { module: 'Products', submodule: 'Products', actions: ['View', 'Create', 'Edit', 'Delete'] },
      { module: 'Products', submodule: 'Imports', actions: ['View', 'Import'] },
      { module: 'Email Marketing', submodule: 'Campaigns', actions: ['View', 'Create', 'Edit', 'Delete', 'Send'] },
      { module: 'Email Marketing', submodule: 'Audience', actions: ['View', 'Create', 'Edit', 'Delete', 'Import', 'Export'] },
      { module: 'Users & Permissions', submodule: 'Users', actions: ['View', 'Create', 'Edit', 'Delete'] },
      { module: 'Users & Permissions', submodule: 'Roles & Permissions', actions: ['View', 'Create', 'Edit', 'Delete'] },
    ]
  },
  {
    id: 'role_admin',
    name: 'Admin',
    description: 'Full access excluding Roles & Permissions management.',
    permissions: [
      { module: 'Products', submodule: 'Products', actions: ['View', 'Create', 'Edit', 'Delete'] },
      { module: 'Products', submodule: 'Imports', actions: ['View', 'Import'] },
      { module: 'Email Marketing', submodule: 'Campaigns', actions: ['View', 'Create', 'Edit', 'Delete', 'Send'] },
      { module: 'Email Marketing', submodule: 'Audience', actions: ['View', 'Create', 'Edit', 'Delete', 'Import', 'Export'] },
      { module: 'Users & Permissions', submodule: 'Users', actions: ['View', 'Create', 'Edit'] },
      { module: 'Users & Permissions', submodule: 'Roles & Permissions', actions: ['View'] },
    ]
  },
  {
    id: 'role_marketer',
    name: 'Marketer',
    description: 'Access to Email Marketing and Audience management.',
    permissions: [
      { module: 'Products', submodule: 'Products', actions: ['View'] },
      { module: 'Email Marketing', submodule: 'Campaigns', actions: ['View', 'Create', 'Edit', 'Send'] },
      { module: 'Email Marketing', submodule: 'Audience', actions: ['View', 'Create', 'Edit', 'Import', 'Export'] },
    ]
  },
  {
    id: 'role_designer',
    name: 'Designer',
    description: 'Can design campaigns but not send them.',
    permissions: [
      { module: 'Products', submodule: 'Products', actions: ['View'] },
      { module: 'Email Marketing', submodule: 'Campaigns', actions: ['View', 'Create', 'Edit'] },
    ]
  },
  {
    id: 'role_analyst',
    name: 'Analyst',
    description: 'Can view data and export audiences.',
    permissions: [
      { module: 'Products', submodule: 'Products', actions: ['View'] },
      { module: 'Email Marketing', submodule: 'Campaigns', actions: ['View'] },
      { module: 'Email Marketing', submodule: 'Audience', actions: ['View', 'Export'] },
    ]
  },
  {
    id: 'role_viewer',
    name: 'Viewer',
    description: 'Read-only access to most modules.',
    permissions: [
      { module: 'Products', submodule: 'Products', actions: ['View'] },
      { module: 'Email Marketing', submodule: 'Campaigns', actions: ['View'] },
      { module: 'Email Marketing', submodule: 'Audience', actions: ['View'] },
    ]
  }
];

const DEFAULT_USERS: AdminUser[] = [
  {
    id: 'usr_superadmin',
    firstName: 'Super',
    lastName: 'Admin',
    email: 'superadmin@vapedealspot.com', // Maps to mock auth
    roleId: 'role_super_admin',
    status: 'active'
  },
  {
    id: 'usr_admin',
    firstName: 'System',
    lastName: 'Admin',
    email: 'admin@vapedealspot.com', // Maps to mock auth
    roleId: 'role_admin',
    status: 'active'
  }
];

export function getRoles(): Role[] {
  const stored = localStorage.getItem(ROLES_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as Role[];
    } catch {
      return DEFAULT_ROLES;
    }
  }
  return DEFAULT_ROLES;
}

export function saveRole(role: Role): void {
  const roles = getRoles();
  const index = roles.findIndex(r => r.id === role.id);
  if (index >= 0) {
    roles[index] = role;
  } else {
    roles.push(role);
  }
  localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(roles));
  window.dispatchEvent(new Event('admin-roles-updated'));
}

export function deleteRole(roleId: string): void {
  const roles = getRoles().filter(r => r.id !== roleId);
  localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(roles));
  window.dispatchEvent(new Event('admin-roles-updated'));
}

export function getAdminUsers(): AdminUser[] {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as AdminUser[];
    } catch {
      return DEFAULT_USERS;
    }
  }
  return DEFAULT_USERS;
}

export function saveAdminUser(user: AdminUser): void {
  const users = getAdminUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  window.dispatchEvent(new Event('admin-users-updated'));
}

export function deleteAdminUser(userId: string): void {
  const users = getAdminUsers().filter(u => u.id !== userId);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  window.dispatchEvent(new Event('admin-users-updated'));
}
