// src/layouts/RootLayout.tsx
import { Outlet } from '@tanstack/react-router';
import { WebSocketProvider } from '@/context/WebSocketContext';
import { useAuth } from '@/context/AuthContext';
import SideBar from '@/components/SideBar/SideBar';
import Header from '@/components/Header/Header';

export const RootLayout = () => {
    const { user } = useAuth();

    return (
        <WebSocketProvider>
            {user && (
                <>
                    <SideBar />
                    <Header />
                </>
            )}

            <main
                className={`flex items-center justify-center min-h-screen bg-gray-50 ${user ? 'ml-64 pt-24' : ''
                    }`}
            >
                <Outlet />
            </main>
        </WebSocketProvider>
    );
};
