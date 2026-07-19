const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function fixDates() {
  await prisma.$executeRawUnsafe(`SET SESSION sql_mode = 'NO_ENGINE_SUBSTITUTION'`);
  const tables = ['User', 'Product', 'Portfolio', 'Content', 'ContactMessage', 'Order', 'Review'];
  for (const table of tables) {
    try {
      console.log(`Fixing dates for ${table}`);
      if (table !== 'Content') {
        await prisma.$executeRawUnsafe(`UPDATE \`${table}\` SET \`createdAt\` = CURRENT_TIMESTAMP WHERE CAST(\`createdAt\` AS CHAR) LIKE '0000-00-00%'`);
      }
      if (table !== 'ContactMessage' && table !== 'Review') {
        await prisma.$executeRawUnsafe(`UPDATE \`${table}\` SET \`updatedAt\` = CURRENT_TIMESTAMP WHERE CAST(\`updatedAt\` AS CHAR) LIKE '0000-00-00%'`);
      }
    } catch(e) {
      console.log(`Error in ${table}: ${e.message}`);
    }
  }
}
fixDates().then(()=>prisma.$disconnect()).catch(console.error);
