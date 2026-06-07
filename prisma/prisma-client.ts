import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DIRECT_URL or DATABASE_URL for Prisma seed.");
}

const adapter = new PrismaPg({ connectionString });

export function createSeedPrismaClient() {
  return new PrismaClient({ adapter });
}
