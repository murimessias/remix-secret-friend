import { prisma } from '#app/utils/db.server.ts'

async function seed() {
	console.log('🌱 Seeding...')
	console.time(`🌱 Database has been seeded`)

	console.time('🧹 Cleaned up the database...')
	await prisma.user.deleteMany()
	console.timeEnd('🧹 Cleaned up the database...')

	console.time(`🐨 Created user "Murilo Messias"`)
	await prisma.user.create({
		data: {
			name: 'Murilo Messias',
			nickname: 'Muri',
			wishlist: {
				create: {
					title: 'New Remix App',
					url: 'https://remix.run',
				},
			},
		},
	})
	console.timeEnd(`🐨 Created user "Murilo Messias"`)

	console.timeEnd(`🌱 Database has been seeded`)
}

seed()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
