import path from 'path'

const prettify = (filenames) =>
	`prettier --write ${filenames
		.map((f) => path.relative(process.cwd(), f))
		.join(' ')}`

const lint = (filenames) =>
	`eslint --fix ${filenames
		.map((f) => path.relative(process.cwd(), f))
		.join(' ')}`

const config = {
	'app/**/*.{ts,tsx}': [() => 'npm run typecheck', prettify, lint],
}

export default config
