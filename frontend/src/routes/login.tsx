// src/pages/Login.tsx
import React, { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';

export const Route = createFileRoute('/login')({
    component: Login,
});

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-400 to-purple-500">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-10 rounded-2xl shadow-xl w-96 flex flex-col gap-6"
            >
                <h1 className="text-3xl font-bold text-center text-gray-800">Sign in</h1>
                <p className="text-center text-gray-500">Type your login and password</p>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <input
                    type="text"
                    name="login"
                    placeholder="Login"
                    value={form.login}
                    onChange={handleChange}
                    className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Hasło"
                    value={form.password}
                    onChange={handleChange}
                    className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />

                <button
                    type="submit"
                    className="bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                    Sign in
                </button>

                <p className="text-sm text-gray-600 text-center mt-4">
                    If You don't have an account click here{' '}
                    <span
                        className="text-blue-500 hover:underline cursor-pointer"
                        onClick={() => navigate({ to: '/register' })}
                    >
                        Sign up
                    </span>
                </p>
            </form>
        </div>
    );
}
