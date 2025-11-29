import { createFileRoute } from '@tanstack/react-router'





import ProtectedRoute from '@/components/ProtectedRoute'





export const Route = createFileRoute('/settings')({
    component: () => (
        <ProtectedRoute>
            <Settings />
        </ProtectedRoute>
    ),
})

function Settings() {
    return <div >Hello "/settings"!</div>
}

