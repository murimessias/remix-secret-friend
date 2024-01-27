import { type MetaFunction } from '@remix-run/node'
import { Braces } from 'lucide-react'

export const meta: MetaFunction = () => {
	return [
		{ title: 'New Remix App' },
		{ name: 'description', content: 'Welcome to Remix!' },
	]
}

export default function Index() {
	return (
		<main className='grid h-screen content-center items-center justify-center gap-4 text-center'>
			<div>
				<div className='inline-flex items-center gap-1'>
					<Braces className='animate-pulse' />
					<h1 className='text-2xl font-bold'>Remix + Tailwindcss</h1>
				</div>
			</div>
		</main>
	)
}
