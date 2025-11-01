import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/history')({
    component: History,
})

function History() {
    return (
        <div className="mt-[100px] ml-72 p-6 text-amber-500 text-xl font-semibold">
            Hello from /history 👋
        </div>
    )
}
