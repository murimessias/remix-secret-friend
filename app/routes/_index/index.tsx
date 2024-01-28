import { invariantResponse } from '@epic-web/invariant'
import { json, type MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Braces } from 'lucide-react'
import { prisma } from '#app/utils/db.server'

export const meta: MetaFunction = () => {
	return [
		{ title: 'New Remix App' },
		{ name: 'description', content: 'Welcome to Remix!' },
	]
}

export async function loader() {
	const users = await prisma.user.findMany({
		select: {
			id: true,
			name: true,
			nickname: true,
		},
	})

	invariantResponse(users, 'Users not found', { status: 404 })

	return json({
		users,
	})
}

export default function Index() {
	const data = useLoaderData<typeof loader>()

	return (
		<main className='grid h-screen content-center items-center justify-center gap-4 text-center'>
			<div className='space-y-4'>
				<div className='flex items-center gap-1'>
					<Braces className='animate-pulse' />
					<h1 className='text-2xl font-bold'>Remix + Tailwindcss</h1>
				</div>
				<div>
					<h2 className='text-muted-foreground'>Prisma Basic Data</h2>
					{data.users.length === 0 ? (
						'No users found'
					) : (
						<div>
							<div className='space-y-0.5'>
								{data.users.map((u) => (
									<p key={u.id}>{u.nickname ?? u.name}</p>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</main>
	)
}
