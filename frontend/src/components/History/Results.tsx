import { useMemo } from 'react';
import { useNormStatus } from '../../hooks/useNormStatus';
import { useElevation } from '@/hooks/useElevation';

export default function Results({ data: rawData, page, totalPages, onPrev, onNext }: any) {
    const { SENSOR_NORMS, getNormStatus, loading } = useNormStatus();
    const { elevation } = useElevation();

    // Mapujemy dane z QNH
    const data = useMemo(() => {
        if (!rawData || rawData.length === 0) return [];
        if (elevation === null || elevation === undefined) return rawData;

        return rawData.map((item, index) => ({
            ...item,
            pressureQNH: item.air_pressure
                ? Number((item.air_pressure / Math.pow(1 - elevation / 44330, 5.255)).toFixed(1))
                : null,
            _index: (page - 1) * 50 + index, // numeracja globalna
        }));
    }, [rawData, elevation, page]);

    if (!loading && data.length === 0)
        return <p className="text-gray-500 mt-6 text-center">No data found</p>;

    const getTextColor = (status: 'optimal' | 'warning' | 'critical') => {
        switch (status) {
            case 'optimal': return 'text-green-600';
            case 'warning': return 'text-yellow-600';
            case 'critical': return 'text-red-600';
        }
    };

    const showTemp = data.some(r => r.temperature != null);
    const showHum = data.some(r => r.humidity != null);
    const showPress = data.some(r => r.pressureQNH != null);
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
                        {data.map((r: any) => {
                            const tempStatus = getNormStatus(r.temperature, SENSOR_NORMS.temperature);
                            const humStatus = getNormStatus(r.humidity, SENSOR_NORMS.humidity);
                            const pressStatus = getNormStatus(r.pressureQNH, SENSOR_NORMS.pressure);
                            const aqiStatus = getNormStatus(r.air_quality, SENSOR_NORMS.airQualityVoltage);

                            return (
                                <tr key={r._index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">{r._index + 1}</td>
                                    {showTemp && <td className={`px-4 py-3 font-semibold ${r.temperature != null ? getTextColor(tempStatus) : ''}`}>{r.temperature?.toFixed(2)}</td>}
                                    {showHum && <td className={`px-4 py-3 font-semibold ${r.humidity != null ? getTextColor(humStatus) : ''}`}>{r.humidity?.toFixed(2)}</td>}
                                    {showPress && <td className={`px-4 py-3 font-semibold ${r.pressureQNH != null ? getTextColor(pressStatus) : ''}`}>{r.pressureQNH?.toFixed(2)}</td>}
                                    {showAQ && <td className={`px-4 py-3 font-semibold ${r.air_quality != null ? getTextColor(aqiStatus) : ''}`}>{r.air_quality?.toFixed(2)}</td>}
                                    <td className="px-4 py-3">{r.reading_at}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-6 px-4 py-3 bg-gray-50 border-t rounded-b-2xl">
                <button onClick={onPrev} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-40">Prev</button>
                <div className="text-gray-700">Page <b>{page}</b> / {totalPages}</div>
                <button onClick={onNext} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-40">Next</button>
            </div>
        </div>
    );
}
