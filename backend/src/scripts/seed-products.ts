/**
 * Seed Products Script — TOKRAF
 * Sumber: Katalog Konveksi TOKRAF, Price List Lanyard, Tumbler Sovent, Mug Sublim
 * Jalankan: npx ts-node src/scripts/seed-products.ts
 *
 * Catatan: Harga adalah harga referensi vendor, admin dapat mengubah via panel.
 */
import bcrypt from 'bcrypt';
import { prisma } from '../lib/db';

// ─── HELPER ──────────────────────────────────────────────────────────────────
async function upsertProduct(data: {
  name: string;
  description: string;
  divisi: 'KONVEKSI' | 'MERCH' | 'DIGITAL_PRINTING';
  price: number;
  minOrder: number;
  imageUrl: string;
  specifications: string;
  options: { name: string; values: string }[];
}) {
  const existing = await prisma.product.findFirst({ where: { name: data.name } });
  if (existing) {
    console.log(`  ⏭  Skip (sudah ada): ${data.name}`);
    return;
  }
  await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      divisi: data.divisi,
      price: data.price,
      minOrder: data.minOrder,
      imageUrl: data.imageUrl,
      specifications: data.specifications,
      status: 'ACTIVE',
      options: { create: data.options.map(o => ({ name: o.name, values: o.values })) },
    },
  });
  console.log(`  ✅ Created: ${data.name}`);
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🚀 Seeding products...\n');

  // ══════════════════════════════════════════════════════════════
  // KONVEKSI
  // ══════════════════════════════════════════════════════════════

  await upsertProduct({
    name: 'Kaos / T-Shirt Custom',
    divisi: 'KONVEKSI',
    price: 54000,
    minOrder: 12,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800',
    description: 'Kaos custom sablon berkualitas dengan berbagai pilihan bahan cotton combed, bamboo, hingga galaxy. Cocok untuk seragam komunitas, event, merchandise brand.',
    specifications: `Min. Order: 12 pcs
Sablon termasuk 3 warna, 2 titik
Area sablon maks. A3
Tersedia ukuran S - 4XL`,
    options: [
      { name: 'Bahan', values: 'Cotton Combed 20s,Cotton Combed 24s,Cotton Combed 30s,Bamboo,Galaxy' },
      { name: 'Teknik Sablon', values: 'Rubber,Plastisol,Discharge,Plascharge,Glow in The Dark,High Density (HD)' },
      { name: 'Ukuran', values: 'S,M,L,XL,XXL,XXXL,4XL' },
      { name: 'Potongan', values: 'Regular,Oversize,Panjang Muslimah,Raglan' },
    ],
  });

  await upsertProduct({
    name: 'Korsa / PDH / Seragam Lapangan',
    divisi: 'KONVEKSI',
    price: 110000,
    minOrder: 12,
    imageUrl: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=800',
    description: 'Kemeja korsa/PDH untuk organisasi, komunitas, dan instansi. Bahan drill premium dengan bordir komputer. Termasuk skoder bahu, tali lengan, dan list kain belakang.',
    specifications: `Min. Order: 12 pcs
Lengan panjang, free skoder bahu
Bordir komputer 5 titik
List kain belakang`,
    options: [
      { name: 'Bahan', values: 'American Drill,Namura Drill,Nagata Drill,Ripstop' },
      { name: 'Lengan', values: 'Lengan Panjang,Lengan Pendek' },
      { name: 'Tambahan', values: 'Ventilator+Jaring,Resleting,Saku Dalam+Resleting,Kantong Bolpoin,Reflektor Belakang' },
      { name: 'Ukuran', values: 'S,M,L,XL,XXL,XXXL,4XL' },
    ],
  });

  await upsertProduct({
    name: 'Polo Shirt Custom',
    divisi: 'KONVEKSI',
    price: 68000,
    minOrder: 12,
    imageUrl: 'https://images.unsplash.com/photo-1586363104862-3a5e222ee182?q=80&w=800',
    description: 'Polo shirt premium untuk seragam perusahaan, komunitas, dan event. Tersedia bahan Lacoste PE, Cotton Combed, hingga Lacoste Cotton asli. Termasuk bordir komputer 3 titik.',
    specifications: `Min. Order: 12 pcs
Lengan pendek, termasuk kerah & manset
Bordir komputer 3 titik
3 warna sablon - 2 titik`,
    options: [
      { name: 'Bahan', values: 'Lacoste PE,Cotton Combed 24S,Lacoste CVC,Lacoste Cotton' },
      { name: 'Lengan', values: 'Lengan Pendek,Lengan Panjang (+Rp 8.000)' },
      { name: 'Ukuran', values: 'S,M,L,XL,XXL,XXXL,4XL' },
    ],
  });

  await upsertProduct({
    name: 'Hoodie / Zip Hoodie Custom',
    divisi: 'KONVEKSI',
    price: 138000,
    minOrder: 12,
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800',
    description: 'Hoodie premium custom dengan sablon plastisol full color. Pilihan bahan fleece cotton, baby terry, hingga fleece PE. Dikemas dalam ziplock. Cocok untuk brand streetwear & merchandise.',
    specifications: `Min. Order: 12 pcs
Sablon plastisol, termasuk 3 warna
Packing menggunakan ziplock`,
    options: [
      { name: 'Bahan', values: 'Fleece Cotton,Baby Terry,Fleece PE' },
      { name: 'Model', values: 'Hoodie (tanpa resleting),Zip Hoodie (+Rp 10.000)' },
      { name: 'Ukuran', values: 'S,M,L,XL,XXL,XXXL,4XL' },
      { name: 'Tali', values: 'Tali Standar,Tali Besi (+Rp 6.000)' },
    ],
  });

  await upsertProduct({
    name: 'Jaket Varsity / Bomber Custom',
    divisi: 'KONVEKSI',
    price: 135000,
    minOrder: 12,
    imageUrl: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?q=80&w=800',
    description: 'Jaket varsity & bomber custom collegiate style. Bahan taslan pilihan dengan berbagai inner/puring. Bordir komputer maks. 3 titik. Cocok untuk organisasi kampus dan brand fashion.',
    specifications: `Min. Order: 12 pcs
Bordir maks. 3 titik
Tersedia berbagai pilihan inner/puring`,
    options: [
      { name: 'Bahan Luar', values: 'Taslan Halus/Micro,Taslan Milky,American Drill' },
      { name: 'Inner/Puring', values: 'Katun Peles,Jaring,Polar' },
      { name: 'Model', values: 'Bomber,Varsity,Coach Jacket,Rompi Vest,Parka' },
      { name: 'Ukuran', values: 'S,M,L,XL,XXL,XXXL,4XL' },
    ],
  });

  await upsertProduct({
    name: 'Jersey Olahraga Full Print',
    divisi: 'KONVEKSI',
    price: 90000,
    minOrder: 12,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800',
    description: 'Jersey olahraga full printing berkualitas tinggi untuk futsal, basket, esport, dan komunitas. Bahan drifit milano/jarum pilihan. Cetak full sublimasi seluruh area.',
    specifications: `Min. Order: 12 pcs
Bahan drifit milano / jarum (bebas pilih)
Full printing sublimasi`,
    options: [
      { name: 'Jenis', values: 'Atasan Lengan Pendek,Atasan Lengan Panjang (+Rp 15.000),Celana Polos,Celana Full Print' },
      { name: 'Model Kerah', values: 'Kerah Standar,Kerah Kancing (+Rp 15.000),Kerah Tali Hoodie (+Rp 35.000),Pola Raglan (+Rp 10.000)' },
      { name: 'Ukuran', values: 'S,M,L,XL,XXL,XXXL,4XL' },
    ],
  });

  await upsertProduct({
    name: 'Totebag Custom',
    divisi: 'KONVEKSI',
    price: 33000,
    minOrder: 12,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800',
    description: 'Totebag custom sablon rubber penuh warna. Pilihan bahan drill, blacu, dan kanvas. Cocok untuk goodie bag event, merchandise brand, dan souvenir.',
    specifications: `Min. Order: 12 pcs
Termasuk sablon rubber 3 warna
Termasuk perekat`,
    options: [
      { name: 'Bahan', values: 'Blacu,Drill,Kanvas' },
      { name: 'Tambahan', values: 'Tanpa Resleting,Resleting (+Rp 10.000)' },
    ],
  });

  await upsertProduct({
    name: 'Topi / Caps Custom',
    divisi: 'KONVEKSI',
    price: 45000,
    minOrder: 12,
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800',
    description: 'Topi custom dengan sablon atau bordir komputer. Berbagai pilihan bahan dan model. Cocok untuk merchandise, seragam, dan event branding.',
    specifications: `Min. Order: 12 pcs
Sablon / Bordir 2 titik`,
    options: [
      { name: 'Bahan', values: 'Drill,Rapel,Kanvas,Jalames' },
      { name: 'Model', values: 'Baseball,Rimba (+Rp 5.000)' },
      { name: 'Teknik', values: 'Sablon,Bordir,Bordir Timbul (+Rp 5.000)' },
    ],
  });

  // ══════════════════════════════════════════════════════════════
  // MERCH
  // ══════════════════════════════════════════════════════════════

  await upsertProduct({
    name: 'Lanyard ID Card Custom',
    divisi: 'MERCH',
    price: 9500,
    minOrder: 1,
    imageUrl: 'https://images.unsplash.com/photo-1585435422896-e2603fc5c00e?q=80&w=800',
    description: 'Tali lanyard custom cetak full color dengan berbagai varian: standar, stopper, stopper rotate, safety, keychain, strap, dan gelang. Bahan tali tissue premium. Minimal order satuan.',
    specifications: `Min. Order: 1 pcs (satuan)
Bahan tali tissue premium
Pilihan cetak 1 sisi / 2 sisi
Proses produksi cepat dengan mesin ultrasonik`,
    options: [
      { name: 'Tipe Lanyard', values: 'Lanyard Standar,Lanyard Stopper,Lanyard Safety,Lanyard Rotate,Lanyard Keychain,Lanyard Strap,Lanyard Gelang,Lanyard Vape' },
      { name: 'Lebar Tali', values: '1.5 cm,2 cm,2.5 cm,3 cm,4 cm' },
      { name: 'Cetak', values: '1 Sisi,2 Sisi (+Rp 500)' },
      { name: 'Jumlah', values: '1-9 pcs,10-49 pcs,50-249 pcs,250-499 pcs,500+ pcs (hubungi CS)' },
    ],
  });

  await upsertProduct({
    name: 'ID Card PVC Custom',
    divisi: 'MERCH',
    price: 3500,
    minOrder: 1,
    imageUrl: 'https://images.unsplash.com/photo-1614637369067-4bc1c9c3c26a?q=80&w=800',
    description: 'ID Card PVC cetak UV berkualitas tinggi, hasil tajam dan tahan lama. Tersedia cetak 1 sisi dan 2 sisi, serta pilihan frame ID card berbagai bahan.',
    specifications: `Bahan: PVC
Cetak UV, hasil doff/glossy
Ukuran standar ID Card: 5.5 x 8.5 cm`,
    options: [
      { name: 'Tipe Cetak', values: 'Print UV 1 Sisi,Print UV 2 Sisi,Laser Engraving' },
      { name: 'Frame', values: 'Tanpa Frame,Frame Plastik 1 Muka,Frame Plastik 2 Muka,Frame Akrilik 1 Muka,Frame Akrilik 2 Muka,Frame Kulit PU,Frame Alumunium,Frame Silicon' },
      { name: 'Jumlah', values: '1-9 pcs,10-99 pcs,100-499 pcs,500+ pcs (hubungi CS)' },
    ],
  });

  await upsertProduct({
    name: 'Pin / Gantungan Kunci Button',
    divisi: 'MERCH',
    price: 3000,
    minOrder: 1,
    imageUrl: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=800',
    description: 'Pin dan ganci (gantungan kunci button) cetak full color. Bahan metal dengan lapisan glossy. Ukuran tersedia 44mm dan 58mm. Cocok untuk souvenir event dan merchandise brand.',
    specifications: `Bahan: Metal + cover plastik glossy
Cetak full color`,
    options: [
      { name: 'Jenis', values: 'Pin (Bros),Ganci (Gantungan Kunci)' },
      { name: 'Ukuran', values: '44 mm,58 mm' },
      { name: 'Jumlah', values: '1-9 pcs,10-49 pcs,50-500 pcs' },
    ],
  });

  await upsertProduct({
    name: 'Mug Custom Sublimasi',
    divisi: 'MERCH',
    price: 14500,
    minOrder: 1,
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800',
    description: 'Mug custom cetak sublimasi full color. Berbagai tipe mug tersedia: Pearl (putih mengkilap), Black Mamba (hitam matte), 2 in One (luar putih dalam berwarna), hingga Magic Mug yang berubah warna saat diisi air panas.',
    specifications: `Cetak sublimasi full color, tahan lama
Minimal order satuan`,
    options: [
      { name: 'Tipe Mug', values: 'Mug Pearl (Rp 14.500),Mug Black Mamba (Rp 14.000),Mug 2 in One (Rp 18.000),Mug Magic (Rp 27.000)' },
      { name: 'Warna Dalam (Mug 2 in One)', values: 'Hijau,Pink,Orange,Kuning,Merah,Biru' },
    ],
  });

  await upsertProduct({
    name: 'Tumbler Custom Stainless',
    divisi: 'MERCH',
    price: 38000,
    minOrder: 1,
    imageUrl: 'https://images.unsplash.com/photo-1610943640030-22cba2bd11d3?q=80&w=800',
    description: 'Tumbler souvenir stainless steel cetak printing atau grafir laser. Tersedia berbagai model: Spin, Arizona, Japan Grip, Japan Flat, Lulu, Bowling, Handle, dan lainnya. Kapasitas 500ml. Minimal order satuan.',
    specifications: `Bahan: Stainless Steel
Kapasitas: 280ml – 700ml (tergantung model)
Min. Order: satuan (bisa 1 pcs)`,
    options: [
      { name: 'Model Tumbler', values: 'Tumbler Spin (Rp 38.000),Tumbler Spin LED (Rp 65.000),Tumbler Arizona (Rp 48.000),Tumbler Japan Grip (Rp 50.000),Tumbler Japan Flat (Rp 50.000),Tumbler Lulu (Rp 60.000),Tumbler Bowling (Rp 50.000),Tumbler One Set+Cangkir (Rp 65.000),Tumbler Americano (Rp 50.000),Tumbler Mini Portable 280ml (Rp 50.000),Tumbler Handle (Rp 70.000),Tumbler Arizona Wide (Rp 65.000),Tumbler Arizona Jumbo 700ml (Rp 80.000)' },
      { name: 'Teknik Cetak', values: 'Printing Full Color,Grafir Laser' },
    ],
  });

  await upsertProduct({
    name: 'Tumbler Custom Non-Stainless',
    divisi: 'MERCH',
    price: 16500,
    minOrder: 1,
    imageUrl: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?q=80&w=800',
    description: 'Tumbler dan botol custom berbahan alumunium dan plastik. Tersedia model Sport Ace, Carabiner, Insert Paper, Botol Jerami, Botol Anak, dan Botol Kaca. Harga lebih terjangkau.',
    specifications: `Bahan: Alumunium / Plastik / Kaca
Kapasitas: 420–500ml`,
    options: [
      { name: 'Model', values: 'Tumbler Sport Ace-Alumunium (Rp 50.000),Tumbler Carabiner-Alumunium (Rp 35.000),Tumbler Insert Paper-Plastik (Rp 25.000),Botol Jerami-Kaca (Rp 16.500),Botol Anak-Plastik (Rp 35.000),Botol Kaca Doff/Bening (Rp 15.000)' },
      { name: 'Teknik Cetak', values: 'Printing Full Color,Cetak Kertas (Insert Paper)' },
    ],
  });

  // ══════════════════════════════════════════════════════════════
  // DIGITAL PRINTING
  // ══════════════════════════════════════════════════════════════

  await upsertProduct({
    name: 'Cetak Banner / Spanduk',
    divisi: 'DIGITAL_PRINTING',
    price: 12000,
    minOrder: 1,
    imageUrl: 'https://images.unsplash.com/photo-1563690623230-0322ba6db7d4?q=80&w=800',
    description: 'Cetak banner dan spanduk outdoor/indoor full color. Harga per meter persegi. Berbagai pilihan bahan dari 280gsm hingga 440gsm. Finishing tersedia seaming, kolong, sambung, dan keling.',
    specifications: `Harga: per m² (lebar × tinggi)
Bahan 280gsm: lebar 0.6 / 1.1 / 1.6 / 2.2 / 2.6 / 3.2m
Bahan 340gsm & 440gsm: lebar 1.1 / 1.6 / 2.2 / 3.2m`,
    options: [
      { name: 'Bahan', values: '280 gsm (Rp 12.000/m²),340 gsm (Rp 17.000/m²),440 gsm (Rp 27.000/m²)' },
      { name: 'Finishing', values: 'Tanpa Finishing,Seaming (Rp 250/m),Kolong (Rp 500/m),Sambung (Rp 1.500/m),Keling (Rp 500/pcs)' },
    ],
  });

  await upsertProduct({
    name: 'X-Banner Custom',
    divisi: 'DIGITAL_PRINTING',
    price: 45000,
    minOrder: 1,
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800',
    description: 'X-Banner cetak full color ukuran standar 60×160cm. Bahan albatros hingga 440gsm. Termasuk tiang X. Cocok untuk pameran, stand jualan, event, dan display produk.',
    specifications: `Ukuran standar: 60 × 160 cm
Termasuk tiang X (stand)`,
    options: [
      { name: 'Bahan', values: 'Albatros (Rp 105.000),440 gsm (Rp 65.000),340 gsm (Rp 50.000),280 gsm (Rp 45.000)' },
    ],
  });

  await upsertProduct({
    name: 'Roll Up Banner / Y-Banner',
    divisi: 'DIGITAL_PRINTING',
    price: 65000,
    minOrder: 1,
    imageUrl: 'https://images.unsplash.com/photo-1614032686163-bdc24c13d0b6?q=80&w=800',
    description: 'Roll Up Banner dan Y-Banner cetak full color profesional. Termasuk stand/tiang. Tampil elegan dan praktis untuk presentasi, pameran, dan promosi indoor.',
    specifications: `Termasuk stand bawaan
Roll Up: otomatis masuk ke dudukan`,
    options: [
      { name: 'Jenis', values: 'Roll Up Banner,Y-Banner' },
      { name: 'Bahan (Roll Up)', values: 'Albatros (Rp 200.000),440 gsm (Rp 190.000),340 gsm (Rp 175.000)' },
      { name: 'Bahan (Y-Banner)', values: 'Albatros (Rp 125.000),440 gsm (Rp 85.000),340 gsm (Rp 70.000),280 gsm (Rp 65.000)' },
    ],
  });

  await upsertProduct({
    name: 'Cetak Indoor / Poster / Kanvas UV',
    divisi: 'DIGITAL_PRINTING',
    price: 40000,
    minOrder: 1,
    imageUrl: 'https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?q=80&w=800',
    description: 'Cetak indoor berkualitas tinggi menggunakan print UV. Berbagai bahan tersedia: Art Paper, Albatros, Luster, Duratac, Ritrama, hingga Canvas. Harga per m².',
    specifications: `Harga: per m² (print UV indoor)
Cocok untuk display indoor, poster, dekorasi, signage`,
    options: [
      { name: 'Bahan', values: 'Art Paper 150 (Rp 40.000/m²),Art Carton 230 (Rp 45.000/m²),Albatros (Rp 55.000/m²),Luster (Rp 70.000/m²),Duratac (Rp 50.000/m²),Ritrama (Rp 65.000/m²),One Way Vision (Rp 75.000/m²),Canvas (Rp 155.000/m²)' },
    ],
  });

  await upsertProduct({
    name: 'Cetak Kartu Nama',
    divisi: 'DIGITAL_PRINTING',
    price: 20000,
    minOrder: 1,
    imageUrl: 'https://images.unsplash.com/photo-1541795795328-f073b763494e?q=80&w=800',
    description: 'Cetak kartu nama profesional full color dengan berbagai pilihan kertas premium. Harga per 100 lembar. Tersedia cetak 1 muka dan 2 muka.',
    specifications: `Ukuran standar: 9 × 5.5 cm
Harga per 100 lembar`,
    options: [
      { name: 'Muka', values: '1 Muka,2 Muka' },
      { name: 'Kertas (1 Muka)', values: 'Art Carton 210 (Rp 20.000),Art Carton 230 (Rp 21.500),Art Carton 260 (Rp 22.500),Art Carton 310 (Rp 25.000),Matte Paper (Rp 35.000),Linen (Rp 30.000)' },
      { name: 'Kertas (2 Muka)', values: 'Art Carton 210 (Rp 33.000),Art Carton 230 (Rp 34.000),Art Carton 260 (Rp 35.500),Art Carton 310 (Rp 37.500),Matte Paper (Rp 40.000),Linen (Rp 45.000)' },
    ],
  });

  await upsertProduct({
    name: 'Cetak Sticker Custom',
    divisi: 'DIGITAL_PRINTING',
    price: 3000,
    minOrder: 1,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800',
    description: 'Cetak sticker custom full color berbagai bahan. Tersedia sticker HVS, Chromo, Vinyl Glossy, Vinyl Matte, Vinyl Transparant, Kraft, Metalize, Gold, dan Hologram. Harga per lembar A3+.',
    specifications: `Ukuran cetak: A3+
Cutting tersedia (tambah biaya)`,
    options: [
      { name: 'Bahan', values: 'Sticker HVS,Sticker Chromo,Vinyl Glossy,Vinyl Matte,Vinyl Transparant,Sticker Kraft,Sticker Metalize,Sticker Gold,Sticker Hologram' },
      { name: 'Finishing', values: 'Tanpa Cutting,Cutting Sesuai Bentuk' },
    ],
  });

  console.log('\n✅ Seeding selesai!\n');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
