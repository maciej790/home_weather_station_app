// src/pages/Register.tsx
import React, { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

export const Route = createFileRoute('/register')({
  component: Register,
});

const CONTINENTS: Record<string, Array<string>> = {
  Europe: ['Poland', 'Germany', 'France', 'Italy'],
  Asia: ['China', 'Japan', 'India', 'South Korea'],
  Africa: ['Egypt', 'Nigeria', 'South Africa'],
  America: ['USA', 'Canada', 'Brazil', 'Mexico'],
  Oceania: ['Australia', 'New Zealand'],
};

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    login: '',
    email: '',
    password: '',
    continent: '',
    country: '',
    locality: '',
    flat_name: '',
    activation_key: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    for (const key in form) {
      if (!form[key as keyof typeof form]) {
        setError('Wypełnij wszystkie pola!');
        setLoading(false);
        return;
      }
    }

    try {
      await axios.post('http://localhost:3000/auth/register', form);
      await login(form.login, form.password);
      navigate({ to: '/' });
    } catch (err: any) {
      if (err.response?.data) {
        setError(typeof err.response.data === 'string' ? err.response.data : err.response.data.error ?? 'Błąd serwera');
      } else {
        setError(err.message ?? 'Błąd rejestracji');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-400 to-purple-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-xl w-96 flex flex-col gap-5"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800">Sign up</h1>
        <p className="text-center text-gray-500">Fill the form to create an account</p>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input type="text" name="login" placeholder="Login" value={form.login} onChange={handleChange} className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
        <input type="password" name="password" placeholder="Hasło" value={form.password} onChange={handleChange} className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />

        <select name="continent" value={form.continent} onChange={handleChange} className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition">
          <option value="">Choose continent</option>
          {Object.keys(CONTINENTS).map(cont => (
            <option key={cont} value={cont}>{cont}</option>
          ))}
        </select>

        <select name="country" value={form.country} onChange={handleChange} className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" disabled={!form.continent}>
          <option value="">Choose country</option>
          {form.continent && CONTINENTS[form.continent].map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>

        <input type="text" name="locality" placeholder="City / localization" value={form.locality} onChange={handleChange} className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
        <input type="text" name="flat_name" placeholder="Flat name" value={form.flat_name} onChange={handleChange} className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
        <input type="text" name="activation_key" placeholder="Activation Key" value={form.activation_key} onChange={handleChange} className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />

        <button
          type="submit"
          className={`bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Rejestracja...' : 'Sign up'}
        </button>
      </form>
    </div>
  );
}
