import React from 'react';
import { getCurrentRole } from '../authService';
import type { UserRole } from '../authService';
import { getRoles } from './store';
import type { Module, Submodule, Action } from './types';

/**
 * Maps the legacy simple `UserRole` from `authService` to a full Permission `Role` id.
 */
export function mapAuthRoleToPermissionRoleId(authRole: UserRole): string {
  if (authRole === 'super_admin') return 'role_super_admin';
  if (authRole === 'admin') return 'role_admin';
  // Fallback to viewer if unknown or regular user hits admin boundary
  return 'role_viewer';
}

/**
 * Evaluates whether the currently logged in user can perform an action.
 */
export function can(module: Module, submodule: Submodule, action: Action): boolean {
  const currentAuthRole = getCurrentRole();
  
  // Quick escape for development/safety: If no auth role somehow, deny.
  if (!currentAuthRole) return false;

  const activeRoleId = mapAuthRoleToPermissionRoleId(currentAuthRole);
  const roles = getRoles();
  const activeRole = roles.find(r => r.id === activeRoleId);

  if (!activeRole) return false;

  // Check if role has a permission entry for this module/submodule that includes the action
  return activeRole.permissions.some(
    p => p.module === module && p.submodule === submodule && p.actions.includes(action)
  );
}

/**
 * React Component Wrapper for UI elements that require specific permissions.
 */
interface PermissionGuardProps {
  module: Module;
  submodule: Submodule;
  action: Action;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ module, submodule, action, children, fallback = null }: PermissionGuardProps) {
  if (can(module, submodule, action)) {
    return <>{children}</>;
  }
  return <>{fallback}</>;
}
