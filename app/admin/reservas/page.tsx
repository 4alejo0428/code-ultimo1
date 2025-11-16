"use client"

import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Reserva {
  id: number
  usuario_id: number
  vehiculo_id: number
  fecha_inicio: string
  fecha_fin: string
  total: number
  estado_id: number
  notas?: string
  creado_en: string
}

const estadosReserva: { [key: number]: { label: string; color: string } } = {
  1: { label: "Pendiente", color: "bg-yellow-500/10 text-yellow-600" },
  2: { label: "Confirmada", color: "bg-green-500/10 text-green-600" },
  3: { label: "En Progreso", color: "bg-blue-500/10 text-blue-600" },
  4: { label: "Completada", color: "bg-gray-500/10 text-gray-600" },
  5: { label: "Cancelada", color: "bg-red-500/10 text-red-600" },
}

export default function AdminReservasPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [reservas, setReservas] = useState<Reserva[]>([])

  useEffect(() => {
    if (!loading && (!user || user.rol !== 1)) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.rol === 1) {
      fetchReservas()
    }
  }, [user])

  const fetchReservas = async () => {
    try {
      const response = await fetch("/api/reservations")
      const data = await response.json()
      setReservas(data)
    } catch (error) {
      console.error("Error fetching reservations:", error)
    }
  }

  const handleChangeStatus = async (reservaId: number, nuevoEstado: number) => {
    try {
      await fetch("/api/reservations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reservaId, estado_id: nuevoEstado }),
      })
      fetchReservas()
    } catch (error) {
      console.error("Error updating reservation:", error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta reserva permanentemente?")) return

    try {
      await fetch(`/api/reservations?id=${id}&action=delete`, { method: "DELETE" })
      fetchReservas()
    } catch (error) {
      console.error("Error deleting reservation:", error)
    }
  }

  if (loading || !user || user.rol !== 1) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/admin")}
              >
                ← Volver
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Gestión de Reservas</h1>
                <p className="text-muted-foreground">Administra todas las reservas del sistema</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {reservas.map((reserva) => {
              const estado = estadosReserva[reserva.estado_id] || {
                label: "Desconocido",
                color: "bg-gray-500/10 text-gray-600",
              }
              return (
                <Card key={reserva.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">Reserva #{reserva.id}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${estado.color}`}>{estado.label}</span>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Usuario ID: {reserva.usuario_id}</p>
                        <p>Vehículo ID: {reserva.vehiculo_id}</p>
                        <p>
                          Fechas: {new Date(reserva.fecha_inicio).toLocaleDateString()} -{" "}
                          {new Date(reserva.fecha_fin).toLocaleDateString()}
                        </p>
                        <p className="font-semibold text-primary">Total: ${reserva.total}</p>
                        {reserva.notas && <p>Notas: {reserva.notas}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={reserva.estado_id}
                        onChange={(e) => handleChangeStatus(reserva.id, Number(e.target.value))}
                        className="px-3 py-1 border rounded text-sm"
                      >
                        <option value={1}>Pendiente</option>
                        <option value={2}>Confirmada</option>
                        <option value={3}>En Progreso</option>
                        <option value={4}>Completada</option>
                        <option value={5}>Cancelada</option>
                      </select>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(reserva.id)}>
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
