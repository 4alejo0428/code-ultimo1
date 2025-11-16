"use client"

import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function ReservationsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [reservations, setReservations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchReservations()
    }
  }, [user])

  const fetchReservations = async () => {
    try {
      const response = await fetch(`/api/reservations?userId=${user?.id}`)
      const data = await response.json()
      setReservations(data)
    } catch (error) {
      console.error("Error fetching reservations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelReservation = async (reservaId: number) => {
    if (!confirm("¿Estás seguro de que deseas cancelar esta reserva?")) return

    try {
      const response = await fetch(`/api/reservations?id=${reservaId}&action=cancel`, {
        method: "DELETE",
      })

      if (response.ok) {
        alert("Reserva cancelada exitosamente")
        fetchReservations()
      } else {
        alert("Error al cancelar la reserva")
      }
    } catch (error) {
      console.error("Error canceling reservation:", error)
      alert("Error al cancelar la reserva")
    }
  }

  const calculateDynamicStatus = (fechaInicio: string, fechaFin: string, estadoId: number) => {
    const now = new Date()
    const inicio = new Date(fechaInicio)
    const fin = new Date(fechaFin)

    if (estadoId === 5 || estadoId === 4) {
      return estadoId === 5 ? "cancelada" : "completada"
    }

    if (now >= fin) {
      return "completada"
    }

    if (now >= inicio) {
      return "activo"
    }

    return "pendiente"
  }

  const getDaysElapsed = (fechaInicio: string, fechaFin: string) => {
    const now = new Date()
    const inicio = new Date(fechaInicio)
    const fin = new Date(fechaFin)

    if (now < inicio) {
      const daysUntilPickup = Math.ceil((inicio.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return `Inicio en ${daysUntilPickup} día${daysUntilPickup !== 1 ? "s" : ""}`
    }

    if (now >= inicio && now < fin) {
      const daysActive = Math.floor((now.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))
      return `Día ${daysActive + 1} de ${Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))}`
    }

    if (now >= fin) {
      const daysSinceReturn = Math.floor((now.getTime() - fin.getTime()) / (1000 * 60 * 60 * 24))
      return `Finalizado hace ${daysSinceReturn} día${daysSinceReturn !== 1 ? "s" : ""}`
    }

    return ""
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "activo":
        return "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400"
      case "completada":
        return "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400"
      case "pendiente":
        return "bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400"
      case "cancelada":
        return "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400"
      default:
        return "bg-slate-500/10 border-slate-500/20 text-slate-700 dark:text-slate-400"
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      activo: "Activo",
      completada: "Completada",
      pendiente: "Pendiente",
      cancelada: "Cancelada",
    }
    return labels[status] || status
  }

  const getReservationVehicleImage = (brand: string, model: string) => {
    const images: Record<string, string> = {
      "Toyota-Corolla": `/placeholder.svg?height=192&width=400&query=Toyota Corolla sedan 2024 blue`,
      "Honda-Civic": `/placeholder.svg?height=192&width=400&query=Honda Civic sedan 2023 red`,
      "Ford-Escape": `/placeholder.svg?height=192&width=400&query=Ford Escape SUV 2024 silver`,
      "BMW-X5": `/placeholder.svg?height=192&width=400&query=BMW X5 luxury SUV 2024 black`,
      "Hyundai-i10": `/placeholder.svg?height=192&width=400&query=Hyundai i10 city car 2024 white`,
    }
    return images[`${brand}-${model}`] || `/placeholder.svg?height=192&width=400&query=car vehicle`
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

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard")}
              >
                ← Volver
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-card-foreground mb-2">Mis Reservas</h1>
                <p className="text-muted-foreground">Consulta todas tus reservas y su estado</p>
              </div>
            </div>
            <Button
              onClick={() => router.push("/vehicles")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Nueva Reserva
            </Button>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin">
                <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full"></div>
              </div>
            </div>
          ) : reservations.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <svg
                className="w-12 h-12 text-muted-foreground mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">No tienes reservas</h3>
              <p className="text-muted-foreground mb-6">
                Aún no has hecho ninguna reserva. Explora nuestro catálogo de vehículos.
              </p>
              <Button
                onClick={() => router.push("/vehicles")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Ver Vehículos Disponibles
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {reservations.map((reserva) => {
                const dynamicStatus = calculateDynamicStatus(
                  reserva.fecha_inicio,
                  reserva.fecha_fin,
                  reserva.estado_id,
                )
                const elapsedInfo = getDaysElapsed(reserva.fecha_inicio, reserva.fecha_fin)

                return (
                  <div
                    key={reserva.id}
                    className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition"
                  >
                    {/* Collapsed View */}
                    <div className="p-6">
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {/* Reservation Info */}
                        <div>
                          <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
                            <img
                              src={
                                reserva.vehiculo_imagen_url || 
                                `/placeholder.svg?height=192&width=400&query=${reserva.vehiculo_marca} ${reserva.vehiculo_modelo}`
                              }
                              alt={`${reserva.vehiculo_marca} ${reserva.vehiculo_modelo}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h3 className="text-lg font-semibold text-card-foreground mb-4">Reserva #{reserva.id}</h3>
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-muted-foreground">Vehículo</p>
                              <p className="font-medium text-card-foreground">
                                {reserva.vehiculo_marca} {reserva.vehiculo_modelo}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Progreso</p>
                              <p className="font-medium text-card-foreground">{elapsedInfo}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Fechas</p>
                              <p className="font-medium text-card-foreground">
                                {new Date(reserva.fecha_inicio).toLocaleDateString()} - {new Date(reserva.fecha_fin).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Cost & Status */}
                        <div className="space-y-4">
                          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                            <p className="text-sm text-muted-foreground mb-1">Costo Total</p>
                            <p className="text-3xl font-bold text-primary">${Number(reserva.total).toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Estado</p>
                            <div
                              className={`inline-block px-3 py-1 rounded-lg border text-sm font-medium ${getStatusColor(dynamicStatus)}`}
                            >
                              {getStatusLabel(dynamicStatus)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-6 border-t border-border">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setExpandedId(expandedId === reserva.id ? null : reserva.id)}
                        >
                          {expandedId === reserva.id ? "Ocultar Detalles" : "Ver Detalles"}
                        </Button>
                        {reserva.estado_id === 1 && (
                          <Button variant="destructive" size="sm" onClick={() => handleCancelReservation(reserva.id)}>
                            Cancelar Reserva
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedId === reserva.id && (
                      <div className="border-t border-border bg-slate-50 dark:bg-slate-800/50 p-6 space-y-4">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-card-foreground mb-3">Información de la Reserva</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <p className="text-muted-foreground">ID Reserva</p>
                                <p className="font-medium text-card-foreground">{reserva.id}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Estado</p>
                                <p className="font-medium text-card-foreground">{reserva.estado_nombre || 'Pendiente'}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Creada</p>
                                <p className="font-medium text-card-foreground">
                                  {new Date(reserva.creado_en).toLocaleDateString("es-ES")}
                                </p>
                              </div>
                              {reserva.notas && (
                                <div>
                                  <p className="text-muted-foreground">Notas</p>
                                  <p className="font-medium text-card-foreground">{reserva.notas}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-card-foreground mb-3">Fechas de la Reserva</h4>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Fecha de Inicio</p>
                                <p className="font-medium text-card-foreground">
                                  {new Date(reserva.fecha_inicio).toLocaleDateString("es-ES")}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Fecha de Fin</p>
                                <p className="font-medium text-card-foreground">
                                  {new Date(reserva.fecha_fin).toLocaleDateString("es-ES")}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border">
                          <div>
                            <h4 className="font-semibold text-card-foreground mb-3">Vehículo</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <p className="text-muted-foreground">Marca y Modelo</p>
                                <p className="font-medium text-card-foreground">
                                  {reserva.vehiculo_marca} {reserva.vehiculo_modelo}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Precio por día</p>
                                <p className="font-medium text-card-foreground">
                                  ${Number(reserva.precio_por_dia).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-card-foreground mb-3">Precio</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <p className="text-muted-foreground">Costo Total:</p>
                                <p className="font-semibold text-primary">${Number(reserva.total).toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
