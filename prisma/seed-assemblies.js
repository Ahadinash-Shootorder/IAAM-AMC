const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Upserting Assemblies Page...');
  await prisma.page.upsert({
    where: { id: 'assemblies' },
    update: { label: 'Assemblies Page', route: '/assemblies' },
    create: { id: 'assemblies', label: 'Assemblies Page', route: '/assemblies' }
  });

  const SEED_DATA_DIR = path.join(__dirname, 'seed_data');
  const sectionsPath = path.join(SEED_DATA_DIR, 'sections.json');
  
  if (fs.existsSync(sectionsPath)) {
    const sections = JSON.parse(fs.readFileSync(sectionsPath, 'utf-8'));
    const assembliesSections = sections.filter(sec => sec.pageId === 'assemblies');
    console.log(`Found ${assembliesSections.length} assemblies sections to seed.`);
    for (const sec of assembliesSections) {
      await prisma.section.upsert({
        where: { pageId_id: { pageId: sec.pageId, id: sec.id } },
        update: {
          label: sec.label,
          visible: sec.visible,
          order: sec.order,
          content: sec.content,
          draftContent: sec.draftContent
        },
        create: {
          id: sec.id,
          pageId: sec.pageId,
          label: sec.label,
          visible: sec.visible,
          order: sec.order,
          content: sec.content,
          draftContent: sec.draftContent
        }
      });
      console.log(`Upserted section ${sec.id}`);
    }
  } else {
    console.error('sections.json not found.');
  }

  console.log('Seeding of Assemblies completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding Assemblies:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
