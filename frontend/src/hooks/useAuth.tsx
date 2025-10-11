import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { getMe } from '../api/auth'
import { setAuthToken } from '../api/axiosClient'

// Set VITE_API_BASE in .env file in frontend directory, e.g., VITE_API_BASE=http://localhost:8000

interface AuthContextType {
  user: any
  login: (token: string, user?: any) => Promise<void>
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
    const initAuth = async () => {
      const token = localStorage.getItem('access_token')
      if (token) {
        setAuthToken(token)
        try {
          const userData = await getMe()
          setUser(userData)
          localStorage.setItem('role', userData.role)
        } catch (error) {
          localStorage.removeItem('access_token')
          localStorage.removeItem('role')
          setUser(null)
          setAuthToken(null)
        }
      }
      setIsLoading(false)
    }
    initAuth()
  }, [])

  const login = async (token: string, userData?: any) => {
    localStorage.setItem('access_token', token)
    setAuthToken(token)
    if (userData) {
      setUser(userData)
      localStorage.setItem('role', userData.role)
    } else {
      try {
        const fetchedUser = await getMe()
        setUser(fetchedUser)
        localStorage.setItem('role', fetchedUser.role)
      } catch (error) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('role')
        setUser(null)
        setAuthToken(null)
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('role')
    setUser(null)
    setAuthToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
