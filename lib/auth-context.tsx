"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (data: {
    nombre: string
    email: string
    password: string
    telefono?: string
    direccion?: string
    nacionalidad?: string
    genero?: number
  }) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      throw new Error("Invalid credentials")
    }

    const userData = await response.json()
    setUser(userData)
    localStorage.setItem("currentUser", JSON.stringify(userData))
  }

  const signup = async (data: {
    nombre: string
    email: string
    password: string
    telefono?: string
    direccion?: string
    nacionalidad?: string
    genero?: number
  }) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Registration failed")
    }

    const userData = await response.json()
    setUser(userData)
    localStorage.setItem("currentUser", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return

    const response = await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, ...data }),
    })

    const updatedUser = await response.json()
    setUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
