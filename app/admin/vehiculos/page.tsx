"use client"

import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Vehiculo {
  id: number
  marca: string
  modelo: string
  anio: number
  color: string
  placa: string
  precio_por_dia: number
  disponible: boolean
  capacidad: number
  transmision: string
  combustible: string
  descripcion?: string
  imagen_url?: string
  categoria_id: number
}

export default function AdminVehiculosPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehiculo | null>(null)
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    anio: new Date().getFullYear(),
    color: "",
    placa: "",
    precio_por_dia: 0,
    disponible: true,
    capacidad: 5,
    transmision: "Manual",
    combustible: "Gasolina",
    descripcion: "",
    imagen_url: "",
    categoria_id: 1,
  })

  useEffect(() => {
    if (!loading && (!user || user.rol !== 1)) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.rol === 1) {
      fetchVehiculos()
    }
  }, [user])

  const fetchVehiculos = async () => {
    try {
      const response = await fetch("/api/vehicles")
      const data = await response.json()
      setVehiculos(data)
    } catch (error) {
      console.error("Error fetching vehicles:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingVehicle ? "/api/vehicles" : "/api/vehicles"
      const method = editingVehicle ? "PUT" : "POST"
      const body = editingVehicle ? { id: editingVehicle.id, ...formData } : formData

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        setIsDialogOpen(false)
        setEditingVehicle(null)
        resetForm()
        fetchVehiculos()
      }
    } catch (error) {
      console.error("Error saving vehicle:", error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este vehículo?")) return

    try {
      await fetch(`/api/vehicles?id=${id}`, { method: "DELETE" })
      fetchVehiculos()
    } catch (error) {
      console.error("Error deleting vehicle:", error)
    }
  }

  const openEditDialog = (vehiculo: Vehiculo) => {
    setEditingVehicle(vehiculo)
    setFormData({
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      anio: vehiculo.anio,
      color: vehiculo.color,
      placa: vehiculo.placa,
      precio_por_dia: vehiculo.precio_por_dia,
      disponible: vehiculo.disponible,
      capacidad: vehiculo.capacidad,
      transmision: vehiculo.transmision,
      combustible: vehiculo.combustible,
      descripcion: vehiculo.descripcion || "",
      imagen_url: vehiculo.imagen_url || "",
      categoria_id: vehiculo.categoria_id,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      marca: "",
      modelo: "",
      anio: new Date().getFullYear(),
      color: "",
      placa: "",
      precio_por_dia: 0,
      disponible: true,
      capacidad: 5,
      transmision: "Manual",
      combustible: "Gasolina",
      descripcion: "",
      imagen_url: "",
      categoria_id: 1,
    })
  }

  const openAddDialog = () => {
    resetForm()
    setEditingVehicle(null)
    setIsDialogOpen(true)
  }

  if (loading || !user || user.rol !== 1) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/admin")}
              >
                ← Volver
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Gestión de Vehículos</h1>
                <p className="text-muted-foreground">Administra la flota de vehículos</p>
              </div>
            </div>
            <Button onClick={openAddDialog}>Añadir Vehículo</Button>
          </div>
          {/* </CHANGE> */}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehiculos.map((vehiculo) => (
              <Card key={vehiculo.id} className="overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  {vehiculo.imagen_url ? (
                    <img src={vehiculo.imagen_url || "/placeholder.svg"} alt={`${vehiculo.marca} ${vehiculo.modelo}`} className="object-cover w-full h-full" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">Sin imagen</div>
                  )}
                  {!vehiculo.disponible && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded">
                      No disponible
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {vehiculo.marca} {vehiculo.modelo}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {vehiculo.anio} | {vehiculo.color} | {vehiculo.placa}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{vehiculo.capacidad} personas</span>
                    <span>{vehiculo.transmision}</span>
                    <span>{vehiculo.combustible}</span>
                  </div>
                  <p className="text-xl font-bold text-primary">${vehiculo.precio_por_dia}/día</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(vehiculo)} className="flex-1">
                      Editar
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(vehiculo.id)} className="flex-1">
                      Eliminar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Add/Edit Vehicle Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto bg-background">
          <DialogHeader>
            <DialogTitle>{editingVehicle ? "Editar Vehículo" : "Añadir Vehículo"}</DialogTitle>
            <DialogDescription>
              {editingVehicle ? "Modifica los datos del vehículo" : "Añade un nuevo vehículo a la flota"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="marca">Marca</Label>
                <Input
                  id="marca"
                  value={formData.marca}
                  onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="modelo">Modelo</Label>
                <Input
                  id="modelo"
                  value={formData.modelo}
                  onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="anio">Año</Label>
                <Input
                  id="anio"
                  type="number"
                  value={formData.anio}
                  onChange={(e) => setFormData({ ...formData, anio: Number(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="placa">Placa</Label>
                <Input
                  id="placa"
                  value={formData.placa}
                  onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="precio">Precio por día</Label>
                <Input
                  id="precio"
                  type="number"
                  value={formData.precio_por_dia}
                  onChange={(e) => setFormData({ ...formData, precio_por_dia: Number(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="capacidad">Capacidad</Label>
                <Input
                  id="capacidad"
                  type="number"
                  value={formData.capacidad}
                  onChange={(e) => setFormData({ ...formData, capacidad: Number(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="transmision">Transmisión</Label>
                <select
                  id="transmision"
                  value={formData.transmision}
                  onChange={(e) => setFormData({ ...formData, transmision: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automática">Automática</option>
                </select>
              </div>
              <div>
                <Label htmlFor="combustible">Combustible</Label>
                <select
                  id="combustible"
                  value={formData.combustible}
                  onChange={(e) => setFormData({ ...formData, combustible: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="Gasolina">Gasolina</option>
                  <option value="Diésel">Diésel</option>
                  <option value="Eléctrico">Eléctrico</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="imagen_url">URL de Imagen</Label>
              <Input
                id="imagen_url"
                value={formData.imagen_url}
                onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="disponible"
                checked={formData.disponible}
                onChange={(e) => setFormData({ ...formData, disponible: e.target.checked })}
              />
              <Label htmlFor="disponible">Disponible para renta</Label>
            </div>
            <Button type="submit" className="w-full">
              {editingVehicle ? "Guardar Cambios" : "Crear Vehículo"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
