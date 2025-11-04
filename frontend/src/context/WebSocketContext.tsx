// src/context/WebSocketContext.tsx
import React, { createContext, useContext } from 'react'
import { useWebSocketQuery } from '@/hooks/useWebSocketQuery'

const WS_URL = 'ws://127.0.0.1:3000'

const WebSocketContext = createContext<ReturnType<typeof useWebSocketQuery> | null>(null)

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const wsState = useWebSocketQuery(WS_URL)
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
