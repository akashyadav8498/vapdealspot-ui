import { useState, useEffect } from 'react';
import { Button } from '@/configurations/components/ui/button';
import { Input } from '@/configurations/components/ui/input';
import { getRoles, saveRole, deleteRole, getAdminUsers } from '@/configurations/lib/permissions/store';
import { PERMISSION_CATALOG } from '@/configurations/lib/permissions/types';
import type { Role, Action, Module, Submodule } from '@/configurations/lib/permissions/types';
import { can } from '@/configurations/lib/permissions/engine';
import { Plus, Edit2, Trash2, Shield, Users } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/configurations/components/ui/sheet';

export function RolesPermissionsPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [usersCount, setUsersCount] = useState<Record<string, number>>({});
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Partial<Role> | null>(null);

  const canCreate = can('Users & Permissions', 'Roles & Permissions', 'Create');
  const canEdit = can('Users & Permissions', 'Roles & Permissions', 'Edit');
  const canDelete = can('Users & Permissions', 'Roles & Permissions', 'Delete');

  const loadData = () => {
    const loadedRoles = getRoles();
    setRoles(loadedRoles);
    
    const users = getAdminUsers();
    const counts: Record<string, number> = {};
    users.forEach(u => {
      counts[u.roleId] = (counts[u.roleId] || 0) + 1;
    });
    setUsersCount(counts);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('admin-roles-updated', loadData);
    window.addEventListener('admin-users-updated', loadData);
    return () => {
      window.removeEventListener('admin-roles-updated', loadData);
      window.removeEventListener('admin-users-updated', loadData);
    };
  }, []);

  const handleOpenDialog = (role?: Role) => {
    if (role) {
      // Deep clone permissions
      setEditingRole({ 
        ...role,
        permissions: JSON.parse(JSON.stringify(role.permissions))
      });
    } else {
      setEditingRole({
        name: '',
        description: '',
        permissions: []
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveRole = () => {
    if (!editingRole?.name) {
      alert("Role name is required.");
      return;
    }
    
    const isNew = !editingRole.id;
    if (isNew && roles.some(r => r.name.toLowerCase() === editingRole.name?.toLowerCase())) {
      alert("A role with this name already exists.");
      return;
    }

    const roleToSave: Role = {
      id: editingRole.id || `role_${Date.now()}`,
      name: editingRole.name,
      description: editingRole.description || '',
      permissions: editingRole.permissions || []
    };

    saveRole(roleToSave);
    setIsDialogOpen(false);
    setEditingRole(null);
  };

  const handleDelete = (roleId: string) => {
    if (roleId === 'role_super_admin') {
      alert("Cannot delete the Super Admin role.");
      return;
    }
    if (usersCount[roleId] > 0) {
      alert(`Cannot delete this role because it is currently assigned to ${usersCount[roleId]} user(s). Reassign them first.`);
      return;
    }
    if (confirm("Are you sure you want to delete this role?")) {
      deleteRole(roleId);
    }
  };

  // Matrix Permission Toggle logic
  const handleTogglePermission = (module: Module, submodule: Submodule, action: Action) => {
    if (!editingRole) return;
    
    const currentPerms = [...(editingRole.permissions || [])];
    const permIndex = currentPerms.findIndex(p => p.module === module && p.submodule === submodule);
    
    if (permIndex >= 0) {
      const perm = { ...currentPerms[permIndex] };
      if (perm.actions.includes(action)) {
        perm.actions = perm.actions.filter(a => a !== action);
        if (perm.actions.length === 0) {
          // Remove entirely if no actions left
          currentPerms.splice(permIndex, 1);
        } else {
          currentPerms[permIndex] = perm;
        }
      } else {
        perm.actions = [...perm.actions, action];
        currentPerms[permIndex] = perm;
      }
    } else {
      currentPerms.push({ module, submodule, actions: [action] });
    }
    
    setEditingRole({ ...editingRole, permissions: currentPerms });
  };

  const hasPermission = (module: Module, submodule: Submodule, action: Action) => {
    if (!editingRole?.permissions) return false;
    return editingRole.permissions.some(p => p.module === module && p.submodule === submodule && p.actions.includes(action));
  };

  const ALL_ACTIONS: Action[] = ['View', 'Create', 'Edit', 'Delete', 'Import', 'Export', 'Send'];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground tracking-tight">Roles & Permissions</h2>
          <p className="text-sm text-secondary-foreground">Define roles and manage their access to different modules.</p>
        </div>
        {canCreate && (
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Create Role
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map(role => (
          <div key={role.id} className="bg-card border rounded-lg p-5 flex flex-col hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <Shield className="w-4 h-4 text-primary" />
                {role.name}
              </div>
              <div className="flex gap-1">
                {canEdit && (
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDialog(role)}>
                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                )}
                {canDelete && role.id !== 'role_super_admin' && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => handleDelete(role.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
              {role.description || 'No description provided.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 w-fit px-2 py-1 rounded">
              <Users className="w-3 h-3" />
              {usersCount[role.id] || 0} users assigned
            </div>
          </div>
        ))}
      </div>

      <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <SheetContent className="w-full sm:max-w-3xl overflow-y-auto" side="right">
          <SheetHeader>
            <SheetTitle>{editingRole?.id ? 'Edit Role' : 'Create Role'}</SheetTitle>
            <SheetDescription>
              Configure role details and specific module permissions.
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto py-4 pr-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Role Name</label>
                <Input 
                  placeholder="e.g. Sales Manager" 
                  value={editingRole?.name || ''}
                  onChange={e => setEditingRole(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                  disabled={editingRole?.id === 'role_super_admin'}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input 
                  placeholder="Brief description of this role" 
                  value={editingRole?.description || ''}
                  onChange={e => setEditingRole(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Permission Matrix</h4>
              <div className="border rounded-md overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground border-b">
                    <tr>
                      <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[150px]">Module</th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[150px]">Submodule</th>
                      {ALL_ACTIONS.map(action => (
                        <th key={action} className="px-2 py-3 font-medium text-center w-16">{action}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {PERMISSION_CATALOG.map(moduleInfo => (
                      moduleInfo.submodules.map((sub, idx) => (
                        <tr key={`${moduleInfo.module}-${sub.name}`} className="hover:bg-muted/10">
                          {idx === 0 && (
                            <td rowSpan={moduleInfo.submodules.length} className="px-4 py-3 font-medium align-top border-r bg-muted/5">
                              {moduleInfo.module}
                            </td>
                          )}
                          <td className="px-4 py-3 text-muted-foreground border-r bg-white">
                            {sub.name}
                          </td>
                          {ALL_ACTIONS.map(action => {
                            const isApplicable = sub.availableActions.includes(action);
                            const checked = hasPermission(moduleInfo.module, sub.name, action);
                            return (
                              <td key={action} className="px-2 py-3 text-center border-r bg-white">
                                {isApplicable ? (
                                  <input 
                                    type="checkbox" 
                                    className="w-4 h-4 cursor-pointer accent-primary"
                                    checked={checked}
                                    onChange={() => handleTogglePermission(moduleInfo.module, sub.name, action)}
                                    disabled={editingRole?.id === 'role_super_admin'}
                                    title={`Toggle ${action} for ${sub.name}`}
                                  />
                                ) : (
                                  <span className="text-muted/30">-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    ))}
                  </tbody>
                </table>
              </div>
              {editingRole?.id === 'role_super_admin' && (
                <p className="text-xs text-amber-600 mt-2">
                  Super Admin permissions cannot be modified.
                </p>
              )}
            </div>
          </div>
          
          <SheetFooter className="pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveRole} disabled={editingRole?.id === 'role_super_admin' && !editingRole.description && !editingRole.name}>Save Role</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
