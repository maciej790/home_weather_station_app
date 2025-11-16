import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { useNormStatus } from '../../hooks/useNormStatus';

interface HistoryChartProps {
    data: Array<any>;
}

export default function HistoryChart({ data }: HistoryChartProps) {
    const { SENSOR_NORMS, getNormStatus } = useNormStatus();

    if (!data || data.length === 0) return <p className="text-gray-500 mt-4 text-center">No data for chart</p>;

    // Sprawdzamy które serie mają wartości
    const showTemp = data.some(r => r.temperature != null);
    const showHum = data.some(r => r.humidity != null);
    const showPress = data.some(r => r.air_pressure != null);
    const showAQ = data.some(r => r.air_quality != null);

    const getLineColor = (value: number, normKey: string) => {
        const status = getNormStatus(value, SENSOR_NORMS[normKey]);
        switch (status) {
            case 'optimal': return '#22c55e'; // zielony
            case 'warning': return '#eab308'; // żółty
            case 'critical': return '#ef4444'; // czerwony
            default: return '#8884d8';
        }
    };

    return (
        <div className="mt-8 w-full h-96 bg-white p-4 rounded-2xl shadow-md border border-gray-200">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="reading_at" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    {showTemp && (
                        <Line
                            type="monotone"
                            dataKey="temperature"
                            stroke="#22c55e"
                            strokeWidth={2}
                            dot={false}
                        />
                    )}
                    {showHum && (
                        <Line
                            type="monotone"
                            dataKey="humidity"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={false}
                        />
                    )}
                    {showPress && (
                        <Line
                            type="monotone"
                            dataKey="air_pressure"
                            stroke="#f97316"
                            strokeWidth={2}
                            dot={false}
                        />
                    )}
                    {showAQ && (
                        <Line
                            type="monotone"
                            dataKey="air_quality"
                            stroke="#e11d48"
                            strokeWidth={2}
                            dot={false}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}