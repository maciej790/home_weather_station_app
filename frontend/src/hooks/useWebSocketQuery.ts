import { useEffect, useRef, useState } from 'react'

export interface SensorData {
    temperature: number
    humidity: number
    pressure: number
    airQuality: string
    timestamp: string
    voltage: number
}

export interface SensorHistoryItem {
    time: string
    temperature: number
    humidity: number
    pressure: number
}

export function useWebSocketQuery(url: string) {
    const [data, setData] = useState<SensorData | null>(null)
    const [connected, setConnected] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [history, setHistory] = useState<Array<SensorHistoryItem>>([])

    const wsRef = useRef<WebSocket | null>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const reconnectRef = useRef<NodeJS.Timeout | null>(null)
    const hasEverConnected = useRef(false)
    const lastMessageTime = useRef<number>(0)

    const resetTimeout = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setInterval(() => {
            if (hasEverConnected.current && Date.now() - lastMessageTime.current > 10000) {
                setError('Brak danych z serwera WebSocket - sprawdź połączenie.')
                setLoading(false)
            }
        }, 3000)
    }

    useEffect(() => {
        function connect() {
            const ws = new WebSocket(url)
            wsRef.current = ws

            ws.onopen = () => {
                console.log('✅ WebSocket połączony')
                hasEverConnected.current = true
                setConnected(true)
                setLoading(true)
                setError(null)
                lastMessageTime.current = Date.now()
                resetTimeout()
            }

            ws.onmessage = (event) => {
                try {
                    const msg = JSON.parse(event.data)
                    if (msg.type === 'sensor_update') {
                        const newData: SensorData = { ...msg.payload, timestamp: msg.timestamp }

                        setData(newData)
                        setHistory((prev) => [
                            ...prev.slice(-49),
                            {
                                time: newData.timestamp,
                                temperature: newData.temperature,
                                humidity: newData.humidity,
                                pressure: newData.pressure,
                            },
                        ])

                        lastMessageTime.current = Date.now()
                        setError(null)
                        setLoading(false)
                    }
                } catch {
                    console.warn('⚠️ Nieprawidłowe dane z serwera.')
                }
            }

            ws.onerror = () => {
                setConnected(false)
                if (hasEverConnected.current) {
                    setError('Błąd połączenia z serwerem WebSocket.')
                }
            }

            ws.onclose = () => {
                console.log('❌ Połączenie WebSocket zamknięte')
                setConnected(false)
                setLoading(false)

                if (timeoutRef.current) clearInterval(timeoutRef.current)

                if (hasEverConnected.current) {
                    setError('Połączenie WebSocket zostało zamknięte.')
                }

                if (!reconnectRef.current) {
                    reconnectRef.current = setTimeout(() => {
                        reconnectRef.current = null
                        connect()
                    }, 5000)
                }
            }
        }

        connect()

        return () => {
            if (wsRef.current) wsRef.current.close()
            if (timeoutRef.current) clearInterval(timeoutRef.current)
            if (reconnectRef.current) clearTimeout(reconnectRef.current)
        }
    }, [url])

    return { data, connected, loading, error, history }
}
