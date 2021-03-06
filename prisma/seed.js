const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
async function main () {
/*   const alice = await prisma.user.create({
    data: {
      email: 'aliceac@repdla.io',
      name: 'Bonga',
      password: 'password',
      reviews: {
        create: {
          title: 'Check out Prisma with Next.js',
          content: 'https://www.prisma.io/nextjs',
          published: true
        }
      }

    }
  })

  const bob = await prisma.user.create({
    data: {
      email: 'munica@munich.se',
      name: 'Pandinton',
      password: 'password',
      reviews: {
        create: [
          {
            title: 'Muca nuca dålig',
            content: 'han är riktig dålig -rep ',
            published: true
          },
          {
            title: 'Follow Nexus on Twitter',
            content: 'Twitter hor naccas'
          }

        ]
      }
    }
  }) */
  /*   for (let i = 0; i < Mycompanys.length; i++) {
    await prisma.company.create({
      data:Mycompanys[i]
    })
  }
  for (let i = 0; i < Myrealtors.length; i++) {
    await prisma.realtors.createMany({
  data:Myrealtors[i]

    })
  } */

  const realtos = await prisma.company.findMany({ select: { name: true, id: true } })

  for (let i = 0; i < realtos.length; i++) {
    await prisma.realtors.updateMany({
      where: {
        faction: {
          contains: realtos[i].name
        }
      },
      data: {
        companyId: realtos[i].id,
        companyName: realtos[i].name
      }

    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
