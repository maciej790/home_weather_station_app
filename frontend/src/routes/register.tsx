// src/routes/Register.tsx
import React, { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import axios from 'axios'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/register')({
  component: Register,
})

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth() // używamy login z AuthContext
  const [form, setForm] = useState({
    login: '',
    email: '',
    password: '',
    continent: '',
    country: '',
    locality: '',
    flat_name: '',
    activation_key: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Walidacja lokalna
    for (const key in form) {
      if (!form[key as keyof typeof form]) {
        setError('Wypełnij wszystkie pola!')
        setLoading(false)
        return
      }
    }

    try {
      // 1️⃣ Rejestracja
      await axios.post('http://localhost:3000/auth/register', form)

      // 2️⃣ Automatyczne logowanie po rejestracji
      await login(form.login, form.password)

      // 3️⃣ Przekierowanie na dashboard/root
      navigate({ to: '/' })
    } catch (err: any) {
      // Obsługa błędów z backendu
      if (err.response?.data?.error) {
        setError(err.response.data.error)
      } else if (err.message) {
        setError(err.message)
      } else {
        setError('Błąd rejestracji')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96 flex flex-col gap-3"
      >
        <h1 className="text-2xl font-bold mb-4">Rejestracja</h1>

        {error && <p className="text-red-500">{error}</p>}

        <input
          type="text"
          name="login"
          placeholder="Login"
          value={form.login}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Hasło"
          value={form.password}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="continent"
          placeholder="Kontynent"
          value={form.continent}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="country"
          placeholder="Kraj"
          value={form.country}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="locality"
          placeholder="Miasto / Lokalizacja"
          value={form.locality}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="flat_name"
          placeholder="Nazwa mieszkania"
          value={form.flat_name}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="activation_key"
          placeholder="Activation Key"
          value={form.activation_key}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <button
          type="submit"
          className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          disabled={loading}
        >
          {loading ? 'Rejestracja...' : 'Zarejestruj się'}
        </button>
      </form>
    </div>
  )
}
