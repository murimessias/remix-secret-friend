import { cssBundleHref } from '@remix-run/css-bundle'
import {
	json,
	type LinksFunction,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from '@remix-run/react'
import { AuthenticityTokenProvider } from 'remix-utils/csrf/react'
import { HoneypotProvider } from 'remix-utils/honeypot/react'
import tailwindStyleSheetUrl from './styles/tailwind.css'
import { csrf } from './utils/csrf.server'
import { getEnv } from './utils/env.server'
import { honeypot } from './utils/honeypot.server'

export const links: LinksFunction = () => {
	return [
		// Preload CSS as a resource to avoid render blocking
		{ rel: 'preload', href: tailwindStyleSheetUrl, as: 'style' },
		cssBundleHref ? { rel: 'preload', href: cssBundleHref, as: 'style' } : null,
		{ rel: 'stylesheet', href: tailwindStyleSheetUrl },
		cssBundleHref ? { rel: 'stylesheet', href: cssBundleHref } : null,
	].filter(Boolean)
}

export async function loader({ request }: LoaderFunctionArgs) {
	const [csrfToken, csrfCookieHeader] = await csrf.commitToken(request)
	const honeyProps = honeypot.getInputProps()

	return json(
		{
			csrfToken,
			ENV: getEnv(),
			honeyProps,
		},
		{
			headers: {
				...(csrfCookieHeader ? { 'set-Cookie': csrfCookieHeader } : null),
			},
		},
	)
}

function Document({
	children,
	env,
}: {
	children: React.ReactNode
	env?: Record<string, string>
}) {
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
				<script
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(env)}`,
					}}
				/>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}

function App() {
	return (
		<Document>
			<Outlet />
		</Document>
	)
}

export default function AppWithProviders() {
	const data = useLoaderData<typeof loader>()

	return (
		<HoneypotProvider {...data.honeyProps}>
			<AuthenticityTokenProvider token={data.csrfToken}>
				<App />
			</AuthenticityTokenProvider>
		</HoneypotProvider>
	)
}
