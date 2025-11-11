import { createFileRoute } from '@tanstack/react-router'
import { CalendarSync, CloudOff, Droplet, Gauge, Thermometer, WindArrowDown } from 'lucide-react'
import SensorDataCard from '@/components/SensorDataCard/SensorDataCard'
import SensorChartCard from '@/components/SensorChartCard/SensorChartCard'
import SkeletonCard from '@/components/SkeletonLoaders/SkeletonCard'
import SkeletonLastUpdate from '@/components/SkeletonLoaders/SkeletonLastUpdate'
import SkeletonChart from '@/components/SkeletonLoaders/SkeletonChart'
import { useWebSocket } from '@/context/WebSocketContext'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { data, loading, error } = useWebSocket()
  console.log(error)
  console.log(loading)
  console.log(data)
  console.log('-----------------')

  return (
    <div className="bg-gray-50 py-6 min-h-screen px-6">
      {/* 🔸 Pasek z ostatnią aktualizacją */}
      <div className="flex justify-between items-center mb-6">
        {!loading && data && !error && (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm">
            <CalendarSync className="w-4 h-4 text-blue-500" />
            <span className="text-gray-500">Ostatnia aktualizacja:</span>
            <span className="font-medium text-gray-800">
              {new Date(data.timestamp).toLocaleString('pl-PL')}
            </span>
          </div>
        )}
        {loading && !error && (<SkeletonLastUpdate />)}


      </div>

      {/* 🔸 4 kafelki z danymi */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {loading && !error && (<>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>)}
        {!loading && data && !error && (
          <>
            <SensorDataCard type="temperature" value={data.temperature} icon={Thermometer} />
            <SensorDataCard type="humidity" value={data.humidity} icon={Droplet} />
            <SensorDataCard type="pressure" value={data.pressure} icon={Gauge} />
            <SensorDataCard type="airQualityVoltage" value={data.voltage} icon={WindArrowDown} />
          </>
        )}

      </div>

      {/* 🔸 Wykresy */}
      {!error && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 row-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-[500px]">
            {!loading && data ? (
              <SensorChartCard type="temperature" value={data.temperature} unit="°C" time={data.timestamp} />
            ) : (
              <SkeletonChart heightClass="h-full" spanClass="sm:col-span-2" />
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-[245px]">
            {!loading && data ? (
              <SensorChartCard type="humidity" value={data.humidity} unit="%" time={data.timestamp} />
            ) : (
              <SkeletonChart heightClass="h-full" spanClass="sm:col-span-1" />
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-[245px]">
            {!loading && data ? (
              <SensorChartCard type="pressure" value={data.pressure} unit="hPa" time={data.timestamp} />
            ) : (
              <SkeletonChart heightClass="h-full" spanClass="sm:col-span-1" />
            )}
          </div>
        </div>
      )}

      {/* 🔸 Komunikat błędu */}
      {error && !data && !loading && (
        <div className="mt-12 text-center">
          <CloudOff className="w-16 h-16 text-red-500 mx-auto" />
          <p className="text-red-600 font-semibold mt-4">{error}</p>
          <p className="text-gray-500 mt-1 text-sm">Sprawdź połączenie z serwerem lub siecią Wi-Fi.</p>
        </div>
      )}
    </div>
  )
}

export default App
