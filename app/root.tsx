import { cssBundleHref } from '@remix-run/css-bundle'
import { json, type LinksFunction } from '@remix-run/node'
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react'
import tailwindStyleSheetUrl from './styles/tailwind.css'
import { getEnv } from './utils/env.server'

export const links: LinksFunction = () => {
	return [
		// Preload CSS as a resource to avoid render blocking
		{ rel: 'preload', href: tailwindStyleSheetUrl, as: 'style' },
		cssBundleHref ? { rel: 'preload', href: cssBundleHref, as: 'style' } : null,
		{ rel: 'stylesheet', href: tailwindStyleSheetUrl },
		cssBundleHref ? { rel: 'stylesheet', href: cssBundleHref } : null,
	].filter(Boolean)
}

export function loader() {
	return json({
		ENV: getEnv(),
	})
}

function Document({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' className='h-full overflow-x-hidden'>
			<head>
				<Meta />
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width,initial-scale=1' />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}

export default function App() {
	return (
		<Document>
			<Outlet />
		</Document>
	)
}
