const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Menghapus semua produk lama...');
  await prisma.product.deleteMany({});
  
  const products = [
    // ─── KONVEKSI ───
    {
      name: 'Kaos Custom Premium (Sablon/Bordir)',
      description: 'Kaos custom berkualitas distro. Sangat cocok untuk gathering, seragam komunitas, event, maupun merchandise. Bahan adem, menyerap keringat, dan tahan lama.',
      divisi: 'KONVEKSI',
      price: 45000,
      minOrder: 12,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      isRecommended: true,
      options: [
        {
          name: 'Bahan Kaos',
          values: JSON.stringify({
            uiType: 'radio',
            choices: [
              { label: 'Cotton Combed 30s (Standar)', priceMod: 0 },
              { label: 'Cotton Combed 24s (Lebih Tebal)', priceMod: 5000 },
              { label: 'Cotton Bamboo (Anti Bakteri)', priceMod: 15000 }
            ]
          }),
          required: true
        },
        {
          name: 'Warna Dasar',
          values: JSON.stringify({
            uiType: 'swatch',
            choices: [
              { label: 'Hitam', priceMod: 0, metadata: '#000000' },
              { label: 'Putih', priceMod: 0, metadata: '#ffffff' },
              { label: 'Navy', priceMod: 0, metadata: '#000080' },
              { label: 'Maroon', priceMod: 0, metadata: '#800000' },
              { label: 'Abu Misty', priceMod: 0, metadata: '#c0c0c0' }
            ]
          }),
          required: true
        },
        {
          name: 'Teknik Sablon',
          values: JSON.stringify({
            uiType: 'dropdown',
            choices: [
              { label: 'Sablon Rubber 1 Sisi (Max A3)', priceMod: 0 },
              { label: 'Sablon Plastisol 1 Sisi (Max A3)', priceMod: 10000 },
              { label: 'Sablon DTF A4 (Full Color)', priceMod: 15000 },
              { label: 'Sablon DTF A3 (Full Color)', priceMod: 25000 }
            ]
          }),
          required: true
        },
        {
          name: 'Rincian Ukuran',
          values: JSON.stringify({
            uiType: 'stepper',
            choices: [
              { label: 'S', priceMod: 0 },
              { label: 'M', priceMod: 0 },
              { label: 'L', priceMod: 0 },
              { label: 'XL', priceMod: 5000 },
              { label: 'XXL', priceMod: 10000 },
              { label: '3XL', priceMod: 15000 }
            ]
          }),
          required: true
        }
      ]
    },
    {
      name: 'Kemeja PDH / PDL Instansi',
      description: 'Kemeja seragam elegan untuk perusahaan, kampus, atau organisasi. Tersedia berbagai pilihan bahan drill terbaik dengan jahitan rapi dan kuat.',
      divisi: 'KONVEKSI',
      price: 95000,
      minOrder: 12,
      imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e32f6b717?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      isRecommended: true,
      options: [
        {
          name: 'Model Lengan',
          values: JSON.stringify({
            uiType: 'radio',
            choices: [
              { label: 'Lengan Pendek', priceMod: 0 },
              { label: 'Lengan Panjang', priceMod: 10000 }
            ]
          }),
          required: true
        },
        {
          name: 'Bahan Kain',
          values: JSON.stringify({
            uiType: 'dropdown',
            choices: [
              { label: 'American Drill (Standar)', priceMod: 0 },
              { label: 'Nagata Drill (Nyaman & Adem)', priceMod: 20000 },
              { label: 'Taipan Drill (Premium Eksklusif)', priceMod: 35000 }
            ]
          }),
          required: true
        },
        {
          name: 'Bordir Komputer',
          values: JSON.stringify({
            uiType: 'radio',
            choices: [
              { label: '1 Titik (Mis: Dada Kiri)', priceMod: 0 },
              { label: '2 Titik', priceMod: 10000 },
              { label: '3 Titik', priceMod: 20000 },
              { label: '4 Titik', priceMod: 30000 }
            ]
          }),
          required: true
        },
        {
          name: 'Rincian Ukuran',
          values: JSON.stringify({
            uiType: 'stepper',
            choices: [
              { label: 'S', priceMod: 0 },
              { label: 'M', priceMod: 0 },
              { label: 'L', priceMod: 0 },
              { label: 'XL', priceMod: 10000 },
              { label: 'XXL', priceMod: 15000 }
            ]
          }),
          required: true
        }
      ]
    },
    {
      name: 'Jaket Bomber / Parka',
      description: 'Jaket multifungsi yang stylish dan hangat. Sangat digemari untuk angkatan kampus, seragam touring, atau event lapangan.',
      divisi: 'KONVEKSI',
      price: 135000,
      minOrder: 12,
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      isRecommended: false,
      options: [
        {
          name: 'Bahan Luar',
          values: JSON.stringify({
            uiType: 'dropdown',
            choices: [
              { label: 'Taslan (Anti Air Ringan)', priceMod: 0 },
              { label: 'Parasut', priceMod: 0 },
              { label: 'Kanvas (Tebal & Kasual)', priceMod: 15000 }
            ]
          }),
          required: true
        },
        {
          name: 'Bahan Furing (Dalam)',
          values: JSON.stringify({
            uiType: 'radio',
            choices: [
              { label: 'Furing Kahatex', priceMod: 0 },
              { label: 'Furing Jaring', priceMod: 10000 },
              { label: 'Furing Quilting / Dacron (Tebal)', priceMod: 25000 }
            ]
          }),
          required: true
        },
        {
          name: 'Rincian Ukuran',
          values: JSON.stringify({
            uiType: 'stepper',
            choices: [
              { label: 'M', priceMod: 0 },
              { label: 'L', priceMod: 0 },
              { label: 'XL', priceMod: 10000 },
              { label: 'XXL', priceMod: 20000 }
            ]
          }),
          required: true
        }
      ]
    },

    // ─── DIGITAL PRINTING ───
    {
      name: 'Roll Up / X-Banner Stand',
      description: 'Media promosi berdiri yang elegan dan mudah dibongkar pasang. Sangat cocok untuk diletakkan di depan toko, booth pameran, atau acara seminar.',
      divisi: 'DIGITAL_PRINTING',
      price: 65000,
      minOrder: 1,
      imageUrl: 'https://images.unsplash.com/photo-1542744094-24638ea0b3e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      isRecommended: true,
      options: [
        {
          name: 'Jenis Tiang / Stand',
          values: JSON.stringify({
            uiType: 'radio',
            choices: [
              { label: 'X-Banner (60x160cm)', priceMod: 0 },
              { label: 'Y-Banner (60x160cm)', priceMod: 10000 },
              { label: 'Roll Up Banner (60x160cm)', priceMod: 120000 }
            ]
          }),
          required: true
        },
        {
          name: 'Bahan Cetak',
          values: JSON.stringify({
            uiType: 'dropdown',
            choices: [
              { label: 'Flexi China 280gsm (Ekonomis)', priceMod: 0 },
              { label: 'Flexi Korea 440gsm (Awet & Tebal)', priceMod: 25000 },
              { label: 'Albatros (Sangat Tajam & Halus)', priceMod: 45000 }
            ]
          }),
          required: true
        },
        {
          name: 'Laminasi Khusus (Hanya untuk Albatros)',
          values: JSON.stringify({
            uiType: 'radio',
            choices: [
              { label: 'Tanpa Laminasi', priceMod: 0 },
              { label: 'Laminasi Doff', priceMod: 10000 },
              { label: 'Laminasi Glossy', priceMod: 10000 }
            ]
          }),
          required: true
        }
      ]
    },
    {
      name: 'Cetak Kartu Nama Premium',
      description: 'Tingkatkan profesionalitas Anda dengan kartu nama elegan. Harga tertera adalah per Box (Isi 100 Lembar).',
      divisi: 'DIGITAL_PRINTING',
      price: 25000,
      minOrder: 2,
      imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      isRecommended: false,
      options: [
        {
          name: 'Cetak Sisi',
          values: JSON.stringify({
            uiType: 'radio',
            choices: [
              { label: '1 Sisi', priceMod: 0 },
              { label: '2 Sisi (Bolak-Balik)', priceMod: 15000 }
            ]
          }),
          required: true
        },
        {
          name: 'Bahan Kertas',
          values: JSON.stringify({
            uiType: 'dropdown',
            choices: [
              { label: 'Art Carton 260gsm', priceMod: 0 },
              { label: 'Bluish White (Matte & Bisa Ditulis)', priceMod: 5000 },
              { label: 'Linen (Bertekstur Mewah)', priceMod: 10000 }
            ]
          }),
          required: true
        },
        {
          name: 'Finishing Tambahan',
          values: JSON.stringify({
            uiType: 'dropdown',
            choices: [
              { label: 'Potong Kotak Standar', priceMod: 0 },
              { label: 'Sudut Rounded / Melengkung', priceMod: 5000 },
              { label: 'Laminasi Doff', priceMod: 10000 },
              { label: 'Laminasi Glossy', priceMod: 10000 }
            ]
          }),
          required: true
        }
      ]
    },

    // ─── MERCHANDISE ───
    {
      name: 'Custom Tumbler / Botol Minum',
      description: 'Tumbler eksklusif untuk souvenir pernikahan, corporate gift, atau dipakai sendiri. Menjaga suhu minuman tetap awet.',
      divisi: 'MERCH',
      price: 35000,
      minOrder: 10,
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      isRecommended: true,
      options: [
        {
          name: 'Model Tumbler',
          values: JSON.stringify({
            uiType: 'dropdown',
            choices: [
              { label: 'Tumbler Sport Botol (Aluminium)', priceMod: 0 },
              { label: 'Tumbler Sakura / Niagara (Stainless)', priceMod: 15000 },
              { label: 'Tumbler LED Suhu (Digital)', priceMod: 30000 }
            ]
          }),
          required: true
        },
        {
          name: 'Teknik Cetak Logo / Nama',
          values: JSON.stringify({
            uiType: 'radio',
            choices: [
              { label: 'Sablon 1 Warna', priceMod: 0 },
              { label: 'Print UV Full Color', priceMod: 15000 },
              { label: 'Grafir Laser (Terkelupas Permanen)', priceMod: 20000 }
            ]
          }),
          required: true
        },
        {
          name: 'Warna Botol',
          values: JSON.stringify({
            uiType: 'swatch',
            choices: [
              { label: 'Hitam Matte', priceMod: 0, metadata: '#222222' },
              { label: 'Putih Bersih', priceMod: 0, metadata: '#ffffff' },
              { label: 'Silver Stainless', priceMod: 0, metadata: '#c0c0c0' },
              { label: 'Navy Blue', priceMod: 0, metadata: '#000080' }
            ]
          }),
          required: true
        }
      ]
    },
    {
      name: 'Custom Mug Cetak',
      description: 'Cetak foto, logo, atau tulisan di atas Mug keramik berkualitas SNI. Sablon awet dan tidak mudah luntur saat dicuci.',
      divisi: 'MERCH',
      price: 15000,
      minOrder: 12,
      imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      isRecommended: false,
      options: [
        {
          name: 'Tipe Mug',
          values: JSON.stringify({
            uiType: 'radio',
            choices: [
              { label: 'Mug Putih Polos', priceMod: 0 },
              { label: 'Mug Warna Dalam (Inner Color)', priceMod: 5000 },
              { label: 'Mug Magic / Bunglon (Gambar Muncul Saat Panas)', priceMod: 25000 }
            ]
          }),
          required: true
        },
        {
          name: 'Packaging / Box',
          values: JSON.stringify({
            uiType: 'radio',
            choices: [
              { label: 'Box Putih Polos', priceMod: 0 },
              { label: 'Box Custom Sablon / Mika', priceMod: 3500 }
            ]
          }),
          required: true
        }
      ]
    },
    {
      name: 'ID Card & Tali Lanyard Set',
      description: 'Paket komplit ID card (Bahan PVC tebal seperti ATM) berserta tali lanyard untuk tanda pengenal panitia atau karyawan.',
      divisi: 'MERCH',
      price: 12000,
      minOrder: 20,
      imageUrl: 'https://images.unsplash.com/photo-1634839811400-388b0a99ffac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      isRecommended: false,
      options: [
        {
          name: 'Tali Lanyard',
          values: JSON.stringify({
            uiType: 'dropdown',
            choices: [
              { label: 'Tali Kur Biasa (Polos)', priceMod: 0 },
              { label: 'Lanyard Sablon 1 Warna (Lebar 2cm)', priceMod: 3000 },
              { label: 'Lanyard Printing Full Color (Lebar 2cm)', priceMod: 8000 }
            ]
          }),
          required: true
        },
        {
          name: 'Tempat / Casing ID Card',
          values: JSON.stringify({
            uiType: 'radio',
            choices: [
              { label: 'Plastik Mika Bening', priceMod: 0 },
              { label: 'Casing Plastik Keras (Tebal)', priceMod: 3000 },
              { label: 'Holder Kulit Sintetis', priceMod: 10000 }
            ]
          }),
          required: true
        }
      ]
    }
  ];

  for (const prodData of products) {
    const { options, ...productFields } = prodData;
    const createdProduct = await prisma.product.create({
      data: {
        ...productFields,
        options: {
          create: options.map(opt => ({
            name: opt.name,
            values: opt.values,
            required: opt.required
          }))
        }
      }
    });
    console.log(`Berhasil membuat produk: ${createdProduct.name}`);
  }
  
  console.log('Seeding selesai!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
