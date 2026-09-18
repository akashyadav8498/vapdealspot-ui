export type Action = 'View' | 'Create' | 'Edit' | 'Delete' | 'Import' | 'Export' | 'Send';

export type Module = 'Products' | 'Email Marketing' | 'Users & Permissions';

export type Submodule = 
  | 'Products' | 'Imports'              // Products Module
  | 'Campaigns' | 'Audience'            // Email Marketing Module
  | 'Users' | 'Roles & Permissions';    // Users & Permissions Module

export interface Permission {
  module: Module;
  submodule: Submodule;
  actions: Action[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  status: 'active' | 'inactive';
}

// Single source of truth for the permission catalog hierarchy
export const PERMISSION_CATALOG: {
  module: Module;
  submodules: { name: Submodule; availableActions: Action[] }[];
}[] = [
  {
    module: 'Products',
    submodules: [
      { name: 'Products', availableActions: ['View', 'Create', 'Edit', 'Delete'] },
      { name: 'Imports', availableActions: ['View', 'Import'] },
    ],
  },
  {
    module: 'Email Marketing',
    submodules: [
      { name: 'Campaigns', availableActions: ['View', 'Create', 'Edit', 'Delete', 'Send'] },
      { name: 'Audience', availableActions: ['View', 'Create', 'Edit', 'Delete', 'Import', 'Export'] },
    ],
  },
  {
    module: 'Users & Permissions',
    submodules: [
      { name: 'Users', availableActions: ['View', 'Create', 'Edit', 'Delete'] },
      { name: 'Roles & Permissions', availableActions: ['View', 'Create', 'Edit', 'Delete'] },
    ],
  },
];
