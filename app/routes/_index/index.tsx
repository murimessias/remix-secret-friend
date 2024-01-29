import { invariantResponse } from '@epic-web/invariant'
import { json, type MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
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
			wishes: {
				select: {
					title: true,
					url: true,
					id: true,
				},
			},
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
		<main>
			<h1 className='text-2xl font-bold'>Wishlist</h1>
			<div className='space-y-4'>
				{data.users.length > 0 ? (
					data.users.map((u) => (
						<div key={u.id}>
							<h3 className='text-lg'>
								<strong>{u.name}</strong>
							</h3>
							<div>
								{u.wishes.length > 0 ? (
									<ul>
										{u.wishes.map((w) => (
											<li
												key={w.url}
												className='group flex h-10 w-fit items-center gap-3'
											>
												<span>{w.title}</span>
												{w.url && (
													<a
														className='text-blue-600 hover:underline'
														href={w.url}
														target='_blank'
														rel='noreferrer'
														referrerPolicy='no-referrer'
													>
														{w.url}
													</a>
												)}
											</li>
										))}
									</ul>
								) : (
									<p>No wishlist</p>
								)}
							</div>
						</div>
					))
				) : (
					<p>No users</p>
				)}
			</div>
		</main>
	)
}
