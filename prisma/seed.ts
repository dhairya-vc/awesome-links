import { PrismaClient } from "@prisma/client";
import { links as data } from "../data/links";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: `dhairya.vc@gmail.com`,
      role: "ADMIN",
    },
  });

  await prisma.link.createMany({
    data: data,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
