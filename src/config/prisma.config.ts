export const prismaConfig = () => ({
  prisma: {
    client: 'mysql',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
});
