import React, { useMemo } from 'react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ReferenceArea,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { useNormStatus } from '../../hooks/useNormStatus';
import type { DotProps } from 'recharts';
import { useElevation } from '@/hooks/useElevation';

interface HistoryChartProps {
    data: Array<Record<string, any>>;
}

export default function HistoryChart({ data: rawData }: HistoryChartProps) {
    const { SENSOR_NORMS, getNormStatus } = useNormStatus();
    const { elevation } = useElevation();

    // Mapowanie danych z uwzględnieniem pressureQNH
    const data = useMemo(() => {
        if (!rawData || rawData.length === 0) return [];
        if (elevation === null || elevation === undefined) return rawData;

        return rawData.map((item, index) => ({
            ...item,
            _index: index,
            pressureQNH: item.air_pressure
                ? Number((item.air_pressure / Math.pow(1 - elevation / 44330, 5.255)).toFixed(1))
                : null,
        }));
    }, [rawData, elevation]);

    if (!data || data.length === 0) {
        return <p className="text-gray-500 mt-4 text-center">No data for chart</p>;
    }

    const sensors = [
        { dataKey: 'temperature', normKey: 'temperature', color: '#22c55e' },
        { dataKey: 'humidity', normKey: 'humidity', color: '#3b82f6' },
        { dataKey: 'pressureQNH', normKey: 'pressure', color: '#f97316' }, // teraz korzystamy z pressureQNH
        { dataKey: 'air_quality', normKey: 'airQualityVoltage', color: '#e11d48' },
    ];

    const CustomDot: React.FC<DotProps & { normKey: string }> = (props) => {
        const { cx, cy, payload, dataKey, normKey } = props as any;
        if (cx == null || cy == null || !payload) return null;
        const value = payload[dataKey];
        if (value == null) return null;
        const norm = SENSOR_NORMS[normKey];
        const status = norm ? getNormStatus(value, norm) : 'unknown';
        const fill = status === 'optimal' ? '#22c55e' : status === 'warning' ? '#eab308' : '#ef4444';
        return <circle cx={cx} cy={cy} r={3} fill={fill} stroke="none" />;
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (!active || !payload || payload.length === 0) return null;
        return (
            <div className="p-2 bg-white border shadow rounded-md">
                <div className="font-semibold mb-1">{label}</div>
                {payload.map((p: any, i: number) => {
                    const dk = p.dataKey;
                    const normKey = sensors.find(s => s.dataKey === dk)?.normKey || '';
                    const norm = SENSOR_NORMS[normKey];
                    const value = p.value;
                    const status = norm ? getNormStatus(value, norm) : 'unknown';
                    const color =
                        status === 'optimal'
                            ? 'text-green-600'
                            : status === 'warning'
                                ? 'text-yellow-600'
                                : status === 'critical'
                                    ? 'text-red-600'
                                    : 'text-gray-700';
                    const labelText = norm?.label || dk;
                    return (
                        <div key={i} className="mb-1">
                            <div className="text-sm">
                                <span className="font-medium">{labelText}:</span> {value}{norm ? ` ${norm.unit}` : ''}
                            </div>
                            <div className={`text-xs font-bold ${color}`}>Status: {status}</div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="mt-8 w-full h-96 bg-white p-4 rounded-2xl shadow-md border border-gray-200">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="reading_at" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {sensors.map(({ dataKey, normKey, color }) => {
                        const hasData = data.some(r => r[dataKey] != null);
                        const norm = SENSOR_NORMS[normKey];
                        if (!hasData) return null;

                        return (
                            <React.Fragment key={dataKey}>
                                {norm && (
                                    <>
                                        <ReferenceArea
                                            y1={norm.optimal[0]}
                                            y2={norm.optimal[1]}
                                            stroke="none"
                                            fill="#22c55e22"
                                        />
                                        <ReferenceArea
                                            y1={norm.warning[0]}
                                            y2={norm.warning[1]}
                                            stroke="none"
                                            fill="#eab30822"
                                        />
                                    </>
                                )}
                                <Line
                                    type="monotone"
                                    dataKey={dataKey}
                                    name={norm?.label || dataKey}
                                    stroke={color}
                                    strokeWidth={2}
                                    dot={(props) => <CustomDot {...props} normKey={normKey} />}
                                />
                            </React.Fragment>
                        );
                    })}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
