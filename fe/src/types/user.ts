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
  first_name: string
  last_name: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface ILoginRequest {
  email: string
  password: string
}

export interface ILoginResponse {
  access_token: string
  refresh_token: string
  user: IUser
}

export interface IAuthUser extends IUser {
  accessToken: string
}
