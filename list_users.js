const { PrismaClient } = require("./node_modules/@prisma/client");

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log("Checking for users...");
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true
      }
    });
    console.log("Users found:", JSON.stringify(users, null, 2));
  } catch (err) {
    console.error("Query failed!", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
