const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Menambahkan produk Konveksi baru...');

  // Helper to stringify options
  const opt = (arr) => JSON.stringify(arr);

  // 1. ROMPI VEST
  await prisma.product.create({
    data: {
      name: 'Rompi Vest Custom',
      description: 'Rompi Vest custom dengan bahan berkualitas, cocok untuk instansi, organisasi, atau event. Minimum order 12 pcs. Bordir maksimal A4 Non Blok.',
      divisi: 'KONVEKSI',
      price: 185000,
      minOrder: 12,
      imageUrl: '/placeholder-vest.jpg',
      specifications: '- Bordir Mak. A4 Non Blok\n- Harga 12-80 pcs: Taslan Jin+Dakron 4mm (Rp188.000), Taslan JN+Dakron 10mm (Rp208.000)\n- Harga >80 pcs: Taslan Jin+Dakron 4mm (Rp185.000), Taslan JN+Dakron 10mm (Rp206.000)',
      isRecommended: true,
      options: {
        create: [
          { name: 'Bahan', values: opt([{label: 'Taslan Jin+Dakron 4mm', priceMod: 0}, {label: 'Taslan JN+Dakron 10mm', priceMod: 21000}]), required: true },
          { name: 'Ukuran', values: opt([{label: 'S', priceMod: 0}, {label: 'M', priceMod: 0}, {label: 'L', priceMod: 0}, {label: 'XL', priceMod: 0}, {label: 'XXL', priceMod: 10000}]), required: true }
        ]
      }
    }
  });

  // 2. JAKET PARKA
  await prisma.product.create({
    data: {
      name: 'Jaket Parka Custom',
      description: 'Jaket Parka custom untuk berbagai kebutuhan. Harga menyesuaikan kombinasi bahan luar dan inner/puring.',
      divisi: 'KONVEKSI',
      price: 155000,
      minOrder: 12,
      imageUrl: '/placeholder-parka.jpg',
      specifications: '- Penambahan lain:\n  - Bordir max 3 titik\n  - Titik bordir: + Rp5.000/titik\n  - Variasi: + Rp3.000 - Rp25.000\n  - Resleting YKK Besi: + Rp10.000\n  - Busa Bahu: + Rp10.000',
      isRecommended: true,
      options: {
        create: [
          { name: 'Bahan Luar', values: opt([{label: 'Taslan Halus', priceMod: 0}, {label: 'Taslan Milky', priceMod: 10000}, {label: 'American', priceMod: 5000}]), required: true },
          { name: 'Inner / Puring', values: opt([{label: 'Peles / Jaring', priceMod: 0}, {label: 'Katun', priceMod: 15000}, {label: 'Polar', priceMod: 20000}]), required: true },
          { name: 'Ukuran', values: opt([{label: 'S', priceMod: 0}, {label: 'M', priceMod: 0}, {label: 'L', priceMod: 0}, {label: 'XL', priceMod: 0}, {label: 'XXL', priceMod: 15000}]), required: true }
        ]
      }
    }
  });

  // 3. JERSEY ATASAN FULL PRINTING
  await prisma.product.create({
    data: {
      name: 'Jersey Atasan Full Printing',
      description: 'Jersey olahraga full printing berkualitas. Bebas pilih bahan Drifit Milano atau Jarum.',
      divisi: 'KONVEKSI',
      price: 90000,
      minOrder: 12,
      imageUrl: '/placeholder-jersey.jpg',
      specifications: '- Bahan: Drifit Milano / Jarum (Bebas Pilih)\n- Harga:\n  - Lengan Pendek: Rp90.000\n  - Lengan Panjang: Rp105.000\n- Penambahan:\n  - Kerah Pakai Kancing: + Rp15.000\n  - Pola Raglan: + Rp10.000\n  - Kerah Tali Hoodie: + Rp35.000',
      isRecommended: true,
      options: {
        create: [
          { name: 'Model Lengan', values: opt([{label: 'Lengan Pendek', priceMod: 0}, {label: 'Lengan Panjang', priceMod: 15000}]), required: true },
          { name: 'Bahan', values: opt([{label: 'Drifit Milano', priceMod: 0}, {label: 'Drifit Jarum', priceMod: 0}]), required: true },
          { name: 'Ukuran', values: opt([{label: 'S', priceMod: 0}, {label: 'M', priceMod: 0}, {label: 'L', priceMod: 0}, {label: 'XL', priceMod: 0}, {label: 'XXL', priceMod: 10000}]), required: true }
        ]
      }
    }
  });

  console.log('Semua produk Konveksi berhasil ditambahkan!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
