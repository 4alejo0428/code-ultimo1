"use client"

import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-xl p-8 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Bienvenido, {user.nombre}</h1>
            <p className="text-sky-100">Gestiona tus reservas y explora nuestra flota de vehículos</p>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/vehicles">
              <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition cursor-pointer h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">Ver Vehículos</h3>
                <p className="text-muted-foreground">Explora nuestra flota y reserva tu vehículo</p>
              </div>
            </Link>

            <Link href="/reservations">
              <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition cursor-pointer h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">Mis Reservas</h3>
                <p className="text-muted-foreground">Consulta el estado de tus reservas</p>
              </div>
            </Link>

            <Link href="/profile">
              <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition cursor-pointer h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">Mi Perfil</h3>
                <p className="text-muted-foreground">Actualiza tu información personal</p>
              </div>
            </Link>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Información de Contacto</h3>
              <div className="space-y-3 text-sm">
                <p>
                  <span className="text-muted-foreground">Email:</span> {user.email}
                </p>
                {user.telefono && (
                  <p>
                    <span className="text-muted-foreground">Teléfono:</span> {user.telefono}
                  </p>
                )}
                {user.direccion && (
                  <p>
                    <span className="text-muted-foreground">Dirección:</span> {user.direccion}
                  </p>
                )}
              </div>
              <Link href="/profile" className="mt-4 inline-block">
                <Button size="sm" variant="outline">
                  Editar Información
                </Button>
              </Link>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Ofertas Especiales</h3>
              <div className="space-y-3">
                <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                  <p className="font-semibold text-accent-foreground">Código: BIENVENIDA20</p>
                  <p className="text-sm text-muted-foreground">Descuento del 20% en tu primera reserva</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
