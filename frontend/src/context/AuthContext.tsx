import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    userId: number;
    username: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (login: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Sprawdzenie tokena przy starcie
    useEffect(() => {
        if (token) {
            axios
                .get('http://localhost:3000/auth/logged', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(res => setUser(res.data))
                .catch(() => logout())
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    // Logowanie
    const login = async (loginInput: string, password: string) => {
        const res = await axios.post('http://localhost:3000/auth/login', { login: loginInput, password });
        const token = res.data;
        localStorage.setItem('token', token);
        setToken(token);

        const userRes = await axios.get('http://localhost:3000/auth/logged', {
            headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data.user);
    };

    // Wylogowanie
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook do użycia AuthContext
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};
