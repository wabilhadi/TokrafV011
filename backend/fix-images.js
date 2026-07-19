const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixImages() {
  const products = await prisma.product.findMany({ include: { images: true } });
  for (const p of products) {
    if (!p.imageUrl && p.images && p.images.length > 0) {
      await prisma.product.update({
        where: { id: p.id },
        data: { imageUrl: p.images[0].url }
      });
      console.log('Fixed image for', p.name);
    }
  }
}

fixImages().then(() => prisma.$disconnect()).catch(console.error);
