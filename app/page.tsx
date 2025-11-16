"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-sky-400 rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
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
            <span className="font-bold text-lg text-white">CarRental</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/register">
              <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800 bg-transparent">
                Regístrate
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-sky-500 hover:bg-sky-600">Inicia Sesión</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-20 md:py-32">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white text-balance">Alquila el Vehículo Perfecto</h1>
            <p className="text-lg md:text-xl text-slate-300 text-balance max-w-2xl mx-auto">
              Acceso a una amplia flota de vehículos de confianza. Precios competitivos y servicio de calidad para tu
              próximo viaje.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/register">
                <Button size="lg" className="bg-sky-500 hover:bg-sky-600 w-full sm:w-auto">
                  Comenzar Ahora
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-800 w-full sm:w-auto bg-transparent"
                >
                  Conocer Más
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 backdrop-blur">
            <div className="w-12 h-12 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Reserva Rápida</h3>
            <p className="text-slate-400">Reserva tu vehículo en minutos con nuestro proceso simple y directo.</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 backdrop-blur">
            <div className="w-12 h-12 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Vehículos Verificados</h3>
            <p className="text-slate-400">Toda nuestra flota está verificada y en perfecto estado de funcionamiento.</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 backdrop-blur">
            <div className="w-12 h-12 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Soporte 24/7</h3>
            <p className="text-slate-400">Nuestro equipo está disponible para ayudarte en cualquier momento.</p>
          </div>
        </section>
      </main>
    </div>
  )
}
