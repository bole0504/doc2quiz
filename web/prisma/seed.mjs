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
const userEmail = process.env.APP_SEED_USER_EMAIL ?? "user@example.com";
const userPassword = process.env.APP_SEED_USER_PASSWORD ?? "user123";

async function main() {
  const [adminHash, userHash] = await Promise.all([
    bcrypt.hash(adminPassword, 12),
    bcrypt.hash(userPassword, 12),
  ]);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: adminHash, role: "ADMIN" },
    create: { email: adminEmail, passwordHash: adminHash, role: "ADMIN" },
  });

  await prisma.user.upsert({
    where: { email: userEmail },
    update: { passwordHash: userHash, role: "USER" },
    create: { email: userEmail, passwordHash: userHash, role: "USER" },
  });

  await prisma.category.upsert({
    where: { slug: "general" },
    update: {},
    create: { slug: "general", name: "General" },
  });

  console.log(`Seeded admin: ${adminEmail} (password: ${adminPassword})`);
  console.log(`Seeded user:  ${userEmail} (password: ${userPassword})`);
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
