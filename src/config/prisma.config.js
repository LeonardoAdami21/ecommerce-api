import { PrismaClient } from "@prisma/client";

const prismaConfig = () => {
  try {
    const prisma = new PrismaClient();
    return prisma;
  } catch (error) {
    throw new Error(error);
  }
};

export default prismaConfig;
