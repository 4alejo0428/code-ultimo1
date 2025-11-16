"use client"

import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Usuario {
  id: number
  nombre: string
  email: string
  telefono?: string
  direccion?: string
  nacionalidad?: string
  rol: number
  activo: boolean
  creado_en: string
}

export default function AdminUsuariosPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
    direccion: "",
    nacionalidad: "",
    rol: 2,
  })

  useEffect(() => {
    if (!loading && (!user || user.rol !== 1)) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.rol === 1) {
      fetchUsuarios()
    }
  }, [user])

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("/api/users")
      const data = await response.json()
      setUsuarios(data)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsAddDialogOpen(false)
        setFormData({ nombre: "", email: "", password: "", telefono: "", direccion: "", nacionalidad: "", rol: 2 })
        fetchUsuarios()
      }
    } catch (error) {
      console.error("Error adding user:", error)
    }
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return

    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedUser.id,
          nombre: formData.nombre,
          telefono: formData.telefono,
          direccion: formData.direccion,
          nacionalidad: formData.nacionalidad,
          rol: formData.rol,
        }),
      })

      if (response.ok) {
        setIsEditDialogOpen(false)
        setSelectedUser(null)
        fetchUsuarios()
      }
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  const handleToggleActive = async (userId: number, currentStatus: boolean) => {
    try {
      await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, activo: !currentStatus }),
      })
      fetchUsuarios()
    } catch (error) {
      console.error("Error toggling user status:", error)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return

    try {
      await fetch(`/api/users?id=${userId}`, { method: "DELETE" })
      fetchUsuarios()
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const openEditDialog = (usuario: Usuario) => {
    setSelectedUser(usuario)
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      password: "",
      telefono: usuario.telefono || "",
      direccion: usuario.direccion || "",
      nacionalidad: usuario.nacionalidad || "",
      rol: usuario.rol,
    })
    setIsEditDialogOpen(true)
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
                <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
                <p className="text-muted-foreground">Administra los usuarios del sistema</p>
              </div>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>Añadir Usuario</Button>
          </div>
          {/* </CHANGE> */}

          <div className="grid gap-4">
            {usuarios.map((usuario) => (
              <Card key={usuario.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{usuario.nombre}</h3>
                      {usuario.rol === 1 && (
                        <span className="px-2 py-1 text-xs bg-purple-500/10 text-purple-600 rounded-full">
                          Administrador
                        </span>
                      )}
                      {!usuario.activo && (
                        <span className="px-2 py-1 text-xs bg-red-500/10 text-red-600 rounded-full">Inactivo</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{usuario.email}</p>
                    {usuario.telefono && <p className="text-sm text-muted-foreground">Tel: {usuario.telefono}</p>}
                    {usuario.direccion && (
                      <p className="text-sm text-muted-foreground">Dir: {usuario.direccion}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(usuario)}>
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(usuario.id, usuario.activo)}
                    >
                      {usuario.activo ? "Desactivar" : "Activar"}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(usuario.id)}>
                      Eliminar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle>Añadir Usuario</DialogTitle>
            <DialogDescription>Crea un nuevo usuario en el sistema</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="rol">Rol</Label>
              <select
                id="rol"
                value={formData.rol}
                onChange={(e) => setFormData({ ...formData, rol: Number(e.target.value) })}
                className="w-full p-2 border rounded"
              >
                <option value={1}>Administrador</option>
                <option value={2}>Usuario</option>
              </select>
            </div>
            <Button type="submit" className="w-full">
              Crear Usuario
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>Modifica la información del usuario</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div>
              <Label htmlFor="edit-nombre">Nombre</Label>
              <Input
                id="edit-nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-telefono">Teléfono</Label>
              <Input
                id="edit-telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-direccion">Dirección</Label>
              <Input
                id="edit-direccion"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-rol">Rol</Label>
              <select
                id="edit-rol"
                value={formData.rol}
                onChange={(e) => setFormData({ ...formData, rol: Number(e.target.value) })}
                className="w-full p-2 border rounded"
              >
                <option value={1}>Administrador</option>
                <option value={2}>Usuario</option>
              </select>
            </div>
            <Button type="submit" className="w-full">
              Guardar Cambios
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
