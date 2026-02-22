import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { rolePermissions, type UserRole, type Permission } from './permissions';

/**
 * Check if session user has required role
 */
export async function checkRole(requiredRole: UserRole | UserRole[]) {
  const session = (await getServerSession(authOptions as any)) as any;
  const userRole = session?.user?.role;

  if (!userRole) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Unauthorized: No valid session' },
        { status: 401 }
      ),
    };
  }

  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  if (!roles.includes(userRole)) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: `Forbidden: Required role(s): ${roles.join(', ')}. Your role: ${userRole}` },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
    session,
    response: null,
  };
}

/**
 * Check if session user has required permission
 */
export async function checkPermission(requiredPermission: Permission | Permission[]) {
  const session = (await getServerSession(authOptions as any)) as any;
  const userRole = session?.user?.role as UserRole | undefined;

  if (!userRole) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Unauthorized: No valid session' },
        { status: 401 }
      ),
    };
  }

  const userPermissions = rolePermissions[userRole] || [];
  const requiredPerms = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
  const hasPermission = requiredPerms.some(p => userPermissions.includes(p));

  if (!hasPermission) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          error: `Forbidden: Required permission(s): ${requiredPerms.join(', ')}`,
          yourPermissions: userPermissions,
        },
        { status: 403 }
      ),
    };
  }

  return {
    authorized:true,
    session,
    response: null,
  };
}

/**
 * Get session or return unauthorized response
 */
export async function getSessionOrUnauthorized() {
  const session = (await getServerSession(authOptions as any)) as any;

  if (!session?.user?.role) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Unauthorized: No valid session' },
        { status: 401 }
      ),
    };
  }

  return {
    authorized: true,
    session,
    response: null,
  };
}
