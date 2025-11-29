import { useNormStatus } from "../../hooks/useNormStatus";

interface StatsPanelProps {
    data: Array<any>;
    type: string; // temperature / humidity / air_pressure / air_quality
}

export default function StatsPanel({ data, type }: StatsPanelProps) {
    const { SENSOR_NORMS, getNormStatus } = useNormStatus();

    if (!data || data.length === 0 || type === "all") return null;

    // **dokładne nazwy w chartData**
    const typeToDataKey: Record<string, string> = {
        temperature: "temperature",
        humidity: "humidity",
        air_pressure: "air_pressure",
        air_quality: "air_quality",
    };

    const normKeys: Record<string, string> = {
        temperature: "temperature",
        humidity: "humidity",
        air_pressure: "pressure", // bo w SENSOR_NORMS tak jest
        air_quality: "airQualityVoltage",
    };


    const dataKey = typeToDataKey[type];
    const normKey = normKeys[type];

    if (!dataKey || !normKey) {
        console.warn("StatsPanel: Niepoprawny typ:", type);
        return null;
    }

    const norm = SENSOR_NORMS[normKey];

    const values = data
        .map(r => r[dataKey])
        .filter(v => typeof v === "number");

    console.log(values)

    if (values.length === 0) return null;

    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    const median = (() => {
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    })();

    let optimalCount = 0;
    let warningCount = 0;
    let criticalCount = 0;

    values.forEach(v => {
        const status = getNormStatus(v, norm);
        if (status === "optimal") optimalCount++;
        else if (status === "warning") warningCount++;
        else criticalCount++;
    });

    const total = values.length;
    const p = (n: number) => ((n / total) * 100).toFixed(1);

    return (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card title="Average" value={avg.toFixed(2)} unit={norm.unit} />
            <Card title="Median" value={median.toFixed(2)} unit={norm.unit} />
            <Card title="Min" value={min.toFixed(2)} unit={norm.unit} />
            <Card title="Max" value={max.toFixed(2)} unit={norm.unit} />

            <Card title="Optimal (%)" value={`${p(optimalCount)}%`} color="text-green-600" />
            <Card title="Warning (%)" value={`${p(warningCount)}%`} color="text-yellow-600" />
            <Card title="Critical (%)" value={`${p(criticalCount)}%`} color="text-red-600" />
        </div>
    );
}

function Card({
    title,
    value,
    unit = "",
    color = "text-gray-800"
}: {
    title: string;
    value: string | number;
    unit?: string;
    color?: string;
}) {
    return (
        <div className="p-4 bg-white shadow-md rounded-xl border border-gray-200">
            <p className="text-sm text-gray-500">{title}</p>
            <p className={`text-xl font-semibold ${color}`}>
                {value} {unit}
            </p>
        </div>
    );
}
