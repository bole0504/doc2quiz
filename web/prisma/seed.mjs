import "dotenv/config";
import bcrypt from "bcryptjs";
import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { PrismaClient } = pkg;

const { Pool } = pg;

const prisma = new PrismaClient({
  adapter: new PrismaPg(
    new Pool({
      connectionString: process.env.DATABASE_URL,
    })
  ),
});

const adminEmail = process.env.APP_SEED_ADMIN_EMAIL ?? "admin@example.com";
const adminPassword = process.env.APP_SEED_ADMIN_PASSWORD ?? "admin123";
const userPhone = process.env.APP_SEED_USER_PHONE ?? "0900000001";
const userPassword = process.env.APP_SEED_USER_PASSWORD ?? "user123";

async function main() {
  const [adminHash, userHash] = await Promise.all([
    bcrypt.hash(adminPassword, 12),
    bcrypt.hash(userPassword, 12),
  ]);

  // Admin uses email (web login)
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: adminHash, role: "ADMIN" },
    create: {
      email: adminEmail,
      name: "Admin",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  // User uses phone (mobile + web login)
  await prisma.user.upsert({
    where: { phone: userPhone },
    update: { passwordHash: userHash, role: "USER" },
    create: {
      phone: userPhone,
      name: "User Demo",
      passwordHash: userHash,
      role: "USER",
    },
  });

  await prisma.category.upsert({
    where: { slug: "general" },
    update: {},
    create: { slug: "general", name: "General" },
  });

  console.log(`Seeded admin: ${adminEmail} / ${adminPassword}  (email login)`);
  console.log(`Seeded user:  ${userPhone}  / ${userPassword}   (phone login)`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
