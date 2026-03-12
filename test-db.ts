import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log("Attempting to connect to database...");
  try {
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log("Connection successful!", result);
  } catch (err) {
    console.error("Connection failed!", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
