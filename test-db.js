const { PrismaClient } = require("./node_modules/@prisma/client");

const prisma = new PrismaClient({
  datasourceUrl: "postgresql://postgres.seowehsfdtbolakosopf:Meinoussa2.0@aws-1-eu-central-1.pooler.supabase.com:5432/postgres",
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
