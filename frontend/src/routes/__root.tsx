import { Outlet, createRootRoute } from '@tanstack/react-router'
import SideBar from '@/components/SideBar/SideBar'
import Header from '@/components/Header/Header'
import { WebSocketProvider } from '@/context/WebSocketContext'
// import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
// import { TanStackDevtools } from '@tanstack/react-devtools'

export const Route = createRootRoute({
  component: () => (
    <WebSocketProvider>
      <SideBar />
      <Header />
      <main className="flex items-center justify-center min-h-screen bg-gray-50 ml-64 pt-24">
        <Outlet />
      </main>
      {/* <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      /> */}
    </WebSocketProvider>
  ),
})
