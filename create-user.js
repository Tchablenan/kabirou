
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "kdjantchiemo@gmail.com";
  const password = "Meinoussa2.0";
  
  console.log("Checking for existing user...");
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingUser) {
    console.log("Creating admin user...");
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Kabirou Djantchiemo",
        password: hashedPassword,
        professionalTitleFr: "Développeur Web & Mobile",
        professionalTitleEn: "Web & Mobile Developer",
        aboutFr: "Développeur passionné par la création d'applications web et mobiles innovantes.",
        aboutEn: "Developer passionate about creating innovative web and mobile applications.",
      },
    });
    console.log("Admin user created successfully.");
  } else {
    console.log("Admin user already exists. Updating password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email: adminEmail },
      data: { password: hashedPassword }
    });
    console.log("Password updated successfully.");
  }
}

main()
  .catch((e) => {
    console.error("Error creating user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
