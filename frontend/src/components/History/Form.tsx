export default function Form({
    type,
    setType,
    range,
    setRange,
    from,
    setFrom,
    to,
    setTo,
    onRangeSelect,
    onCustomSearch
}: any) {

    const ranges = [
        { label: "1h", value: "1h" },
        { label: "24h", value: "24h" },
        { label: "7d", value: "7d" },
        { label: "1m", value: "1m" },
        { label: "1y", value: "1y" },
    ];

    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* LEFT PANEL */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Filters</h2>

                {/* SENSOR TYPE */}
                <div className="mb-6">
                    <label className="block font-medium text-gray-700 mb-2">Sensor type</label>
                    <select
                        className="border border-gray-300 rounded-xl p-3 w-full bg-gray-50 focus:ring-2 focus:ring-blue-400"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="all">All sensors</option>
                        <option value="temperature">Temperature</option>
                        <option value="humidity">Humidity</option>
                        <option value="pressure">Pressure</option>
                        <option value="air_quality">Air Quality</option>
                    </select>
                </div>

                {/* RANGE BUTTONS */}
                <div>
                    <p className="font-medium text-gray-700 mb-3">Quick ranges</p>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                        {ranges.map(r => (
                            <button
                                key={r.value}
                                onClick={() => onRangeSelect(r.value)}
                                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all shadow-sm border
                                    ${range === r.value
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"}`}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Custom Range</h2>

                <div className="flex gap-6 flex-wrap">
                    <div className="flex-1">
                        <label className="block font-medium mb-2 text-gray-700">From</label>
                        <input
                            type="datetime-local"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="border border-gray-300 rounded-xl p-3 w-full bg-gray-50 focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="flex-1">
                        <label className="block font-medium mb-2 text-gray-700">To</label>
                        <input
                            type="datetime-local"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="border border-gray-300 rounded-xl p-3 w-full bg-gray-50 focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>

                <button
                    onClick={onCustomSearch}
                    className="mt-6 w-full py-3 text-lg font-medium bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
                >
                    Search
                </button>
            </div>
        </div>
    );
}