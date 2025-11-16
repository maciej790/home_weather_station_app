import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import Form from '../components/History/Form';
import Results from '../components/History/Results';
import SkeletonLoading from '../components/History/SkeletonLoading';
import HistoryChart from '../components/History/HistoryChart';

export const Route = createFileRoute('/history')({
    component: History,
});

function History() {
    const [range, setRange] = useState<string | null>(null);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [type, setType] = useState('all');

    const [data, setData] = useState<Array<any>>([]); // dane dla tabeli (paginowane)
    const [chartData, setChartData] = useState<Array<any>>([]); // dane dla wykresu (pełny zakres)

    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);

    const limit = 50;

    // Tworzymy zapytanie do API na podstawie filtrów
    function getQuery() {
        const typeParam = type === 'all' ? '' : `&type=${type}`;
        if (range) return `range=${range}${typeParam}`;
        if (from && to) return `from=${from}&to=${to}${typeParam}`;
        return typeParam ? typeParam.slice(1) : '';
    }

    // Fetch danych do tabeli (paginowane)
    async function fetchData(pageNum = 1) {
        setLoading(true);
        try {
            const query = getQuery();
            const res = await fetch(
                `http://localhost:3000/history?${query}&page=${pageNum}&limit=${limit}`
            );
            const json = await res.json();
            setData(json.data ?? []);
            setTotalPages(json.pages || 1);
        } finally {
            setLoading(false);
        }
    }

    // Fetch danych do wykresu (pełny trend)
    async function fetchChartData() {
        try {
            const query = getQuery();
            console.log(query)
            const res = await fetch(
                `http://localhost:3000/history?${query}&isChart=true`
            );
            const json = await res.json();
            setChartData(json.data ?? []);
        } catch (err) {
            console.error(err);
            setChartData([]);
        }
    }

    console.log(chartData)



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
    }

    // Fetch danych przy zmianie filtrów lub strony tabeli
    useEffect(() => {
        fetchData(page);
        fetchChartData();
    }, [range, from, to, type, page]);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-semibold text-gray-800">History</h1>
            <p className="text-gray-500 mt-1 mb-6">
                Explore historical environmental sensor data
            </p>

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
                <div className="flex justify-end gap-2">
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
                    showTemp={data.some(r => r.temperature != null)}
                    showHum={data.some(r => r.humidity != null)}
                    showPress={data.some(r => r.air_pressure != null)}
                    showAQ={data.some(r => r.air_quality != null)}
                />
            ) : (
                <>
                    <Results
                        data={data}
                        page={page}
                        totalPages={totalPages}
                        onPrev={() => setPage(prev => Math.max(1, prev - 1))}
                        onNext={() => setPage(prev => Math.min(totalPages, prev + 1))}
                    />
                    {!loading && data.length > 0 && <HistoryChart data={chartData} />}

                </>
            )}
        </div>
    );
}

// Funkcja eksportu CSV
function exportToCSV(data: Array<any>, filename = 'history.csv') {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','),
        ...data.map(row =>
            headers
                .map(header => {
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