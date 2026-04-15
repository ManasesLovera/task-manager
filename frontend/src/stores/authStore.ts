import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserResponse } from '../api/types'

interface AuthState {
  user: UserResponse | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: UserResponse, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
