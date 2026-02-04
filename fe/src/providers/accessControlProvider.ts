import type { AccessControlProvider } from '@refinedev/core'
import type { UserRole, IUser } from '../types'
import { USER_ROLES } from '../types'
import { authProvider } from './authProvider'

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    // Get user identity from authProvider
    const identity = (await authProvider.getIdentity?.()) as IUser | undefined
    const userRole = identity?.role as UserRole | undefined

    if (!userRole) {
      // No role means not authenticated, deny access
      return { can: false }
    }

    // Define access rules
    const rules: Record<string, Record<string, UserRole[]>> = {
      // Courses - all roles can list/show, only Manager/Instructor can create/edit/delete
      courses: {
        list: [USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.MANAGER],
        show: [USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.MANAGER],
        create: [USER_ROLES.INSTRUCTOR, USER_ROLES.MANAGER],
        edit: [USER_ROLES.INSTRUCTOR, USER_ROLES.MANAGER],
        delete: [USER_ROLES.MANAGER],
      },
      // Enrollments - only Manager can access
      enrollments: {
        list: [USER_ROLES.MANAGER],
        show: [USER_ROLES.MANAGER],
      },
      // My Enrollments - only Students can access
      'my-enrollments': {
        list: [USER_ROLES.STUDENT],
        show: [USER_ROLES.STUDENT],
      },
    }

    // Check if resource and action are defined in rules
    const resourceRules = rules[resource || '']
    if (!resourceRules) {
      // Resource not in rules, deny by default
      return { can: false }
    }

    const allowedRoles = resourceRules[action || '']
    if (!allowedRoles) {
      // Action not in rules, deny by default
      return { can: false }
    }

    // Check if user's role is in allowed roles
    const can = allowedRoles.includes(userRole)

    return { can }
  },
}
