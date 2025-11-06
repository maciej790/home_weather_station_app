import React from 'react'
import { useNormStatus } from '@/hooks/useNormStatus'

interface SensorDataCardProps {
    type: 'temperature' | 'humidity' | 'pressure' | 'airQuality' | 'airQualityVoltage'
    value: number
}
const SensorDataCard: React.FC<SensorDataCardProps> = ({ type, value }) => {
    const { SENSOR_NORMS, getNormStatus, getNormColor } = useNormStatus()

    // ⚙️ Ustal normę tylko dla tych parametrów, które ją mają
    const norm = SENSOR_NORMS[type]
    const numericValue = typeof value === 'number' ? value : parseFloat(String(value))
    const status = getNormStatus(numericValue, norm)
    const colorClass = getNormColor(status)

    return (
        <div
            className={`h-40 transition-all duration-300 rounded-xl p-6 border shadow-md flex flex-col justify-center items-center font-semibold ${colorClass}`}
        >
            <h3 className="text-lg font-medium">
                {norm.label || 'Parametr'}
            </h3>
            <p className="text-3xl font-bold mt-1">
                {value} {norm.unit}
            </p>
            <p
                className={`text-sm mt-2 capitalize ${status === 'critical'
                    ? 'text-red-700'
                    : status === 'warning'
                        ? 'text-yellow-700'
                        : 'text-green-700'
                    }`}
            >
                Status: {status}
            </p>
        </div>
    )
}

export default SensorDataCard
