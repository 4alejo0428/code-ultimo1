"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    direccion: "",
    nacionalidad: "",
    genero: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validations
    if (!formData.nombre || !formData.email || !formData.password) {
      setError("Por favor completa los campos requeridos")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setLoading(true)

    try {
      await signup({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        telefono: formData.telefono,
        direccion: formData.direccion,
        nacionalidad: formData.nacionalidad,
        genero: formData.genero ? Number.parseInt(formData.genero) : 0,
      })
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Error al registrarse. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 backdrop-blur">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M10.5 1.5H3a1.5 1.5 0 0 0-1.5 1.5v14a1.5 1.5 0 0 0 1.5 1.5h14a1.5 1.5 0 0 0 1.5-1.5V9.5M10.5 1.5v8m0 0H2.5m8 0h8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">CarRental</h1>
            <p className="text-slate-400 text-sm mt-2">Crear nueva cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Nombre completo *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Contraseña *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Al menos 6 caracteres"
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Confirmar contraseña *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="3XX XXXX XXXX"
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Dirección</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Tu dirección"
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Género</label>
                <select
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:outline-none transition"
                >
                  <option value="">Seleccionar</option>
                  <option value="1">Masculino</option>
                  <option value="2">Femenino</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nacionalidad</label>
                <input
                  type="text"
                  name="nacionalidad"
                  value={formData.nacionalidad}
                  onChange={handleChange}
                  placeholder="Tu país"
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none transition"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium"
            >
              {loading ? "Registrando..." : "Crear Cuenta"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <p className="text-slate-400 text-center text-sm">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-sky-400 hover:text-sky-300 font-medium">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
