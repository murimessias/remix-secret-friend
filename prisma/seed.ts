import { faker } from '@faker-js/faker'
import { UniqueEnforcer } from 'enforce-unique'
import { prisma } from '#app/utils/db.server.ts'

const uniqueNicknameEnforcer = new UniqueEnforcer()

export function createUser() {
	const firstName = faker.person.firstName()
	const lastName = faker.person.lastName()

	const nickname = uniqueNicknameEnforcer
		.enforce(() => {
			return (
				faker.string.alphanumeric({ length: 2 }) +
				'_' +
				faker.internet.userName({
					firstName: firstName.toLowerCase(),
					lastName: lastName.toLowerCase(),
				})
			)
		})
		.slice(0, 20)
		.toLowerCase()
		.replace(/[^a-z0-9_]/g, '_')

	return {
		name: `${firstName} ${lastName}`,
		nickname,
	}
}

async function seed() {
	console.log('🌱 Seeding...')
	console.time(`🌱 Database has been seeded`)

	console.time('🧹 Cleaned up the database...')
	await prisma.user.deleteMany()
	console.timeEnd('🧹 Cleaned up the database...')

	const totalUsers = 6
	console.time(`👤 Created ${totalUsers} users...`)
	for (let index = 0; index < totalUsers; index++) {
		const userData = createUser()

		await prisma.user.create({
			select: {
				id: true,
			},
			data: {
				...userData,
				wishlist: {
					create: Array.from({
						length: faker.number.int({ min: 1, max: 5 }),
					}).map(() => ({
						title: faker.commerce.productName(),
						url: faker.internet.url(),
					})),
				},
			},
		})
	}
	console.timeEnd(`👤 Created ${totalUsers} users...`)

	console.time(`👋🏾 Created user "Murilo Messias"`)
	await prisma.user.create({
		data: {
			name: 'Murilo Messias',
			nickname: 'Muri',
			wishlist: {
				create: {
					title: 'Product',
					url: 'https://www.google.com',
				},
			},
		},
	})
	console.timeEnd(`👋🏾 Created user "Murilo Messias"`)

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
