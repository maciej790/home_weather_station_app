import { useEffect, useRef, useState } from 'react'

export interface SensorData {
    temperature: number
    humidity: number
    pressure: number
    airQuality: string
    timestamp: string
    voltage: number
}

export interface WebSocketState {
    data: SensorData | null
    connected: boolean
    loading: boolean
    error: string | null
}

export function useWebSocketQuery(url: string): WebSocketState {
    const [data, setData] = useState<SensorData | null>(null)
    const [connected, setConnected] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const wsRef = useRef<WebSocket | null>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const reconnectRef = useRef<NodeJS.Timeout | null>(null)
    const lastMessageTime = useRef<number>(0)
    const hasEverConnected = useRef<boolean>(false) // ✅ NOWA FLAGA

    useEffect(() => {
        function connect() {
            const ws = new WebSocket(url)
            wsRef.current = ws

            console.log('🔄 Łączenie z WebSocketem...')

            ws.onopen = () => {
                console.log('✅ Połączono z WebSocketem')
                hasEverConnected.current = true // ✅ zapamiętaj, że kiedyś się udało
                setConnected(true)
                setLoading(true)
                setError(null)
                lastMessageTime.current = Date.now()

                if (timeoutRef.current) clearTimeout(timeoutRef.current)
                timeoutRef.current = setInterval(() => {
                    if (Date.now() - lastMessageTime.current > 10000) {
                        setError('Brak danych z serwera (10s).')
                        setLoading(false)
                    }
                }, 3000)
            }

            ws.onmessage = (event) => {
                try {
                    const msg = JSON.parse(event.data)
                    if (msg.type === 'sensor_update') {
                        setData({ ...msg.payload, timestamp: msg.timestamp })
                        lastMessageTime.current = Date.now()
                        setError(null)
                        setLoading(false)
                    } else if (msg.type === 'welcome') {
                        console.log('👋 Serwer mówi:', msg.message)
                    } else {
                        console.log('📦 Inna wiadomość:', msg)
                    }
                } catch {
                    setError('Błąd parsowania danych z serwera.')
                }
            }

            ws.onerror = (err) => {
                console.error('⚠️ Błąd WebSocket:', err)
                setConnected(false)
                // ❗ Nie pokazuj błędu, jeśli to pierwsze połączenie jeszcze nie zdążyło się udać
                if (hasEverConnected.current) {
                    setError('Nie udało się połączyć z serwerem WebSocket.')
                }
            }

            ws.onclose = () => {
                console.log('❌ Połączenie WebSocket zakończone.')
                setConnected(false)
                setLoading(false)

                // ✅ Pokaż błąd tylko jeśli wcześniej było połączenie
                if (hasEverConnected.current) {
                    setError('Połączenie WebSocket zamknięte.')
                }

                if (timeoutRef.current) clearInterval(timeoutRef.current)

                if (!reconnectRef.current) {
                    reconnectRef.current = setTimeout(() => {
                        console.log('🔁 Próba ponownego połączenia...')
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

    return { data, connected, loading, error }
}
