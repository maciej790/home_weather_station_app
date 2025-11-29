import { createFileRoute } from '@tanstack/react-router'
import ProtectedRoute from '@/components/ProtectedRoute'


export const Route = createFileRoute('/account')({
    component: () => (
        <ProtectedRoute>
            <Account />
        </ProtectedRoute>
    ),
})
function Account() {
    return <div >Hello "/account"!</div>
}



