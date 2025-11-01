import { useWebSocketQuery } from "@/hooks/useWebSocketQuery";

const Header = () => {
    const { data, connected, loading, error } = useWebSocketQuery("ws://localhost:3000");

    return (
        <div className="flex justify-between items-center fixed top-0 left-64 right-0 bg-white p-6 pl-10 shadow-md z-50 rounded-b-sm">
            {/* Lewa strona (napisy jeden pod drugim) */}
            <div className="flex flex-col">
                <h2 className="text-2xl font-semibold">Dashboard</h2>
                <p className="text-gray-500 text-sm">Real-time environmental sensors monitoring</p>
            </div>

            {/* Prawa strona (timestamp / status) */}
            <div className="flex items-center">
                {error && <p className="text-red-500 text-sm">❌ {error}</p>}
                {loading && !error && <p className="text-gray-400 text-sm">⏳ Connecting...</p>}
                {connected && !loading && !error && (
                    <p className="text-gray-400 text-sm">
                        Last update: {new Date(data?.timestamp || "").toLocaleString()}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Header;
