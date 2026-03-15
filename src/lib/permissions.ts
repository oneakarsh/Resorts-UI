// Role-based permissions mapping
export type UserRole = 'user' | 'property_owner' | 'manager' | 'superadmin';

export type Permission =
  | 'view_resorts'
  | 'create_resort'
  | 'update_resort'
  | 'delete_resort'
  | 'create_booking'
  | 'view_own_booking'
  | 'cancel_own_booking'
  | 'view_all_bookings'
  | 'update_booking_status'
  | 'manage_users'
  | 'manage_admins'
  | 'manage_property_owners'
  | 'system_settings'
  | 'view_analytics'
  | 'chat_access';

export const rolePermissions: Record<UserRole, Permission[]> = {
  user: [
    'view_resorts',
    'create_booking',
    'view_own_booking',
    'cancel_own_booking',
  ],
  property_owner: [
    'view_resorts',
    'create_resort',
    'update_resort',
    'delete_resort',
    'create_booking',
    'view_own_booking',
    'cancel_own_booking',
    'view_all_bookings',
    'update_booking_status',
    'view_analytics',
    'chat_access',
  ],
  manager: [
    'view_resorts',
    'create_resort',
    'update_resort',
    'delete_resort',
    'create_booking',
    'view_own_booking',
    'cancel_own_booking',
    'view_all_bookings',
    'update_booking_status',
    'chat_access',
  ],
  superadmin: [
    'view_resorts',
    'create_resort',
    'update_resort',
    'delete_resort',
    'create_booking',
    'view_own_booking',
    'cancel_own_booking',
    'view_all_bookings',
    'update_booking_status',
    'manage_users',
    'manage_admins',
    'manage_property_owners',
    'system_settings',
    'view_analytics',
    'chat_access',
  ],
};

/**
 * Check if a user role has a specific permission
 */
export const hasPermission = (role: UserRole | undefined, permission: Permission): boolean => {
  if (!role) return false;
  const permissions = rolePermissions[role] || [];
  return permissions.includes(permission);
};

/**
 * Check if a user role has any of the given permissions
 */
export const hasAnyPermission = (role: UserRole | undefined, permissions: Permission[]): boolean => {
  if (!role) return false;
  const userPermissions = rolePermissions[role] || [];
  return permissions.some(p => userPermissions.includes(p));
};

/**
 * Check if a user role has all of the given permissions
 */
export const hasAllPermissions = (role: UserRole | undefined, permissions: Permission[]): boolean => {
  if (!role) return false;
  const userPermissions = rolePermissions[role] || [];
  return permissions.every(p => userPermissions.includes(p));
};

/**
 * Get all permissions for a role
 */
export const getPermissionsForRole = (role: UserRole | undefined): Permission[] => {
  if (!role) return [];
  return rolePermissions[role] || [];
};
