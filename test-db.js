const { PrismaClient } = require("./node_modules/@prisma/client");

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log("Attempting to connect to database (CJS)...");
  try {
    const result = await prisma.$queryRaw`SELECT 1 as result`;
    console.log("Connection successful!", result);
  } catch (err) {
    console.error("Connection failed!", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
