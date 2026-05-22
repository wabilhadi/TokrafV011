/**
 * Seed Admin Script
 * Jalankan: npx ts-node src/scripts/seed-admin.ts
 */
import bcrypt from 'bcrypt';
import { prisma } from '../lib/db';

async function seedAdmin() {
  const email = 'ekrafhimatika@gmail.com';
  const password = 'EkrafHimaTika_UnUY0';
  const name = 'Admin TOKRAF';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('✅ Admin sudah ada:', email);
    await prisma.$disconnect();
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const admin = await prisma.user.create({
    data: { email, password: hashed, name, role: 'ADMIN' },
  });

  console.log('🎉 Admin berhasil dibuat!');
  console.log('   Email   :', admin.email);
  console.log('   Password: EkrafHimaTika_UnUY0');
  console.log('   Role    :', admin.role);
  await prisma.$disconnect();
}

seedAdmin().catch(e => { console.error(e); process.exit(1); });
