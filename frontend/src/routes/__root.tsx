import { Outlet, createRootRoute } from '@tanstack/react-router'
import SideBar from '@/components/SideBar/SideBar'
import Header from '@/components/Header/Header'
// import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
// import { TanStackDevtools } from '@tanstack/react-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <SideBar />
      <Header />
      <Outlet />
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
    </>
  ),
})
