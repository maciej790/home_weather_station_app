import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import Form from '../components/History/Form';
import Results from '../components/History/Results';
import SkeletonLoading from '../components/History/SkeletonLoading';
import HistoryChart from '../components/History/HistoryChart';
import StatsPanel from '../components/History/StatsPanel';
import { useNormStatus } from '../hooks/useNormStatus';


import ProtectedRoute from '@/components/ProtectedRoute'



export const Route = createFileRoute('/history')({
    component: () => (
        <ProtectedRoute>
            <History />
        </ProtectedRoute>
    ),
})

function History() {
    const { SENSOR_NORMS } = useNormStatus();

    const [range, setRange] = useState<string | null>(null);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [type, setType] = useState('all');

    const [data, setData] = useState<Array<any>>([]);
    const [chartData, setChartData] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState<'table' | 'chart'>('table');
    const limit = 50;

    const normalizeType = (t: string) => {
        if (t === 'pressure') return 'air_pressure';
        if (t === 'aqi') return 'air_quality';
        return t;
    };

    const typeToBackendParam: Record<string, string> = {
        temperature: 'temperature',
        humidity: 'humidity',
        air_pressure: 'pressure',
        air_quality: 'air_quality'
    };

    function getQuery() {
        const backendType = type !== 'all' ? typeToBackendParam[normalizeType(type)] : '';
        if (range) return `range=${range}${backendType ? `&type=${backendType}` : ''}`;
        if (from && to) return `from=${from}&to=${to}${backendType ? `&type=${backendType}` : ''}`;
        return backendType ? `type=${backendType}` : '';
    }

    async function fetchData(pageNum = 1) {
        setLoading(true);
        try {
            const query = getQuery();
            const res = await fetch(`http://localhost:3000/history?${query}&page=${pageNum}&limit=${limit}`);
            const json = await res.json();
            setData(json.data ?? []);
            setTotalPages(json.pages || 1);
        } finally {
            setLoading(false);
        }
    }

    async function fetchChartData() {
        try {
            const query = getQuery();
            const res = await fetch(`http://localhost:3000/history?${query}&isChart=true`);
            const json = await res.json();
            setChartData(json.data ?? []);
        } catch (err) {
            console.error(err);
            setChartData([]);
        }
    }

    function handleRangeClick(r: string) {
        setRange(r);
        setFrom('');
        setTo('');
        setPage(1);
    }

    function handleCustomSearch() {
        if (!from || !to) return;
        setRange(null);
        setPage(1);
    }

    function handleClearFilters() {
        setRange(null);
        setFrom('');
        setTo('');
        setType('all');
        setPage(1);
        setActiveTab('table');
    }

    useEffect(() => {
        fetchData(page);
        fetchChartData();
    }, [range, from, to, type, page]);

    // Legenda norm – zawsze widoczna
    const NormLegend = () => {

        const normKeyMap: Record<string, string> = {
            temperature: 'temperature',
            humidity: 'humidity',
            air_pressure: 'pressure',
            air_quality: 'airQualityVoltage',
        };

        const norm = SENSOR_NORMS[normKeyMap[normalizeType(type)]];
        if (!norm) return null;

        return (
            <div className="flex justify-center gap-6 mb-6 text-sm">
                <div className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-green-600 rounded-full inline-block"></span>
                    Optimal: {norm.optimal[0]} – {norm.optimal[1]} {norm.unit}
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full inline-block"></span>
                    Warning: {norm.warning[0]} – {norm.warning[1]} {norm.unit}
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span>
                    Critical: {"<"}{norm.warning[0]} / {">"}{norm.warning[1]} {norm.unit}
                </div>
            </div>
        );
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-semibold text-gray-800">History</h1>
            <p className="text-gray-500 mt-1 mb-6">Explore historical environmental sensor data</p>

            <div className="flex flex-col gap-4 mb-4">
                <Form
                    type={type}
                    setType={setType}
                    range={range}
                    setRange={setRange}
                    from={from}
                    setFrom={setFrom}
                    to={to}
                    setTo={setTo}
                    onRangeSelect={handleRangeClick}
                    onCustomSearch={handleCustomSearch}
                />

                {/* Legenda norm pod formularzem */}
                <NormLegend />
                <div className="flex justify-end gap-2 mb-4">
                    <button
                        onClick={handleClearFilters}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                        Clear Filters
                    </button>
                    <button
                        onClick={() => exportToCSV(data)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        Export CSV
                    </button>
                </div>

            </div>

            {loading ? (
                <SkeletonLoading
                    rows={5}
                    showTemp={data.some((r) => r.temperature != null)}
                    showHum={data.some((r) => r.humidity != null)}
                    showPress={data.some((r) => r.air_pressure != null)}
                    showAQ={data.some((r) => r.air_quality != null)}
                />
            ) : (
                <>
                    {/* Zakładki */}
                    <div className="flex border-b border-gray-200 mb-4">
                        <button
                            onClick={() => setActiveTab('table')}
                            className={`px-4 py-2 -mb-px font-medium border-b-2 ${activeTab === 'table'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Table
                        </button>
                        <button
                            onClick={() => setActiveTab('chart')}
                            className={`px-4 py-2 -mb-px font-medium border-b-2 ${activeTab === 'chart'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Chart
                        </button>
                    </div>

                    {/* Zawartość zakładki */}
                    {activeTab === 'table' ? (
                        <Results
                            data={data}
                            page={page}
                            totalPages={totalPages}
                            onPrev={() => setPage((prev) => Math.max(1, prev - 1))}
                            onNext={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                        />
                    ) : (
                        <>
                            {type !== 'all' && chartData.length > 0 ? (
                                <>
                                    <StatsPanel data={chartData} type={normalizeType(type)} />
                                    <HistoryChart data={chartData} />
                                </>
                            ) : (
                                <p className="text-gray-500 text-center">
                                    Please select a specific sensor to see chart and stats.
                                </p>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}

function exportToCSV(data: Array<any>, filename = 'history.csv') {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','),
        ...data.map((row) =>
            headers
                .map((header) => {
                    const val = row[header];
                    return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
                })
                .join(',')
        ),
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export default History;
