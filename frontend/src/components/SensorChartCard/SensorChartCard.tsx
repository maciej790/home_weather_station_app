// src/components/SensorChartCard/SensorChartCard.tsx
import {
    CartesianGrid,
    LineChart,
    Line as RechartsLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts'
import { useEffect, useRef, useState } from 'react'
import { useWebSocket } from '@/context/WebSocketContext'

interface SensorChartCardProps {
    type: 'temperature' | 'humidity' | 'pressure'
    unit: string
}

const MAX_POINTS = 50
const REFRESH_INTERVAL = 2000 // maks. 2 s

const SensorChartCard: React.FC<SensorChartCardProps> = ({ type, unit }) => {
    const { history } = useWebSocket()
    const [visibleData, setVisibleData] = useState<Array<{ time: string; value: number }>>([])
    const lastUpdateRef = useRef<number>(0)

    useEffect(() => {
        const now = Date.now()
        if (now - lastUpdateRef.current < REFRESH_INTERVAL) return
        lastUpdateRef.current = now

        setVisibleData(prev => {
            const filtered = history.reduce((acc: Array<{ time: string; value: number }>, item, index) => {
                if (index === 0 || item[type] !== history[index - 1][type]) {
                    acc.push({ time: item.time, value: item[type] })
                }
                return acc
            }, []).slice(-MAX_POINTS)

            if (prev.length === 0 || prev[prev.length - 1]?.value !== filtered[filtered.length - 1]?.value) {
                return filtered
            }
            return prev
        })
    }, [history, type])

    const color =
        type === 'temperature' ? '#f87171' : type === 'humidity' ? '#60a5fa' : '#34d399'

    const typeLabel = type.charAt(0).toUpperCase() + type.slice(1)

    return (
        <div className="flex flex-col h-full">
            {/* Podpis wykresu z jednostką */}
            <h3 className="text-gray-700 font-semibold mb-2">
                {typeLabel} ({unit})
            </h3>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visibleData} margin={{ top: 10, right: 20, bottom: 30, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="time"
                        tickFormatter={t => new Date(t).toLocaleTimeString()}
                        tick={{ fontSize: 12, fill: '#4b5563' }}
                        axisLine={{ stroke: '#9ca3af' }}
                        tickLine={{ stroke: '#d1d5db' }}
                        type="category"
                        allowDuplicatedCategory={false}
                        label={{ value: 'Time', position: 'bottom', offset: 0, fill: '#4b5563', fontSize: 12 }}
                    />
                    <YAxis
                        tickFormatter={v => (v as number).toFixed(2)}
                        domain={['auto', 'auto']}
                        allowDecimals={true}
                        tick={{ fontSize: 12, fill: '#4b5563' }}
                        axisLine={{ stroke: '#9ca3af' }}
                        tickLine={{ stroke: '#d1d5db' }}
                        label={{ value: `Value (${unit})`, angle: -90, position: 'insideLeft', fill: '#4b5563', fontSize: 12 }}
                    />
                    <Tooltip
                        labelFormatter={label => new Date(label).toLocaleTimeString()}
                        formatter={value => (value as number).toFixed(2)}
                        contentStyle={{
                            backgroundColor: 'white',
                            borderRadius: 8,
                            border: '1px solid #d1d5db',
                            fontSize: 12,
                        }}
                    />
                    <RechartsLine type="basis" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default SensorChartCard
