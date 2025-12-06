// src/pages/Settings.tsx
import React, { use, useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useNormStatus } from '@/hooks/useNormStatus';

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



export default function Settings() {
    const { user, refreshUser } = useAuth();
    const { SENSOR_NORMS, getNormStatus } = useNormStatus();


    const [form, setForm] = useState({
        login: '',
        password: '',
        continent: '',
        country: '',
        locality: '',
        flat_name: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);



    useEffect(() => {
        if (user) {
            const continent = Object.keys(CONTINENTS).find(
                c => c.toLowerCase() === user.user.continent?.toLowerCase()
            ) || '';

            const availableCountries = continent ? CONTINENTS[continent] : [];

            const country = availableCountries.find(
                c => c.toLowerCase() === user.user.country?.toLowerCase()
            ) || '';

            setForm({
                login: user.user.username,
                password: user.user.password,
                continent,
                country,
                locality: user.user.locality,
                flat_name: user.user.flat_name,
                isEmailSubscribe: user.user.isEmailSubscribe || 0 // <- pobieramy z backendu
            });
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

        const token = localStorage.getItem('token');

        try {
            await axios.put(
                'http://localhost:3000/user/settings',
                { ...form, norms },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSuccess('Dane zapisane pomyślnie!');
            refreshUser();
        } catch (err: any) {
            console.log(err)
        } finally {
            setLoading(false);
        }
    };


    const [norms, setNorms] = useState<Record<string, any>>(SENSOR_NORMS || {});

    // fetch norms from API
    const fetchNorms = async () => {
        try {
            const res = await axios.get('http://localhost:3000/norm'); // endpoint z normami
            setNorms(res.data.norms);
        } catch (err) {
            console.error(err);
        }
    };


    console.log(norms)

    // fetch norms on mount
    useEffect(() => {
        fetchNorms();
    }, []);


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-2xl w-full m-10 flex flex-col gap-8">
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
                    {/* User data */}
                    <div className="flex-50 flex flex-col gap-4 bg-gray-50 p-6 rounded-2xl shadow-inner">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">User data</h2>

                        <input
                            type="text"
                            name="login"
                            placeholder={user?.user?.username}
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
                            value={form.continent}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        >
                            <option value="">{user?.user?.continent || "Wybierz kontynent"}</option>
                            {Object.keys(CONTINENTS).map(cont => <option key={cont} value={cont}>{cont}</option>)}
                        </select>

                        <select
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            disabled={!form.continent}
                            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        >
                            <option value="">{user?.user?.country || "Wybierz kraj"}</option>
                            {form.continent && CONTINENTS[form.continent].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>

                        <input
                            type="text"
                            name="locality"
                            placeholder={user?.user?.locality}
                            value={form.locality}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        />

                        <input
                            type="text"
                            name="flat_name"
                            placeholder={user?.user?.flat_name}
                            value={form.flat_name}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        />





                    </div>


                    <div className="flex-50 flex flex-col gap-6 bg-gray-50 p-6 rounded-2xl shadow-inner">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Norms</h2>

                        {Array.isArray(norms) && norms
                            .filter(sensor => sensor.label !== 'airQualityVoltage')
                            .map((sensor, index) => (
                                <div key={sensor.norm_id} className="mb-6">
                                    <p className="font-medium capitalize mb-2">{sensor.label}</p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {/* Optimal min/max */}
                                        <div className="flex flex-col">
                                            <label className="text-sm text-gray-500">optimal-min</label>
                                            <input
                                                type="number"
                                                value={sensor.optimal_min}
                                                onChange={e => {
                                                    const value = Number(e.target.value);
                                                    setNorms(prev => {
                                                        const copy = [...prev];
                                                        copy[index] = { ...copy[index], optimal_min: value };
                                                        return copy;
                                                    });
                                                }}
                                                className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-sm text-gray-500">optimal-max</label>
                                            <input
                                                type="number"
                                                value={sensor.optimal_max}
                                                onChange={e => {
                                                    const value = Number(e.target.value);
                                                    setNorms(prev => {
                                                        const copy = [...prev];
                                                        copy[index] = { ...copy[index], optimal_max: value };
                                                        return copy;
                                                    });
                                                }}
                                                className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
                                            />
                                        </div>

                                        {/* Warning min/max */}
                                        <div className="flex flex-col">
                                            <label className="text-sm text-gray-500">warning-min</label>
                                            <input
                                                type="number"
                                                value={sensor.warning_min}
                                                onChange={e => {
                                                    const value = Number(e.target.value);
                                                    setNorms(prev => {
                                                        const copy = [...prev];
                                                        copy[index] = { ...copy[index], warning_min: value };
                                                        return copy;
                                                    });
                                                }}
                                                className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-sm text-gray-500">warning-max</label>
                                            <input
                                                type="number"
                                                value={sensor.warning_max}
                                                onChange={e => {
                                                    const value = Number(e.target.value);
                                                    setNorms(prev => {
                                                        const copy = [...prev];
                                                        copy[index] = { ...copy[index], warning_max: value };
                                                        return copy;
                                                    });
                                                }}
                                                className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full"
                                            />
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-400 mt-1">
                                        Range: optimal [{sensor.optimal_min} - {sensor.optimal_max}], warning [{sensor.warning_min} - {sensor.warning_max}]
                                    </p>
                                </div>
                            ))}

                        {!Array.isArray(norms) && <p>Ładowanie norm...</p>}
                    </div>




                </div>
            </form>
        </div>
    );
}
