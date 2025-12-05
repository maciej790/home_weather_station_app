import { createFileRoute, useLocation } from '@tanstack/react-router'
import {
  CalendarSync,
  CloudOff,
  Droplet,
  Gauge,
  Thermometer,
  WindArrowDown,
} from 'lucide-react'

import { useEffect, useMemo } from 'react'
import SensorDataCard from '@/components/SensorDataCard/SensorDataCard'
import SensorChartCard from '@/components/SensorChartCard/SensorChartCard'
import SkeletonCard from '@/components/SkeletonLoaders/SkeletonCard'
import SkeletonLastUpdate from '@/components/SkeletonLoaders/SkeletonLastUpdate'
import SkeletonChart from '@/components/SkeletonLoaders/SkeletonChart'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useWebSocket } from '@/context/WebSocketContext'
import { useElevation } from '@/hooks/useElevation'
import { useNormStatus } from '@/hooks/useNormStatus'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/')({
  component: () => (
    <ProtectedRoute>
      <App />
    </ProtectedRoute>
  ),
})

function App() {
  const { data, loading, error } = useWebSocket()
  const { elevation } = useElevation()
  const { SENSOR_NORMS, getNormStatus } = useNormStatus();
  const { user } = useAuth()



  const processedData = useMemo(() => {
    if (!data) return null;
    if (!elevation) return null; // czekamy na wyliczenie elewacji

    return {
      ...data,

      // temperatura, wilgotność i napięcie BEZ zmian
      temperature: Number(data.temperature.toFixed(1)),
      humidity: Math.round(data.humidity),
      voltage: Number((data.voltage * 100).toFixed(0)),

      // 🔽 Oryginalne ciśnienie (BME280)
      pressure: Number(data.pressure.toFixed(0)),

      // 🔥 Nowe pole – ciśnienie zredukowane do poziomu morza (QNH)
      pressureQNH: Number(
        (data.pressure / Math.pow(1 - elevation / 44330, 5.255)).toFixed(1)
      ),
    };
  }, [data, elevation]);


  useEffect(() => {
    if (!processedData) return;

    const alerts = [];

    const checks = [
      { key: 'temperature', value: processedData.temperature, norm: SENSOR_NORMS.temperature },
      { key: 'humidity', value: processedData.humidity, norm: SENSOR_NORMS.humidity },
      { key: 'pressure', value: processedData.pressureQNH, norm: SENSOR_NORMS.pressure },
      { key: 'airQualityVoltage', value: processedData.voltage / 100, norm: SENSOR_NORMS.airQualityVoltage },
    ];

    checks.forEach(({ key, value, norm }) => {
      if (value != null && norm) {
        const status = getNormStatus(value, norm);
        if (status === 'critical') {
          alerts.push({
            sensor: key,
            value,
            status,
            timestamp: processedData.timestamp,
          });
        }
      }
    });

    if (alerts.length > 0) {
      fetch('http://localhost:3000/alerts/send_alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // <- Twój token JWT lub inny
        },
        // user.user.userId
        body: JSON.stringify({ alerts }), // wysyłamy wszystkie w jednym body
      }).catch(() => { });
    }
  }, [processedData, SENSOR_NORMS, getNormStatus]);



  return (
    <div className="bg-gray-50 py-6 px-10">
      {/* 🔸 Pasek z ostatnią aktualizacją */}
      <div className="flex justify-between items-center mb-6">
        {!loading && data && (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm">
            <CalendarSync className="w-4 h-4 text-blue-500" />
            <span className="text-gray-500">Last reading:</span>
            <span className="font-medium text-gray-800">
              {new Date(data.timestamp).toLocaleString('pl-PL')}
            </span>
          </div>
        )}
        {loading && <SkeletonLastUpdate />}
      </div>

      {/* 🔸 4 kafelki z danymi */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {(loading || !data) && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
        {!loading && data && (
          <>
            <SensorDataCard
              type="temperature"
              value={data.temperature}
              icon={Thermometer}
            />
            <SensorDataCard type="humidity" value={data.humidity} icon={Droplet} />
            <SensorDataCard type="pressure" value={processedData?.pressureQNH} icon={Gauge} />
            <SensorDataCard
              type="airQualityVoltage"
              value={data.voltage}
              icon={WindArrowDown}
            />
          </>
        )}
      </div>

      {/* 🔸 Wykresy */}
      {(loading || !data) && (
        <div className="grid grid-cols-3 gap-6 auto-rows-fr min-h-[500px]">
          {/* Duży skeleton */}
          <div className="col-span-2 row-span-2">
            <SkeletonChart heightClass="h-full" />
          </div>
          {/* Dwa mniejsze skeletony */}
          <SkeletonChart heightClass="h-[300px]" />
          <SkeletonChart heightClass="h-[300px]" />
        </div>
      )}

      {!loading && data && (
        <div className="grid grid-cols-2 gap-6 min-h-[300px]">

          {/* Wykres temperatury */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col min-h-[300px]">
            <SensorChartCard
              type="temperature"
              value={data.temperature}
              unit="°C"
              time={data.timestamp}
            />
          </div>

          {/* Wykres wilgotności */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col min-h-[300px]">
            <SensorChartCard
              type="humidity"
              value={data.humidity}
              unit="%"
              time={data.timestamp}
            />
          </div>

          {/* 

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col min-h-[300px]">
            <SensorChartCard
              type="pressure"
              unit="hPa"
              valueKey="pressureQNH"  // wykres korzysta z przeliczonego ciśnienia
              time={processedData?.timestamp}
            />
          </div> */}



        </div>

      )}

      {/* 🔸 Komunikat błędu */}
      {/* {error && !loading && (
        <div className="mt-12 text-center">
          <CloudOff className="w-16 h-16 text-red-500 mx-auto" />
          <p className="text-red-600 font-semibold mt-4">{error}</p>
          <p className="text-gray-500 mt-1 text-sm">
            Sprawdź połączenie z serwerem lub siecią Wi-Fi.
          </p>
        </div>
      )} */}
    </div>
  )
}

export default App
