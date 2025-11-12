import React from 'react'
import { useNormStatus } from '@/hooks/useNormStatus'

interface SensorDataCardProps {
    type: 'temperature' | 'humidity' | 'pressure' | 'airQuality' | 'airQualityVoltage'
    value: number
    icon?: React.ComponentType<any>
    unit?: string
}

const SensorDataCard: React.FC<SensorDataCardProps> = ({ type, value, icon: Icon }) => {
    const { SENSOR_NORMS, getNormStatus } = useNormStatus()

    const norm = SENSOR_NORMS[type]
    const numericValue = typeof value === 'number' ? value : parseFloat(String(value))
    const status = getNormStatus(numericValue, norm)

    const barColor =
        status === 'critical'
            ? 'bg-red-500'
            : status === 'warning'
                ? 'bg-yellow-500'
                : 'bg-green-500'

    const iconColorMap: Record<string, string> = {
        temperature: 'text-red-500 bg-red-50',
        humidity: 'text-blue-500 bg-blue-50',
        pressure: 'text-violet-500 bg-violet-100',
        airQuality: 'text-green-600 bg-green-50',
        airQualityVoltage: 'text-amber-600 bg-amber-50',
    }

    const iconColorClass = iconColorMap[type] || 'text-gray-500 bg-gray-100'

    const getAirQualityDescription = (val: number): string => {
        if (val <= 1000) return 'Very good'
        if (val <= 1500) return 'Good'
        if (val <= 2000) return 'Moderate'
        if (val <= 2500) return 'Poor'
        return 'Very poor'
    }

    return (
        <div
            className="
        relative bg-white rounded-2xl shadow-sm border border-gray-100
        p-12 flex flex-col justify-between transition-all duration-300
        hover:shadow-md hover:-translate-y-0.5 overflow-hidden
      "
        >
            {/* 🔸 Pasek statusu u dołu */}
            <div
                className={`absolute bottom-0 left-0 right-0 h-[6px] ${barColor}`}
            ></div>

            {/* 🔹 Górna sekcja: ikona + jednostka */}
            <div className="flex justify-between items-start">
                {Icon && (
                    <div
                        className={`p-3 rounded-xl flex items-center justify-center ${iconColorClass}`}
                    >
                        <Icon className="w-6 h-6" />
                    </div>
                )}
                <span className="text-gray-400 text-base font-medium">{norm.unit}</span>
            </div>

            {/* 🔸 Nazwa parametru */}
            <h3 className="mt-3 text-gray-700 font-medium">{norm.label || 'Parametr'}</h3>

            {/* 🔹 Wartość */}
            <p className="text-3xl font-bold text-gray-900 mt-1">
                {norm.label === 'Air Quality Index'
                    ? getAirQualityDescription(value)
                    : value}
            </p>

            {/* 🔸 Status tekstowy */}
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <span
                    className={`inline-block w-2 h-2 rounded-full ${status === 'critical'
                        ? 'bg-red-500'
                        : status === 'warning'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                ></span>
                <span>{status}</span>
            </div>
        </div>
    )
}

export default SensorDataCard
