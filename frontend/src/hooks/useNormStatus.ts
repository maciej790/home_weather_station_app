export function useNormStatus() {
    type NormStatus = 'optimal' | 'warning' | 'critical'

    interface SensorNorm {
        label: string
        unit: string
        optimal: [number, number]
        warning: [number, number]
    }

    const SENSOR_NORMS: Record<string, SensorNorm> = {
        temperature: {
            label: 'Temperatura',
            unit: '°C',
            optimal: [20, 23],
            warning: [18, 25],
        },
        humidity: {
            label: 'Wilgotność',
            unit: '%',
            optimal: [40, 60],
            warning: [30, 70],
        },
        pressure: {
            label: 'Ciśnienie',
            unit: 'hPa',
            optimal: [1000, 1020],
            warning: [980, 1040],
        },
        airQualityVoltage: {
            label: 'Jakość powietrza (napięcie)',
            unit: 'mV',
            // Optymalne — bardzo dobre/dobre powietrze
            optimal: [0, 1500],
            // Ostrzeżenie — średnie
            warning: [1500, 2000],
            // Powyżej 2000 — krytyczne
        },
    }

    function getNormStatus(value: number, norm: SensorNorm): NormStatus {
        if (value >= norm.optimal[0] && value <= norm.optimal[1]) return 'optimal'
        if (value >= norm.warning[0] && value <= norm.warning[1]) return 'warning'
        return 'critical'
    }

    // 🔹 Kolory dla różnych statusów
    function getNormColor(status: NormStatus): string {
        switch (status) {
            case 'optimal':
                return 'bg-green-100 text-green-800 border-green-300'
            case 'warning':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300'
            case 'critical':
                return 'bg-red-100 text-red-800 border-red-300'
        }
    }

    return { SENSOR_NORMS, getNormStatus, getNormColor }
}
