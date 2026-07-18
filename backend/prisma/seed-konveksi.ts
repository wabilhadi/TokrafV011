import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Menghapus data produk Konveksi lama (opsional, comment jika tidak ingin hapus)...');
  // Hapus produk lama khusus Konveksi jika perlu, atau kita tambah saja.
  // await prisma.product.deleteMany({ where: { divisi: 'KONVEKSI' } });

  console.log('Menambahkan produk Konveksi baru...');

  // 1. ROMPI VEST
  await prisma.product.create({
    data: {
      name: 'Rompi Vest Custom',
      description: 'Rompi Vest custom dengan bahan berkualitas, cocok untuk instansi, organisasi, atau event. Minimum order 12 pcs. Bordir maksimal A4 Non Blok.',
      divisi: 'KONVEKSI',
      price: 185000,
      minOrder: 12,
      imageUrl: '/placeholder-vest.jpg', // Placeholder
      specifications: '- Bordir Mak. A4 Non Blok\n- Harga 12-80 pcs: Taslan Jin+Dakron 4mm (Rp188.000), Taslan JN+Dakron 10mm (Rp208.000)\n- Harga >80 pcs: Taslan Jin+Dakron 4mm (Rp185.000), Taslan JN+Dakron 10mm (Rp206.000)',
      isRecommended: true,
      options: {
        create: [
          { name: 'Bahan', values: 'Taslan Jin+Dakron 4mm,Taslan JN+Dakron 10mm', required: true }
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
          { name: 'Bahan Luar', values: 'Taslan Halus,Taslan Milky,American', required: true },
          { name: 'Inner / Puring', values: 'Peles / Jaring,Katun,Polar', required: true }
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
          { name: 'Model Lengan', values: 'Lengan Pendek,Lengan Panjang', required: true },
          { name: 'Bahan', values: 'Drifit Milano,Drifit Jarum', required: true }
        ]
      }
    }
  });

  // 4. JERSEY CELANA
  await prisma.product.create({
    data: {
      name: 'Jersey Celana',
      description: 'Celana jersey pasangkan dengan atasan jersey Anda. Tersedia polos atau full printing.',
      divisi: 'KONVEKSI',
      price: 45000,
      minOrder: 12,
      imageUrl: '/placeholder-celana.jpg',
      specifications: '- Bahan: Drifit Milano / Jarum (Bebas Pilih)\n- Harga:\n  - Polos 1 Warna Sablon DTF: Rp45.000\n  - Full Printing: Rp60.000',
      isRecommended: false,
      options: {
        create: [
          { name: 'Model Cetak', values: 'Polos 1 Warna Sablon DTF,Full Printing', required: true }
        ]
      }
    }
  });

  // 5. TOTEBAG
  await prisma.product.create({
    data: {
      name: 'Totebag Custom',
      description: 'Totebag custom sablon rubber (max 3 warna), sudah termasuk perekat. Cocok untuk merchandise event atau seminar.',
      divisi: 'KONVEKSI',
      price: 30000,
      minOrder: 12,
      imageUrl: '/placeholder-totebag.jpg',
      specifications: '- Sablon Rubber termasuk 3 warna sablon\n- Termasuk perekat\n- Harga (12-80 pcs):\n  - Drill: Rp38.000\n  - Blacu: Rp33.000\n  - Kanvas: Rp38.000\n- Harga (>80 pcs):\n  - Drill: Rp35.000\n  - Blacu: Rp30.000\n  - Kanvas: Rp35.000\n- Penambahan:\n  - Resleting: + Rp10.000\n  - Tambah Warna Sablon: + Rp2.000',
      isRecommended: false,
      options: {
        create: [
          { name: 'Bahan', values: 'Drill,Blacu,Kanvas', required: true }
        ]
      }
    }
  });

  // 6. TOPI / CAPS
  await prisma.product.create({
    data: {
      name: 'Topi / Caps Custom',
      description: 'Topi custom dengan sablon atau bordir maksimal 2 titik.',
      divisi: 'KONVEKSI',
      price: 40000,
      minOrder: 12,
      imageUrl: '/placeholder-topi.jpg',
      specifications: '- Spesifikasi: Sablon / Bordir 2 Titik\n- Harga (12-80 pcs):\n  - Drill: Rp45.000, Rapel: Rp50.000, Kanvas: Rp50.000, Jalames: Rp53.000\n- Harga (>80 pcs):\n  - Drill: Rp40.000, Rapel: Rp45.000, Kanvas: Rp45.000, Jalames: Rp48.000\n- Penambahan:\n  - Bordir Timbul: + Rp5.000\n  - Topi Rimba: + Rp5.000\n  - Titik Bordir: + Rp3.000',
      isRecommended: false,
      options: {
        create: [
          { name: 'Bahan', values: 'Drill,Rapel,Kanvas,Jalames', required: true }
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
