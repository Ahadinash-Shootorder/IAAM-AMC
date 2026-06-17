const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const SEED_DATA_DIR = path.join(__dirname, 'seed_data');

async function main() {
  console.log('Seeding database from JSON files in prisma/seed_data...');

  // 1. Seed Pages
  const pagesPath = path.join(SEED_DATA_DIR, 'pages.json');
  if (fs.existsSync(pagesPath)) {
    const pages = JSON.parse(fs.readFileSync(pagesPath, 'utf-8'));
    console.log(`Found ${pages.length} pages to seed.`);
    for (const page of pages) {
      await prisma.page.upsert({
        where: { id: page.id },
        update: { label: page.label, route: page.route },
        create: { id: page.id, label: page.label, route: page.route }
      });
    }
  } else {
    console.warn('pages.json not found in seed_data.');
  }

  // 2. Seed Sections
  const sectionsPath = path.join(SEED_DATA_DIR, 'sections.json');
  if (fs.existsSync(sectionsPath)) {
    const sections = JSON.parse(fs.readFileSync(sectionsPath, 'utf-8'));
    console.log(`Found ${sections.length} sections to seed.`);
    for (const sec of sections) {
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
    }
  } else {
    console.warn('sections.json not found in seed_data.');
  }

  // 3. Seed Speakers
  const speakersPath = path.join(SEED_DATA_DIR, 'speakers.json');
  if (fs.existsSync(speakersPath)) {
    const speakers = JSON.parse(fs.readFileSync(speakersPath, 'utf-8'));
    console.log(`Found ${speakers.length} speakers to seed.`);
    for (const sp of speakers) {
      const { createdAt, updatedAt, ...spData } = sp;
      await prisma.speaker.upsert({
        where: { id: sp.id },
        update: spData,
        create: spData
      });
    }
  } else {
    console.warn('speakers.json not found in seed_data.');
  }

  // 4. Seed Sponsors
  const sponsorsPath = path.join(SEED_DATA_DIR, 'sponsors.json');
  if (fs.existsSync(sponsorsPath)) {
    const sponsors = JSON.parse(fs.readFileSync(sponsorsPath, 'utf-8'));
    console.log(`Found ${sponsors.length} sponsors to seed.`);
    for (const sp of sponsors) {
      const { createdAt, updatedAt, ...spData } = sp;
      await prisma.sponsor.upsert({
        where: { id: sp.id },
        update: spData,
        create: spData
      });
    }
  } else {
    console.warn('sponsors.json not found in seed_data.');
  }

  // 5. Seed Events
  const eventsPath = path.join(SEED_DATA_DIR, 'events.json');
  if (fs.existsSync(eventsPath)) {
    const events = JSON.parse(fs.readFileSync(eventsPath, 'utf-8'));
    console.log(`Found ${events.length} events to seed.`);
    for (const ev of events) {
      const { createdAt, updatedAt, ...evData } = ev;
      await prisma.event.upsert({
        where: { id: ev.id },
        update: evData,
        create: evData
      });
    }
  } else {
    console.warn('events.json not found in seed_data.');
  }

  // 6. Seed Proceedings
  const proceedingsPath = path.join(SEED_DATA_DIR, 'proceedings.json');
  if (fs.existsSync(proceedingsPath)) {
    const proceedings = JSON.parse(fs.readFileSync(proceedingsPath, 'utf-8'));
    console.log(`Found ${proceedings.length} proceedings to seed.`);
    for (const pr of proceedings) {
      const { createdAt, updatedAt, ...prData } = pr;
      await prisma.proceeding.upsert({
        where: { id: pr.id },
        update: prData,
        create: prData
      });
    }
  } else {
    console.warn('proceedings.json not found in seed_data.');
  }

  // 7. Seed Admin User
  console.log('Checking for Admin user...');
  const existingAdmin = await prisma.adminUser.findFirst();
  if (existingAdmin) {
    console.log('Admin user already exists:', existingAdmin.email);
  } else {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const newAdmin = await prisma.adminUser.create({
      data: {
        email: 'admin@iaam.com',
        password: hashedPassword,
      },
    });
    console.log('Admin user created successfully:', newAdmin.email);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
