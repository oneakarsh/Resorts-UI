# User Roles and Permissions System

This document describes the role-based access control (RBAC) system implemented in the scaper application.

## Roles

The application supports three user roles:

### 1. **User**
Regular users who can:
- View available resorts
- Create bookings
- View their own bookings
- Cancel their own bookings

### 2. **Admin**
Administrative users who can:
- Perform all user actions
- Create, update, and delete resorts
- View all bookings
- Update booking status (confirm/cancel)

### 3. **Super Admin**
Super administrators who can:
- Perform all admin actions
- Manage user accounts (create, read, update, delete)
- Manage other admins
- Manage property owners
- Access system settings
- View analytics

## Permissions

The permission system is granular and allows checking specific capabilities:

### Resource Permissions:
- `view_resorts` - View resort listings
- `create_resort` - Create new resorts
- `update_resort` - Modify existing resorts
- `delete_resort` - Delete resorts

### Booking Permissions:
- `create_booking` - Create new bookings
- `view_own_booking` - View user's own bookings
- `cancel_own_booking` - Cancel user's own bookings
- `view_all_bookings` - View all bookings in the system
- `update_booking_status` - Modify booking status

### System Permissions:
- `manage_users` - Manage user accounts
- `manage_admins` - Manage admin accounts
- `manage_property_owners` - Manage property owner accounts
- `system_settings` - Access system configuration
- `view_analytics` - View system analytics

## Usage

### In React Components

Check if a user has permission before rendering UI:

```typescript
import { hasPermission, getPermissionsForRole } from '@/lib/permissions';
import { useSession } from 'next-auth/react';

export function AdminPanel() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;
  
  if (!hasPermission(userRole, 'manage_users')) {
    return <div>Access Denied</div>;
  }
  
  return <div>Admin Controls</div>;
}
```

### In API Routes

Use the helper functions in API routes to check authorization:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { checkRole, checkPermission } from '@/lib/apiAuth';

export async function POST(req: NextRequest) {
  // Check for a specific role
  const { authorized, session, response } = await checkRole('superadmin');
  
  if (!authorized) {
    return response; // Returns 403 error
  }
  
  // Proceed with request...
}
```

Check for multiple roles:

```typescript
export async function PUT(req: NextRequest) {
  const { authorized, session, response } = await checkRole(['admin', 'superadmin']);
  
  if (!authorized) {
    return response;
  }
  
  // Proceed with request...
}
```

### Getting Session or Unauthorized Response

For endpoints that require authentication but not specific roles:

```typescript
import { getSessionOrUnauthorized } from '@/lib/apiAuth';

export async function GET(req: NextRequest) {
  const { authorized, session, response } = await getSessionOrUnauthorized();
  
  if (!authorized) {
    return response; // Returns 401 error
  }
  
  // Proceed with request...
}
```

## Permission Check Functions

### `hasPermission(role: UserRole | undefined, permission: Permission): boolean`
Check if a role has a specific permission.

```typescript
if (hasPermission('admin', 'create_resort')) {
  // Can create resorts
}
```

### `hasAnyPermission(role: UserRole | undefined, permissions: Permission[]): boolean`
Check if a role has at least one of the given permissions.

```typescript
if (hasAnyPermission('admin', ['manage_users', 'manage_admins'])) {
  // Has at least one permission
}
```

### `hasAllPermissions(role: UserRole | undefined, permissions: Permission[]): boolean`
Check if a role has all of the given permissions.

```typescript
if (hasAllPermissions('superadmin', ['manage_users', 'system_settings'])) {
  // Has all permissions
}
```

### `getPermissionsForRole(role: UserRole | undefined): Permission[]`
Get all permissions for a role.

```typescript
const adminPermissions = getPermissionsForRole('admin');
```

## Error Responses

### Unauthorized (401)
Returned when user is not authenticated:
```json
{
  "error": "Unauthorized: No valid session",
  "status": 401
}
```

### Forbidden (403)
Returned when user lacks required role or permission:
```json
{
  "error": "Forbidden: Required role(s): superadmin. Your role: admin",
  "status": 403
}
```

## Files

- `src/lib/permissions.ts` - Core permission definitions and utility functions
- `src/lib/apiAuth.ts` - API authorization helpers for Next.js route handlers
- `src/types/index.ts` - TypeScript interfaces including User type

## Implementation Details

### Role-Permission Mapping
The `rolePermissions` object in `permissions.ts` defines which permissions each role has:

```typescript
export const rolePermissions: Record<UserRole, Permission[]> = {
  user: [...],
  admin: [...],
  superadmin: [...]
};
```

### API Route Protection
Most API routes that modify data check roles/permissions:

- `POST /api/resorts` - Requires admin or superadmin
- `PUT /api/resorts/[id]` - Requires admin or superadmin
- `DELETE /api/resorts/[id]` - Requires admin or superadmin
- `POST /api/users` - Requires superadmin
- `GET /api/users` - Requires superadmin
- `PATCH /api/bookings/[id]/status` - Requires admin or superadmin

## Adding New Permissions

To add new permissions:

1. Add the permission string to the `Permission` type in `src/lib/permissions.ts`
2. Add the permission to the appropriate roles in `rolePermissions`
3. Update API routes to check the new permission using `checkPermission()` or `checkRole()`
4. Update components to check permissions before showing UI

Example:
```typescript
// In permissions.ts
export type Permission = 
  | 'existing_permission'
  | 'new_permission'; // Add here

export const rolePermissions: Record<UserRole, Permission[]> = {
  user: [...],
  admin: [..., 'new_permission'], // Add where needed
  superadmin: [..., 'new_permission'], // Add where needed
};
```

## Best Practices

1. **Always check permissions** - Don't rely on UI hiding to prevent unauthorized access
2. **Be specific** - Use the most specific permission needed rather than checking for a role
3. **Fail securely** - Default to denying access if permission is unclear
4. **Log authorization failures** - Use console.error for debugging
5. **Return helpful errors** - Include details about required permissions in error messages
