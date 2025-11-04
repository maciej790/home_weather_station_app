import { useWebSocketQuery } from "@/hooks/useWebSocketQuery";

const Header = () => {
    const { data, loading, error } = useWebSocketQuery("ws://localhost:3000");

    return (
        <div className="flex justify-between items-center fixed top-0 left-64 right-0 bg-white p-6 pl-10 shadow-md z-50 rounded-b-sm">
            <div className="flex flex-col">
                <h2 className="text-2xl font-semibold">Dashboard</h2>
                <p className="text-gray-500 text-sm">Real-time environmental sensors monitoring</p>
            </div>

            <div className="flex items-center">
                {(!loading && error) && (
                    <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-xl shadow-sm border border-red-200">
                        <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.5)]"></div>
                        <p className="text-red-700 font-medium text-sm">Dissconnected with sensors</p>
                    </div>)}
                {loading && !data && (
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

            </div>
        </div>
    );
};

export default Header;
