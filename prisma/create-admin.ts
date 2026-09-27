import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL et ADMIN_PASSWORD doivent être définis dans l'environnement.");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log(`Creating admin user: ${email}...`);

  await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: {
      email,
      password: hashedPassword,
      name: "Kabirou Djantchiemo",
    },
  });

  console.log("Admin user created/updated successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
