import { createFileRoute } from '@tanstack/react-router'
import { CalendarSync } from 'lucide-react';
import SensorDataCard from '@/components/SensorDataCard/SensorDaraCard'
import SkeletonLoader from '@/components/SensorDataCard/SkeletonLoader'
import { useWebSocket } from '@/context/WebSocketContext'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { data, loading, error, connected } = useWebSocket()

  console.log(connected)

  return (
    <div className="bg-gray-50 p-10 ">
      <div className="flex justify-end mb-6">
        {data && (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm">
            <CalendarSync className="w-4 h-4 text-blue-500" />
            <span className="text-gray-500">Last update:</span>
            <span className="font-medium text-gray-800">
              {new Date(data.timestamp || Date.now()).toLocaleString('pl-PL')}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {!loading && error && (
            <div className="col-span-full text-red-500 font-bold flex items-center justify-center bg-red-100 rounded-xl h-40 shadow-lg">
              ❌ {error}
            </div>
          )}

          {loading && !data && (
            <>
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
            </>
          )}

          {!loading && !error && data && (
            <>
              <SensorDataCard data={`🌡️ Temperatura: ${data.temperature} °C`} />
              <SensorDataCard data={`💧 Wilgotność: ${data.humidity} %`} />
              <SensorDataCard data={`🧭 Ciśnienie: ${data.pressure} hPa`} />
              <SensorDataCard data={`💨 Jakość powietrza: ${data.airQuality}`} />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="h-40 bg-green-200 rounded-xl p-10 shadow-lg sm:col-span-2 flex items-center justify-center font-bold text-green-800">
            Kafel 7 (Pełna szerokość)
          </div>
          <div className="h-40 bg-green-200 rounded-xl p-10 shadow-lg flex items-center justify-center font-bold text-green-800">
            Kafel 5 (50%)
          </div>
          <div className="h-40 bg-green-200 rounded-xl p-10 shadow-lg flex items-center justify-center font-bold text-green-800">
            Kafel 6 (50%)
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
