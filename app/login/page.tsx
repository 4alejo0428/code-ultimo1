"use client"

import type React from "react"
import Link from "next/link"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (err) {
      setError('Email o contraseña incorrectos. Intenta con contraseña: "password"')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 backdrop-blur">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M10.5 1.5H3a1.5 1.5 0 0 0-1.5 1.5v14a1.5 1.5 0 0 0 1.5 1.5h14a1.5 1.5 0 0 0 1.5-1.5V9.5M10.5 1.5v8m0 0H2.5m8 0h8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">CarRental</h1>
            <p className="text-slate-400 text-sm mt-2">Inicia sesión en tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none transition"
                required
              />
              <p className="text-xs text-slate-500 mt-1">Para demo, usa: password</p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium"
            >
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <p className="text-slate-400 text-center text-sm">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="text-sky-400 hover:text-sky-300 font-medium">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
