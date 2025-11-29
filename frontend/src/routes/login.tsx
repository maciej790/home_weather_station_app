// src/pages/Login.tsx
import React, { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { useAuth } from '@/context/AuthContext'






export const Route = createFileRoute('/login')({
    component: Login,
})

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ login: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!form.login || !form.password) {
            setError('Wypełnij wszystkie pola!');
            return;
        }

        try {
            await login(form.login, form.password);
            navigate({ to: '/' });
        } catch (err: any) {
            setError(err.response?.data?.error || 'Błąd logowania');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-md w-96 flex flex-col gap-3"
            >
                <h1 className="text-2xl font-bold mb-6">Logowanie</h1>

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
                    type="password"
                    name="password"
                    placeholder="Hasło"
                    value={form.password}
                    onChange={handleChange}
                    className="p-2 border rounded"
                />

                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-2"
                >
                    Zaloguj się
                </button>

                {/* 🔹 Przycisk do przejścia do rejestracji */}
                <p className="mt-4 text-sm text-gray-600 text-center">
                    Nie masz konta?{' '}
                    <span
                        className="text-blue-500 hover:underline cursor-pointer"
                        onClick={() => navigate({ to: '/register' })}
                    >
                        Zarejestruj się
                    </span>
                </p>
            </form>
        </div>
    );
}
