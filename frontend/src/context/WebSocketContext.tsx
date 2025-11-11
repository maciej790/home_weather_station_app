// src/context/WebSocketContext.tsx
import React, { createContext, useContext } from 'react'
import type { SensorData } from '@/hooks/useWebSocketQuery';
import { useWebSocketQuery } from '@/hooks/useWebSocketQuery'

interface SensorHistoryItem {
    time: string
    temperature: number
    humidity: number
    pressure: number
}

export interface WebSocketState {
    data: SensorData | null
    connected: boolean
    loading: boolean
    error: string | null
    history: Array<SensorHistoryItem>
}

const WebSocketContext = createContext<WebSocketState | null>(null)

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const wsState = useWebSocketQuery('ws://127.0.0.1:3000')
    return (
        <WebSocketContext.Provider value={wsState}>
            {children}
        </WebSocketContext.Provider>
    )
}

export const useWebSocket = () => {
    const ctx = useContext(WebSocketContext)
    if (!ctx) throw new Error('useWebSocket must be used inside WebSocketProvider')
    return ctx
}
