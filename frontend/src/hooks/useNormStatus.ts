import { useEffect, useState } from "react";

export function useNormStatus() {
    const [normData, setNormData] = useState<{ norms?: Array<any> } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getNormFromApi = async () => {
            try {
                const response = await fetch('http://localhost:3000/norm');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                if (data?.norms && Array.isArray(data.norms)) {
                    setNormData({ norms: data.norms });
                }
            } catch (error) {
                console.error('Error fetching norm data:', error);
            } finally {
                setLoading(false);
            }
        };

        getNormFromApi();
    }, []);

    type NormStatus = 'optimal' | 'warning' | 'critical';

    interface SensorNorm {
        label: string;
        unit: string;
        optimal: [number, number];
        warning: [number, number];
    }

    const SENSOR_NORMS: Record<string, SensorNorm> = {
        temperature: {
            label: 'Temperature',
            unit: '°C',
            optimal: [normData?.norms[0]?.optimal_min, normData?.norms[0]?.optimal_max],
            warning: [normData?.norms[0]?.warning_min, normData?.norms[0]?.warning_max],
        },
        humidity: {
            label: 'Humidity',
            unit: '%',
            optimal: [normData?.norms[1]?.optimal_min, normData?.norms[1]?.optimal_max],
            warning: [normData?.norms[1]?.warning_min, normData?.norms[1]?.warning_max],
        },
        pressure: {
            label: 'Air Pressure',
            unit: 'hPa',
            optimal: [normData?.norms[2]?.optimal_min, normData?.norms[2]?.optimal_max],
            warning: [normData?.norms[2]?.warning_min, normData?.norms[2]?.warning_max],
        },
        airQualityVoltage: {
            label: 'Air Quality Index',
            unit: 'AQI',
            optimal: [normData?.norms[3]?.optimal_min, normData?.norms[3]?.optimal_max],
            warning: [normData?.norms[3]?.warning_min, normData?.norms[3]?.warning_max],
        },
    };

    function getNormStatus(value: number, norm: SensorNorm): NormStatus {
        if (value >= norm.optimal[0] && value <= norm.optimal[1]) return 'optimal';
        if (value >= norm.warning[0] && value <= norm.warning[1]) return 'warning';
        return 'critical';
    }

    function getNormColor(status: NormStatus): string {
        switch (status) {
            case 'optimal':
                return 'bg-green-500 text-green-800 border-green-300';
            case 'warning':
                return 'bg-yellow-500 text-yellow-800 border-yellow-300';
            case 'critical':
                return 'bg-red-500 text-red-800 border-red-300';
        }
    }

    return { SENSOR_NORMS, getNormStatus, getNormColor, loading };
}
