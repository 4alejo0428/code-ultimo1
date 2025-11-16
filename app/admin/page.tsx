"use client"

import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVehicles: 0,
    totalReservations: 0,
    activeReservations: 0,
  })

  useEffect(() => {
    if (!loading && (!user || user.rol !== 1)) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.rol === 1) {
      fetchStats()
    }
  }, [user])

  const fetchStats = async () => {
    try {
      const [usersRes, vehiclesRes, reservationsRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/vehicles"),
        fetch("/api/reservations"),
      ])

      const users = await usersRes.json()
      const vehicles = await vehiclesRes.json()
      const reservations = await reservationsRes.json()

      setStats({
        totalUsers: users.length,
        totalVehicles: vehicles.length,
        totalReservations: reservations.length,
        activeReservations: reservations.filter((r: any) => r.estado_id === 1 || r.estado_id === 2).length,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full"></div>
        </div>
      </div>
    )
  }

  if (!user || user.rol !== 1) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-8 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Panel de Administración</h1>
            <p className="text-purple-100">Gestiona usuarios, vehículos y reservas del sistema</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vehículos</CardTitle>
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalVehicles}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalReservations}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reservas Activas</CardTitle>
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeReservations}</div>
              </CardContent>
            </Card>
          </div>

          {/* Management Links */}
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/admin/usuarios">
              <Card className="hover:border-purple-500 transition cursor-pointer h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <CardTitle>Gestionar Usuarios</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Ver, editar y gestionar usuarios del sistema</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/vehiculos">
              <Card className="hover:border-purple-500 transition cursor-pointer h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <CardTitle>Gestionar Vehículos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Añadir, editar y eliminar vehículos de la flota</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/reservas">
              <Card className="hover:border-purple-500 transition cursor-pointer h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <CardTitle>Gestionar Reservas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Ver y gestionar todas las reservas del sistema</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
