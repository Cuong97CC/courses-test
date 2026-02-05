export const USER_ROLES = {
  STUDENT: 'STUDENT',
  INSTRUCTOR: 'INSTRUCTOR',
  MANAGER: 'MANAGER',
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

export const USER_ROLE_VALUES = Object.values(USER_ROLES)

export interface IUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface ILoginRequest {
  email: string
  password: string
}

export interface ILoginResponse {
  accessToken: string
  refreshToken: string
  user: IUser
}

export interface IAuthUser extends IUser {
  accessToken: string
}
