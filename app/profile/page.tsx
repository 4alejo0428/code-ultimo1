"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const { user, loading, updateProfile } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    nacionalidad: "",
    genero: "",
  })
  const [saved, setSaved] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        email: user.email || "",
        telefono: user.telefono || "",
        direccion: user.direccion || "",
        nacionalidad: user.nacionalidad || "",
        genero: user.genero || "",
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setSaved(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updateProfile(formData)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsSubmitting(false)
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-card-foreground mb-2">Mi Perfil</h1>
            <p className="text-muted-foreground">Actualiza tu información personal</p>
          </div>

          {/* Success Message */}
          {saved && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 dark:text-green-400 flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Perfil actualizado exitosamente</span>
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-card-foreground mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                  required
                />
              </div>

              {/* Teléfono */}
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-card-foreground mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="+34 612 345 678"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                />
              </div>

              {/* Nacionalidad */}
              <div>
                <label htmlFor="nacionalidad" className="block text-sm font-medium text-card-foreground mb-2">
                  Nacionalidad
                </label>
                <input
                  type="text"
                  id="nacionalidad"
                  name="nacionalidad"
                  value={formData.nacionalidad}
                  onChange={handleChange}
                  placeholder="Española"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                />
              </div>

              {/* Género */}
              <div>
                <label htmlFor="genero" className="block text-sm font-medium text-card-foreground mb-2">
                  Género
                </label>
                <select
                  id="genero"
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                >
                  <option value="">Seleccionar</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            {/* Dirección */}
            <div>
              <label htmlFor="direccion" className="block text-sm font-medium text-card-foreground mb-2">
                Dirección
              </label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Calle Principal 123, Madrid"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-6 border-t border-border">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
                Cancelar
              </Button>
            </div>
          </form>

          {/* Account Info */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Información de la Cuenta</h2>
            <div className="space-y-3 text-sm">
              <p>
                <span className="text-muted-foreground">ID de Usuario:</span>{" "}
                <span className="font-mono text-card-foreground">{user.id}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Miembro desde:</span>{" "}
                <span className="text-card-foreground">{new Date(user.created_at).toLocaleDateString("es-ES")}</span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
