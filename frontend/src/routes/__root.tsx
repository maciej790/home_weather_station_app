import { Outlet, createRootRoute } from '@tanstack/react-router'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import SideBar from '@/components/SideBar/SideBar'
import Header from '@/components/Header/Header'
import { WebSocketProvider } from '@/context/WebSocketContext'

export const Route = createRootRoute({
  component: Root,
})

function Root() {
  return (
    <AuthProvider>
      <RootContent />
    </AuthProvider>
  )
}

function RootContent() {
  const { user } = useAuth()

  // 🔥 niezalogowany → tylko Outlet (login/register)
  if (!user) {
    return (
      <main className="min-h-screen">
        <Outlet />
      </main>
    )
  }

  // 🔥 zalogowany → layout z WebSocketProvider
  return (
    <WebSocketProvider>
      <SideBar />
      <Header />
      <main className="ml-64 pt-24 min-h-screen">
        <Outlet />
      </main>
    </WebSocketProvider>
  )
}
