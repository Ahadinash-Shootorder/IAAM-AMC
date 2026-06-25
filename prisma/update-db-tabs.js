const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Connecting to database...');
  const section = await prisma.section.findUnique({
    where: {
      pageId_id: {
        pageId: 'assemblies',
        id: 'assembliesTabs'
      }
    }
  });

  if (!section) {
    console.log('Section assembliesTabs not found in database. Nothing to update.');
    return;
  }

  console.log('Found assembliesTabs section. Current content:', section.content);

  const updatedTabs = [
    { label: '2026 Congresses', link: '/assemblies', isActive: 'true' },
    { label: 'Fellow Assemblies', link: '/individual-events', isActive: 'false' },
    { label: 'Advanced Materials Lecture Series', link: '/congress-proceedings', isActive: 'false' },
    { label: 'Contact Us', link: '/#contacts', isActive: 'false' }
  ];

  const contentObj = { tabs: updatedTabs };
  const contentStr = JSON.stringify(contentObj);

  await prisma.section.update({
    where: {
      pageId_id: {
        pageId: 'assemblies',
        id: 'assembliesTabs'
      }
    },
    data: {
      content: contentStr,
      draftContent: null // Reset draft content so published is live
    }
  });

  console.log('Successfully updated assembliesTabs content and cleared draft in DB!');
}

main()
  .catch((e) => {
    console.error('Error updating DB tabs:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
