// src/pages/Settings.tsx
import React, { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export const Route = createFileRoute('/settings')({
    component: () => (
        <ProtectedRoute>
            <Settings />
        </ProtectedRoute>
    ),
});

const CONTINENTS: Record<string, Array<string>> = {
    Europe: ['Poland', 'Germany', 'France', 'Italy'],
    Asia: ['China', 'Japan', 'India', 'South Korea'],
    Africa: ['Egypt', 'Nigeria', 'South Africa'],
    America: ['USA', 'Canada', 'Brazil', 'Mexico'],
    Oceania: ['Australia', 'New Zealand'],
};

const DEFAULT_NORMS = {
    temperature: { optimal: [20, 23], warning: [18, 25], critical: [null, null] },
    humidity: { optimal: [40, 60], warning: [30, 70], critical: [null, null] },
    pressure: { optimal: [1000, 1020], warning: [980, 1040], critical: [null, null] },
};

const SENSOR_LABELS: Record<string, string> = {
    temperature: 'Temperature (°C)',
    humidity: 'Humidity (%)',
    pressure: 'Air Pressure (hPa)',
};

export default function Settings() {
    const { user, refreshUser } = useAuth();
    const [form, setForm] = useState({
        login: '',
        password: '',
        continent: '',
        country: '',
        locality: '',
        flat_name: '',
    });
    const [norms, setNorms] = useState(DEFAULT_NORMS);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setForm({
                login: user.login,
                password: '',
                continent: user.continent,
                country: user.country,
                locality: user.locality,
                flat_name: user.flat_name,
            });
            setNorms(user.norms || DEFAULT_NORMS);
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleNormChange = (
        sensor: string,
        type: 'optimal' | 'warning' | 'critical',
        index: 0 | 1,
        value: number | null
    ) => {
        setNorms(prev => ({
            ...prev,
            [sensor]: {
                ...prev[sensor],
                [type]: prev[sensor][type].map((v: any, i: number) => (i === index ? value : v)) as [number | null, number | null],
            },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await axios.put('http://localhost:3000/user', { ...form, norms });
            setSuccess('Dane zapisane pomyślnie!');
            refreshUser();
        } catch (err: any) {
            setError(err.response?.data?.error ?? 'Błąd przy zapisie danych');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-3xl shadow-2xl w-full m-10 flex flex-col gap-8"
            >
                <h1 className="text-3xl font-bold text-center text-gray-800">Account and norms settings</h1>

                {error && <p className="text-red-500 text-center font-medium">{error}</p>}
                {success && <p className="text-green-500 text-center font-medium">{success}</p>}
                <button
                    type="submit"
                    className={`bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 w-50 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Zapisywanie...' : 'Save changes'}
                </button>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Lewa kolumna - Dane użytkownika */}
                    <div className="flex-50 flex flex-col gap-4 bg-gray-50 p-6 rounded-2xl shadow-inner">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">User data</h2>
                        <input
                            type="text"
                            name="login"
                            placeholder="Maciej"
                            value={form.login}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="*********"
                            value={form.password}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        />
                        <select
                            name="continent"
                            value={'Europe'}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        >
                            <option value="">Wybierz kontynent</option>
                            {Object.keys(CONTINENTS).map(cont => (
                                <option key={cont} value={cont}>{cont}</option>
                            ))}
                        </select>
                        <select
                            name="country"
                            value={'form.country'}
                            onChange={handleChange}
                            disabled={!form.continent}
                            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        >
                            <option value="Poland">Poland</option>
                            {form.continent && CONTINENTS[form.continent].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input
                            type="text"
                            name="locality"
                            placeholder="Jelenia Góra"
                            value={form.locality}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        />
                        <input
                            type="text"
                            name="flat_name"
                            placeholder="Mieszkanie 1"
                            value={form.flat_name}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        />
                    </div>

                    {/* Prawa kolumna - Normy */}
                    {/* Prawa kolumna - Normy */}
                    <div className="flex-50 flex flex-col gap-6 bg-gray-50 p-6 rounded-2xl shadow-inner">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Norms</h2>
                        {Object.keys(norms).map(sensor => (
                            <div key={sensor} className="mb-1">
                                <p className="font-medium capitalize mb-2">{SENSOR_LABELS[sensor] || sensor}</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {['optimal', 'warning'].map(type =>
                                        [0, 1].map((i) => (
                                            <div key={`${type}-${i}`} className="flex flex-col">
                                                <label className="text-sm text-gray-500">
                                                    {type === 'optimal' ? (i === 0 ? 'Optimal-min' : 'Optimal-max') : i === 0 ? 'Warning-min' : 'Warning-max'}
                                                </label>
                                                <input
                                                    type="number"
                                                    value={norms[sensor][type][i] ?? ''}
                                                    onChange={e => handleNormChange(sensor, type as 'optimal' | 'warning', i as 0 | 1, Number(e.target.value))}
                                                    className={`p-3 border border-gray-300 rounded-xl focus:outline-none ${type === 'optimal' ? 'focus:ring-2 focus:ring-green-400' : 'focus:ring-2 focus:ring-yellow-400'
                                                        } w-full`}
                                                />
                                            </div>
                                        ))
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    Range: optimal [{norms[sensor].optimal[0]} - {norms[sensor].optimal[1]}], Warning [{norms[sensor].warning[0]} - {norms[sensor].warning[1]}]
                                </p>
                            </div>
                        ))}
                    </div>
                </div>


            </form>
        </div>
    );
}
