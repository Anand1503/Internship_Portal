import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import apiClient from '../api/client'

// Set VITE_API_BASE in .env file in frontend directory, e.g., VITE_API_BASE=http://localhost:8000

interface AuthContextType {
  user: any
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Optionally validate token with backend
      setUser({ token })
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Expected token shape: { access_token: string }
    const response = await apiClient.post('/auth/token', { email, password })
    const { access_token } = response.data
    localStorage.setItem('token', access_token)
    setUser({ token: access_token })
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
