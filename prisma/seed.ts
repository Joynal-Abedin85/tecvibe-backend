import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Super Admin...");

  const email = "superadmin@example.com"; // default email
  const password = "SuperAdmin123"; // default password

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create super admin user if not exists
  const superAdmin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Super Admin",
      email,
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  console.log("✅ Super Admin created successfully:");
  console.log({
    email: superAdmin.email,
    password: password,
  });
}

main()
  .then(() => {
    console.log("🌱 Seeding complete");
    prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
