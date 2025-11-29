import { useLocation } from "@tanstack/react-router";
import { useWebSocketQuery } from "@/hooks/useWebSocketQuery";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
    const { data, loading, error } = useWebSocketQuery("ws://localhost:3000");
    const location = useLocation();
    const { user, logout } = useAuth(); // <-- pobieramy użytkownika i funkcję logout

    const routeName = location.pathname.replace('/', '');
    const formatted =
        routeName
            ? routeName.charAt(0).toUpperCase() + routeName.slice(1)
            : 'Dashboard';

    let routeDescription = '';

    switch (routeName) {
        case 'history':
            routeDescription = 'View and analyze historical sensor data';
            break;
        case 'settings':
            routeDescription = 'Configure application settings and preferences';
            break;
        case 'account':
            routeDescription = 'Manage your user account and profile settings';
            break;
        default:
            routeDescription = 'Real-time environmental sensors monitoring';
            break;
    }

    return (
        <div className="flex justify-between items-center fixed top-0 left-64 right-0 bg-white p-6 pl-10 shadow-md z-50 rounded-b-sm">
            {/* Lewa część – nazwa strony i opis */}
            <div className="flex flex-col">
                <h2 className="text-2xl font-semibold">{!routeName ? 'Dashboard' : formatted}</h2>
                <p className="text-gray-500 text-sm">{routeDescription}</p>
            </div>

            {/* Prawa część – status połączenia i user */}
            <div className="flex items-center gap-4">
                {/* Status połączenia */}
                {(!loading && error) && (
                    <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-xl shadow-sm border border-red-200">
                        <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.5)]"></div>
                        <p className="text-red-700 font-medium text-sm">Disconnected with sensors</p>
                    </div>
                )}
                {(loading || !data) && (
                    <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-xl shadow-sm border border-amber-200">
                        <div className="w-3.5 h-3.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_2px_rgba(251,191,36,0.5)]"></div>
                        <p className="text-amber-700 font-medium text-sm">Connecting...</p>
                    </div>
                )}
                {!loading && !error && data && (
                    <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-xl shadow-sm border border-green-200">
                        <div className="w-3.5 h-3.5 rounded-full bg-green-500 shadow-[0_0_8px_2px_rgba(34,197,94,0.5)]"></div>
                        <p className="text-green-700 font-medium text-sm">Connected with sensors</p>
                    </div>
                )}

                {/* Wyświetlenie zalogowanego użytkownika */}
                {user && (
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-xl shadow-sm border border-blue-200">
                        <p className="text-blue-700 font-medium text-sm">Hi, {user.username}</p>
                        <button
                            onClick={logout}
                            className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        >
                            Wyloguj
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
