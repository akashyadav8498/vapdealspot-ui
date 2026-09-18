import { useState, useEffect } from 'react';
import { Button } from '@/configurations/components/ui/button';
import { Input } from '@/configurations/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/configurations/components/ui/select';
import { getAdminUsers, saveAdminUser, deleteAdminUser, getRoles } from '@/configurations/lib/permissions/store';
import type { AdminUser, Role } from '@/configurations/lib/permissions/types';
import { can } from '@/configurations/lib/permissions/engine';
import { Plus, Edit2, Shield, Trash2, Power, PowerOff } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/configurations/components/ui/sheet';

export function ConfigurationsUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<AdminUser> | null>(null);

  const canCreate = can('Users & Permissions', 'Users', 'Create');
  const canEdit = can('Users & Permissions', 'Users', 'Edit');
  const canDelete = can('Users & Permissions', 'Users', 'Delete');

  const loadData = () => {
    setUsers(getAdminUsers());
    setRoles(getRoles());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('admin-users-updated', loadData);
    window.addEventListener('admin-roles-updated', loadData);
    return () => {
      window.removeEventListener('admin-users-updated', loadData);
      window.removeEventListener('admin-roles-updated', loadData);
    };
  }, []);

  const handleOpenDialog = (user?: AdminUser) => {
    if (user) {
      setEditingUser({ ...user });
    } else {
      setEditingUser({
        firstName: '',
        lastName: '',
        email: '',
        roleId: roles[0]?.id || '',
        status: 'active'
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (!editingUser?.firstName || !editingUser?.lastName || !editingUser?.email || !editingUser?.roleId) {
      alert("Please fill in all required fields.");
      return;
    }
    
    // Simple email validation
    if (!editingUser.email.includes('@')) {
      alert("Please enter a valid email address.");
      return;
    }

    const userToSave: AdminUser = {
      id: editingUser.id || `usr_${Date.now()}`,
      firstName: editingUser.firstName,
      lastName: editingUser.lastName,
      email: editingUser.email,
      roleId: editingUser.roleId,
      status: editingUser.status || 'active'
    };

    saveAdminUser(userToSave);
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  const handleToggleStatus = (user: AdminUser) => {
    saveAdminUser({
      ...user,
      status: user.status === 'active' ? 'inactive' : 'active'
    });
  };

  const handleDelete = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteAdminUser(userId);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground tracking-tight">Users</h2>
          <p className="text-sm text-secondary-foreground">Manage administrative access and accounts.</p>
        </div>
        {canCreate && (
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        )}
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map(user => {
                const role = roles.find(r => r.id === user.roleId);
                return (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Shield className="w-3 h-3 text-primary" />
                        <span>{role?.name || 'Unknown Role'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {canEdit && (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(user)} title="Edit User">
                            <Edit2 className="w-4 h-4 text-muted-foreground" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(user)} title={user.status === 'active' ? "Deactivate" : "Activate"}>
                            {user.status === 'active' ? <PowerOff className="w-4 h-4 text-amber-500" /> : <Power className="w-4 h-4 text-green-500" />}
                          </Button>
                        </>
                      )}
                      {canDelete && (
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)} title="Delete User">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <SheetContent className="sm:max-w-[425px]" side="right">
          <SheetHeader>
            <SheetTitle>{editingUser?.id ? 'Edit User' : 'Add User'}</SheetTitle>
            <SheetDescription>
              {editingUser?.id ? 'Update user details and role assignment.' : 'Create a new administrative user.'}
            </SheetDescription>
          </SheetHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input 
                  placeholder="First name" 
                  value={editingUser?.firstName || ''}
                  onChange={e => setEditingUser(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input 
                  placeholder="Last name" 
                  value={editingUser?.lastName || ''}
                  onChange={e => setEditingUser(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input 
                type="email"
                placeholder="name@example.com" 
                value={editingUser?.email || ''}
                onChange={e => setEditingUser(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select 
                value={editingUser?.roleId || ''} 
                onValueChange={val => setEditingUser(prev => ({ ...prev, roleId: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(r => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {editingUser?.id && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select 
                  value={editingUser?.status || 'active'} 
                  onValueChange={val => setEditingUser(prev => ({ ...prev, status: val as 'active'|'inactive' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <SheetFooter className="mt-6 border-t pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveUser}>Save User</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
