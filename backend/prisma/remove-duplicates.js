const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Mencari produk duplikat...');
  
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' } // Keep the newest one
  });

  const seen = new Set();
  let deletedCount = 0;

  for (const product of products) {
    if (seen.has(product.name)) {
      // Duplicate found, delete it
      console.log(`Menghapus duplikat: ${product.name} (ID: ${product.id})`);
      await prisma.product.delete({
        where: { id: product.id }
      });
      deletedCount++;
    } else {
      seen.add(product.name);
    }
  }

  console.log(`Selesai! Berhasil menghapus ${deletedCount} produk duplikat.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
