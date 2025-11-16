"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Navbar() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M10.5 1.5H3a1.5 1.5 0 0 0-1.5 1.5v14a1.5 1.5 0 0 0 1.5 1.5h14a1.5 1.5 0 0 0 1.5-1.5V9.5M10.5 1.5v8m0 0H2.5m8 0h8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">CarRental</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link
                  href="/vehicles"
                  className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition"
                >
                  Vehículos
                </Link>
                <Link
                  href="/reservations"
                  className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition"
                >
                  Mis Reservas
                </Link>
                <Link
                  href="/profile"
                  className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition"
                >
                  Perfil
                </Link>
                {user.rol === 1 && (
                  <Link
                    href="/admin"
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium transition"
                  >
                    Panel Admin
                  </Link>
                )}
                <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-700">
                  <span className="text-sm text-slate-600 dark:text-slate-300">{user.nombre}</span>
                  <Button size="sm" variant="outline" onClick={logout}>
                    Salir
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="sm">Registrarse</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {user ? (
              <>
                <Link
                  href="/vehicles"
                  className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded"
                >
                  Vehículos
                </Link>
                <Link
                  href="/reservations"
                  className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded"
                >
                  Mis Reservas
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded"
                >
                  Perfil
                </Link>
                {user.rol === 1 && (
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded"
                  >
                    Panel Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded"
                >
                  Iniciar Sesión
                </Link>
                <Link href="/login" className="block px-4 py-2 text-sm bg-sky-500 text-white hover:bg-sky-600 rounded">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
