import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/account')({
    component: Account,
})

function Account() {
    return <div className="mt-[100px] ml-72 p-6 text-amber-500 text-xl font-semibold">Hello "/account"!</div>
}
