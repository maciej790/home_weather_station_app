import { useEffect, useState } from 'react';

export function useWebSocketQuery(url: string) {
    const [data, setData] = useState<any>(null);
    const [connected, setConnected] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true); 
        setError(null);

        const ws = new WebSocket(url);
        
        ws.onopen = () => { 
            console.log('✅ Połączono z WebSocketem');
            setConnected(true);
            setError(null);
        }

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message.type === 'sensor_update') {
                    setData({
                        ...message.payload,
                        timestamp: message.timestamp,
                    });
                    
                    if (loading) {
                        setLoading(false);
                    }
                }
            } catch (err) {
                console.error('Błąd parsowania danych:', err);
                setError('Błąd parsowania danych: Otrzymano nieprawidłowy format JSON.');
            }
        }
        
        ws.onerror = (e) => {
            console.error('⚠️ Wystąpił błąd WebSocket:', e);
            setError('Błąd połączenia WebSocket. Sprawdź adres i serwer.');
            setLoading(false);
            setConnected(false);
        }

        ws.onclose = () => {
            console.warn('❌ Rozłączono z WebSocketem');
            setConnected(false);
            setLoading(false);
        }

        return () => {
            ws.close();
            setConnected(false);
            setLoading(true);
        }
    }, [url]);

    return { data, connected, loading, error }; 
}