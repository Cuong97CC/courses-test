import type { AuthBindings } from '@refinedev/core'
import axiosInstance from '../utils/axios'
import { TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from '../utils/constants'
import type { ILoginRequest, ILoginResponse, IUser } from '../types'

export const authProvider: AuthBindings = {
  login: async ({ email, password }: ILoginRequest) => {
    try {
      const response = await axiosInstance.post<ILoginResponse>('/auth/login', {
        email,
        password,
      })

      const { access_token, refresh_token, user } = response.data

      // Store tokens and user
      localStorage.setItem(TOKEN_KEY, access_token)
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))

      return {
        success: true,
        redirectTo: '/',
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: 'LoginError',
          message: error.response?.data?.message || 'Invalid email or password',
        },
      }
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    }

    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)

    return {
      success: true,
      redirectTo: '/login',
    }
  },

  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY)

    if (!token) {
      return {
        authenticated: false,
        logout: true,
        redirectTo: '/login',
      }
    }

    return {
      authenticated: true,
    }
  },

  getPermissions: async () => {
    const userStr = localStorage.getItem(USER_KEY)
    if (!userStr) return null

    const user: IUser = JSON.parse(userStr)
    return user.role
  },

  getIdentity: async () => {
    const userStr = localStorage.getItem(USER_KEY)
    if (!userStr) return null

    const user: IUser = JSON.parse(userStr)
    return user
  },

  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
        redirectTo: '/login',
        error,
      }
    }

    return { error }
  },
}
