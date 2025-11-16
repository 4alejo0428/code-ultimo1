"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import type { Vehicle } from "@/lib/types"
import { Button } from "@/components/ui/button"

// Function to get vehicle image based on brand and model
const getVehicleImage = (brand: string, model: string) => {
  const images: Record<string, string> = {
    "Toyota-Corolla": `/placeholder.svg?height=192&width=400&query=Toyota Corolla sedan 2024 blue`,
    "Honda-Civic": `/placeholder.svg?height=192&width=400&query=Honda Civic sedan 2023 red`,
    "Ford-Escape": `/placeholder.svg?height=192&width=400&query=Ford Escape SUV 2024 silver`,
    "BMW-X5": `/placeholder.svg?height=192&width=400&query=BMW X5 luxury SUV 2024 black`,
    "Hyundai-i10": `/placeholder.svg?height=192&width=400&query=Hyundai i10 city car 2024 white`,
  }
  return images[`${brand}-${model}`] || `/placeholder.svg?height=192&width=400&query=car vehicle`
}

export default function VehiclesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [formData, setFormData] = useState({
    fecha_recogida: "",
    fecha_devolucion: "",
  })
  const [estimatedCost, setEstimatedCost] = useState(0)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/vehicles?disponible=true")
      const data = await response.json()
      setVehicles(data)
    } catch (error) {
      console.error("Error fetching vehicles:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newFormData = { ...formData, [name]: value }
    setFormData(newFormData)

    if (newFormData.fecha_recogida && newFormData.fecha_devolucion && selectedVehicle) {
      const vehicle = vehicles.find((v) => v.id === selectedVehicle)
      if (vehicle) {
        const cost = calculateCost(
          vehicle.precio_por_dia,
          newFormData.fecha_recogida,
          newFormData.fecha_devolucion,
        )
        setEstimatedCost(cost)
      }
    }
  }

  const calculateCost = (dailyPrice: number, checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return dailyPrice
    const days = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    return dailyPrice * Math.max(days, 1)
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedVehicle || !user) return

    const vehicle = vehicles.find((v) => v.id === selectedVehicle)
    if (!vehicle) return

    const costo_total =
      estimatedCost ||
      calculateCost(vehicle.precio_por_dia, formData.fecha_recogida, formData.fecha_devolucion)

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          vehicle_id: vehicle.id,
          fecha_inicio: formData.fecha_recogida,
          fecha_fin: formData.fecha_devolucion,
          total: costo_total,
          notas: "",
        }),
      })

      if (response.ok) {
        alert("Reserva creada exitosamente")
        setShowBookingForm(false)
        setSelectedVehicle(null)
        setFormData({ fecha_recogida: "", fecha_devolucion: "" })
        setEstimatedCost(0)
        router.push("/reservations")
      }
    } catch (error) {
      console.error("Error creating reservation:", error)
      alert("Error al crear la reserva")
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

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard")}
            >
              ← Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-card-foreground">Nuestros Vehículos</h1>
              <p className="text-muted-foreground">Selecciona el vehículo perfecto para tu próximo viaje</p>
            </div>
          </div>

          {/* Vehicles Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin">
                <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full"></div>
              </div>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <p className="text-muted-foreground">No hay vehículos disponibles en este momento.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition"
                >
                  {/* Vehicle Image Placeholder */}
                  <div className="w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center overflow-hidden">
                    <img
                      src={vehicle.imagen_url || `/placeholder.svg?height=192&width=400&query=${vehicle.marca} ${vehicle.modelo}`}
                      alt={`${vehicle.marca} ${vehicle.modelo}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Vehicle Details */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-card-foreground">
                        {vehicle.marca} {vehicle.modelo}
                      </h3>
                      <p className="text-sm text-muted-foreground">{vehicle.year}</p>
                    </div>

                    {vehicle.descripcion && <p className="text-sm text-muted-foreground">{vehicle.descripcion}</p>}

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-3 py-3 border-y border-border">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12a3 3 0 100-6 3 3 0 000 6zm0 1a4 4 0 100-8 4 4 0 000 8zm0-1a3 3 0 100-6 3 3 0 000 6z" />
                        </svg>
                        <span className="text-xs text-muted-foreground">Disponible</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.5 1.5H3a1.5 1.5 0 0 0-1.5 1.5v14a1.5 1.5 0 0 0 1.5 1.5h14a1.5 1.5 0 0 0 1.5-1.5V9.5" />
                        </svg>
                        <span className="text-xs text-muted-foreground">{vehicle.transmision}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-primary">
                        ${vehicle.precio_por_dia}
                      </span>
                      <span className="text-sm text-muted-foreground">/día</span>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => {
                        setSelectedVehicle(vehicle.id)
                        setShowBookingForm(true)
                        setEstimatedCost(Number(vehicle.precio_por_dia))
                      }}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
                    >
                      Reservar Ahora
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showBookingForm && selectedVehicle && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border-2 border-primary rounded-xl max-w-md w-full my-8 p-8 space-y-6 shadow-2xl relative">
              <button
                type="button"
                onClick={() => {
                  setShowBookingForm(false)
                  setSelectedVehicle(null)
                  setEstimatedCost(0)
                }}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition"
              >
                ✕
              </button>

              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Reserva tu Vehículo</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {vehicles.find((v) => v.id === selectedVehicle)?.marca}{" "}
                  {vehicles.find((v) => v.id === selectedVehicle)?.modelo}
                </p>
              </div>

              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Fecha de Recogida
                  </label>
                  <input
                    type="datetime-local"
                    name="fecha_recogida"
                    value={formData.fecha_recogida}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Fecha de Devolución
                  </label>
                  <input
                    type="datetime-local"
                    name="fecha_devolucion"
                    value={formData.fecha_devolucion}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    required
                  />
                </div>

                {formData.fecha_recogida && formData.fecha_devolucion && (
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border-2 border-primary/30">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Costo Estimado</p>
                    <p className="text-3xl font-bold text-primary">${estimatedCost.toFixed(2)}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition"
                  >
                    Confirmar Reserva
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="px-6 py-3 font-semibold rounded-lg transition bg-transparent"
                    onClick={() => {
                      setShowBookingForm(false)
                      setSelectedVehicle(null)
                      setEstimatedCost(0)
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
