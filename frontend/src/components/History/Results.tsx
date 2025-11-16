import { useNormStatus } from '../../hooks/useNormStatus';

export default function Results({ data, page, totalPages, onPrev, onNext }: any) {
    const { SENSOR_NORMS, getNormStatus, loading } = useNormStatus();

    if (!loading && data.length === 0)
        return <p className="text-gray-500 mt-6 text-center">No data found</p>;

    const getTextColor = (status: 'optimal' | 'warning' | 'critical') => {
        switch (status) {
            case 'optimal': return 'text-green-600';
            case 'warning': return 'text-yellow-600';
            case 'critical': return 'text-red-600';
        }
    };

    // Sprawdzamy, które kolumny mają wartości
    const showTemp = data.some(r => r.temperature != null);
    const showHum = data.some(r => r.humidity != null);
    const showPress = data.some(r => r.air_pressure != null);
    const showAQ = data.some(r => r.air_quality != null);

    return (
        <div className="mt-10 bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Results</h2>

            <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full text-sm divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10 border-b">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">#</th>
                            {showTemp && <th className="px-4 py-3 text-left font-semibold text-gray-700">Temp (°C)</th>}
                            {showHum && <th className="px-4 py-3 text-left font-semibold text-gray-700">Humidity (%)</th>}
                            {showPress && <th className="px-4 py-3 text-left font-semibold text-gray-700">Pressure (hPa)</th>}
                            {showAQ && <th className="px-4 py-3 text-left font-semibold text-gray-700">AQI</th>}
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((r: any, i: number) => {
                            const tempStatus = getNormStatus(r.temperature, SENSOR_NORMS.temperature);
                            const humStatus = getNormStatus(r.humidity, SENSOR_NORMS.humidity);
                            const pressStatus = getNormStatus(r.air_pressure, SENSOR_NORMS.pressure);
                            const aqiStatus = getNormStatus(r.air_quality, SENSOR_NORMS.airQualityVoltage);

                            return (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">{(page - 1) * 50 + i + 1}</td>
                                    {showTemp && <td className={`px-4 py-3 font-semibold ${r.temperature != null ? getTextColor(tempStatus) : ''}`}>
                                        {r.temperature?.toFixed(2)}
                                    </td>}
                                    {showHum && <td className={`px-4 py-3 font-semibold ${r.humidity != null ? getTextColor(humStatus) : ''}`}>
                                        {r.humidity?.toFixed(2)}
                                    </td>}
                                    {showPress && <td className={`px-4 py-3 font-semibold ${r.air_pressure != null ? getTextColor(pressStatus) : ''}`}>
                                        {r.air_pressure?.toFixed(2)}
                                    </td>}
                                    {showAQ && <td className={`px-4 py-3 font-semibold ${r.air_quality != null ? getTextColor(aqiStatus) : ''}`}>
                                        {r.air_quality?.toFixed(2)}
                                    </td>}
                                    <td className="px-4 py-3">{r.reading_at}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between items-center mt-6 px-4 py-3 bg-gray-50 border-t rounded-b-2xl">
                <button
                    onClick={onPrev}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-40"
                >
                    Prev
                </button>
                <div className="text-gray-700">
                    Page <b>{page}</b> / {totalPages}
                </div>
                <button
                    onClick={onNext}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-40"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
