import { createFileRoute } from '@tanstack/react-router'
import { CalendarSync, CloudOff } from 'lucide-react'
import SensorDataCard from '@/components/SensorDataCard/SensorDaraCard'
import SkeletonCard from '@/components/SkeletonLoaders/SkeletonCard'
import SkeletonLastUpdate from '@/components/SkeletonLoaders/SkeletonLastUpdate'
import SkeletonChart from '@/components/SkeletonLoaders/SkeletonChart'
import { useWebSocket } from '@/context/WebSocketContext'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { data, loading, error } = useWebSocket()

  return (
    <div className="bg-gray-50 px-10">
      <script src="https://cdn.tailwindcss.com"></script>
      {/* Load Inter font for aesthetics */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap'); .font-sans{font-family:'Inter', sans-serif;}`}</style>

      {/* 🔸 Pasek z ostatnią aktualizacją */}
      <div className="flex justify-end mb-6">
        {!loading && !error && data && (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm">
            <CalendarSync className="w-4 h-4 text-blue-500" />
            <span className="text-gray-500">Last update:</span>
            <span className="font-medium text-gray-800">
              {new Date(data.timestamp || Date.now()).toLocaleString('pl-PL')}
            </span>
          </div>
        )}
        {loading && (
          <SkeletonLastUpdate />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* 🔸 Kolumna 1 — dane z sensora (Grid 1x2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* RENDEROWANIE SKELETONÓW KART */}
          {loading && (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}

          {/* RENDEROWANIE DANYCH KART */}
          {!loading && !error && data && (
            <>
              <SensorDataCard type="temperature" value={data.temperature} />
              <SensorDataCard type="humidity" value={data.humidity} />
              <SensorDataCard type="pressure" value={data.pressure} />
              <SensorDataCard type="airQualityVoltage" value={data.voltage} />
            </>
          )}
        </div>

        {/* 🔸 Kolumna 2 — wykresy (Grid 1x2, z pierwszym elementem rozciągniętym na 2 kolumny) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* RENDEROWANIE SKELETONÓW WYKRESÓW */}
          {loading && (
            <>
              {/* Wykres 1 - Duży: h-48, sm:col-span-2 */}
              <SkeletonChart heightClass="h-40" spanClass="sm:col-span-2" />
              {/* Wykres 2 - Mały: h-40, sm:col-span-1 */}
              <SkeletonChart heightClass="h-40" spanClass="sm:col-span-1" />
              {/* Wykres 3 - Mały: h-40, sm:col-span-1 */}
              <SkeletonChart heightClass="h-40" spanClass="sm:col-span-1" />
            </>
          )}

          {/* WYKRES 1: Temperatura (Duży) */}
          {!loading && !error && data && (
            <>
              <div className="h-40 bg-white rounded-xl border border-gray-200 shadow-sm sm:col-span-2 flex items-center justify-center font-medium text-gray-700">
                Wykres: Temperatura
              </div>
              {/* WYKRES 2: Wilgotność (Mały) */}
              <div className="h-40 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-center font-medium text-gray-700">
                Wykres: Wilgotność
              </div>
              {/* WYKRES 3: Ciśnienie (Mały) */}
              <div className="h-40 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-center font-medium text-gray-700">
                Wykres: Ciśnienie
              </div>
            </>
          )}
        </div>
      </div>
      {error && !loading && (
        <>
          <div>
            <CloudOff className="w-16 h-16 text-red-500 mx-auto" />
            <p className="text-center text-red-600 font-medium mt-4">
              {error}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default App
