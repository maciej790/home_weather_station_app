import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/account')({
    component: Account,
})

function Account() {
    return <div >Hello "/account"!</div>
}
