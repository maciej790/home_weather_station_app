import { createFileRoute } from '@tanstack/react-router'
import { useWebSocketQuery } from '@/hooks/useWebSocketQuery'

export const Route = createFileRoute('/')({
  component: App,
})

const WS_URL = 'ws://localhost:3000'

function App() {
  const { data, connected, loading, error } = useWebSocketQuery(WS_URL)

  let statusMessage = "Oczekiwanie na dane z czujników...";

  if (loading) {
    statusMessage = "Łączenie i oczekiwanie na pierwszy pakiet danych...";
  } else if (error) {
    statusMessage = `🚨 Błąd: ${error}. Spróbuj ponownie.`;
  }

  const isDataAvailable = data && Object.keys(data).length > 0;

  return (
    <div className=" min-h-screen flex flex-col items-center justify-center bg-gray-50 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">📡 Sensor Dashboard</h1>

      {/* Wskaźnik Połączenia */}
      <div
        className={`mb-6 px-4 py-2 rounded-full font-semibold ${connected ? 'bg-green-600' : 'bg-red-600'
          }`}
      >
        {connected ? 'Połączono z serwerem' : 'Brak połączenia'}
      </div>

      {isDataAvailable ? (
        <div className="bg-white text-black rounded-2xl shadow-xl p-6 w-[90%] max-w-md">
          {Object.entries(data).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between py-2 border-b border-gray-200 last:border-b-0"
            >
              <span className="font-semibold capitalize">{key}</span>
              <span className="font-mono text-gray-700">{String(value)}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className={`text-gray-300 ${error ? 'text-red-400' : ''}`}>
          {statusMessage}
        </p>
      )}
    </div>
  )
}
