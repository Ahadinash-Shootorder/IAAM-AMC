const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const SEED_DATA_DIR = path.join(__dirname, 'seed_data');

async function main() {
  console.log('Seeding database. Prioritizing backups in data/ ...');

  // 1. Seed Speakers
  const backupSpeakersPath = path.join(process.cwd(), 'data', 'speakers.json');
  const speakersPath = fs.existsSync(backupSpeakersPath) ? backupSpeakersPath : path.join(SEED_DATA_DIR, 'speakers.json');
  if (fs.existsSync(speakersPath)) {
    const speakers = JSON.parse(fs.readFileSync(speakersPath, 'utf-8'));
    console.log(`Found ${speakers.length} speakers to seed (Source: ${speakersPath}).`);
    for (const sp of speakers) {
      const { createdAt, updatedAt, ...spData } = sp;
      await prisma.speaker.upsert({
        where: { id: sp.id },
        update: spData,
        create: spData
      });
    }
  } else {
    console.warn('Speakers json not found.');
  }

  // 2. Seed Sponsors
  const backupSponsorsPath = path.join(process.cwd(), 'data', 'sponsors.json');
  const sponsorsPath = fs.existsSync(backupSponsorsPath) ? backupSponsorsPath : path.join(SEED_DATA_DIR, 'sponsors.json');
  if (fs.existsSync(sponsorsPath)) {
    const sponsors = JSON.parse(fs.readFileSync(sponsorsPath, 'utf-8'));
    console.log(`Found ${sponsors.length} sponsors to seed (Source: ${sponsorsPath}).`);
    for (const sp of sponsors) {
      const { createdAt, updatedAt, ...spData } = sp;
      await prisma.sponsor.upsert({
        where: { id: sp.id },
        update: spData,
        create: spData
      });
    }
  } else {
    console.warn('Sponsors json not found.');
  }

  // 3. Seed Events
  const backupEventsPath = path.join(process.cwd(), 'data', 'events.json');
  const eventsPath = fs.existsSync(backupEventsPath) ? backupEventsPath : path.join(SEED_DATA_DIR, 'events.json');
  if (fs.existsSync(eventsPath)) {
    const events = JSON.parse(fs.readFileSync(eventsPath, 'utf-8'));
    console.log(`Found ${events.length} events to seed (Source: ${eventsPath}).`);
    const usedSlugs = new Set();
    for (const ev of events) {
      const { createdAt, updatedAt, ...evData } = ev;
      let slug = ev.slug;
      if (!slug) {
        const baseSlug = ev.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        slug = baseSlug;
        let counter = 1;
        while (usedSlugs.has(slug)) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }
      }
      usedSlugs.add(slug);

      await prisma.event.upsert({
        where: { id: ev.id },
        update: { ...evData, slug },
        create: { ...evData, slug }
      });
    }
  } else {
    console.warn('Events json not found.');
  }

  // 4. Seed Proceedings
  const backupProceedingsPath = path.join(process.cwd(), 'data', 'proceedings.json');
  const proceedingsPath = fs.existsSync(backupProceedingsPath) ? backupProceedingsPath : path.join(SEED_DATA_DIR, 'proceedings.json');
  if (fs.existsSync(proceedingsPath)) {
    const proceedings = JSON.parse(fs.readFileSync(proceedingsPath, 'utf-8'));
    console.log(`Found ${proceedings.length} proceedings to seed (Source: ${proceedingsPath}).`);
    for (const pr of proceedings) {
      const { createdAt, updatedAt, ...prData } = pr;
      await prisma.proceeding.upsert({
        where: { id: pr.id },
        update: prData,
        create: prData
      });
    }
  } else {
    console.warn('Proceedings json not found.');
  }

  // 5. Seed Pages and Sections (Dynamic Layout restoration)
  const pagesDir = path.join(process.cwd(), 'data', 'pages');
  if (fs.existsSync(pagesDir)) {
    console.log('Restoring pages and sections from data/pages/ backup directory...');
    const pageIds = fs.readdirSync(pagesDir).filter(name => {
      return fs.statSync(path.join(pagesDir, name)).isDirectory();
    });

    let staticPagesMap = {};
    const dataPagesPath = path.join(process.cwd(), 'data', 'pages.json');
    if (fs.existsSync(dataPagesPath)) {
      try {
        const dataPages = JSON.parse(fs.readFileSync(dataPagesPath, 'utf-8'));
        if (Array.isArray(dataPages.pages)) {
          dataPages.pages.forEach(p => {
            staticPagesMap[p.id] = { label: p.label, route: p.route };
          });
        }
      } catch (e) {
        console.error('Error reading data/pages.json:', e);
      }
    }

    for (const pageId of pageIds) {
      const pageDirPath = path.join(pagesDir, pageId);
      
      let label = pageId.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      let route = `/${pageId}`;
      
      if (staticPagesMap[pageId]) {
        label = staticPagesMap[pageId].label;
        route = staticPagesMap[pageId].route;
      } else if (pageId.startsWith('event-')) {
        const eventId = pageId.slice(6);
        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (event) {
          label = `Event: ${event.title}`;
          route = `/events/${event.slug || event.id}`;
        } else {
          label = `Event Layout: ${eventId}`;
          route = `/events`;
        }
      }
      
      await prisma.page.upsert({
        where: { id: pageId },
        update: { label, route },
        create: { id: pageId, label, route }
      });
      
      let sectionLayoutMap = {};
      const layoutPath = path.join(pageDirPath, 'layout.json');
      if (fs.existsSync(layoutPath)) {
        try {
          const layoutObj = JSON.parse(fs.readFileSync(layoutPath, 'utf-8'));
          if (Array.isArray(layoutObj.sections)) {
            layoutObj.sections.forEach((s, idx) => {
              sectionLayoutMap[s.id] = {
                order: s.order ?? idx,
                visible: s.visible ?? true
              };
            });
          }
        } catch (e) {
          console.error(`Error parsing layout.json for ${pageId}:`, e);
        }
      }
      
      const files = fs.readdirSync(pageDirPath).filter(f => f.endsWith('.json') && f !== 'layout.json');
      for (const file of files) {
        const sectionId = file.slice(0, -5);
        const filePath = path.join(pageDirPath, file);
        
        try {
          const sectionContent = fs.readFileSync(filePath, 'utf-8');
          JSON.parse(sectionContent); // Validate JSON
          
          let order = 0;
          let visible = true;
          if (sectionLayoutMap[sectionId]) {
            order = sectionLayoutMap[sectionId].order;
            visible = sectionLayoutMap[sectionId].visible;
          }
          
          let secLabel = sectionId.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          const standardLabels = {
            header: 'Header / Navigation',
            footer: 'Footer / Layout',
            hero: 'Hero Banner',
            stats: 'Stats Row',
            speakers: 'Speakers Section',
            becomeMember: 'Become a Member',
            explore: 'Explore Section',
            sponsors: 'Sponsors Section',
            becomeSponsor: 'Become a Sponsor',
            aboutHero: 'About Hero',
            ourStory: 'Our Story',
            globalEvents: 'Global Events',
            eventsList: 'Events List',
            proceedingsList: 'Proceedings List',
            assembliesHero: 'Assemblies Hero',
            assembliesTabs: 'Assemblies Navigation Tabs',
            assembliesCards: 'Assemblies Categories',
            assembliesCta: 'Assemblies Call to Action',
            awardsHero: 'Awards Hero',
            awardsIntro: 'Awards Introduction',
            awardsCategories: 'Awards Categories',
            awardsNomination: 'Awards Nomination',
            awardsPublications: 'Awards Publications',
            awardsLaureates: 'Awards Laureates',
            eventHero: 'Event Hero Banner',
            eventIntro: 'Decade of Excellence',
            eventSymposia: 'Conference Symposia',
            eventHighlights: 'Conference Highlights',
            eventSDGs: 'UNSDGs Commitments',
            eventPublications: 'Indexed Publications'
          };
          if (standardLabels[sectionId]) {
            secLabel = standardLabels[sectionId];
          }
          
          await prisma.section.upsert({
            where: { pageId_id: { pageId, id: sectionId } },
            update: {
              label: secLabel,
              visible,
              order,
              content: sectionContent,
              draftContent: null
            },
            create: {
              id: sectionId,
              pageId,
              label: secLabel,
              visible,
              order,
              content: sectionContent,
              draftContent: null
            }
          });
        } catch (e) {
          console.error(`Failed to seed section ${pageId}/${sectionId}:`, e);
        }
      }
    }
  } else {
    // Fallback: Seed Pages and Sections from seed_data defaults
    console.log('Restoring pages and sections from prisma/seed_data static configuration...');
    const pagesPath = path.join(SEED_DATA_DIR, 'pages.json');
    if (fs.existsSync(pagesPath)) {
      const pages = JSON.parse(fs.readFileSync(pagesPath, 'utf-8'));
      for (const page of pages) {
        await prisma.page.upsert({
          where: { id: page.id },
          update: { label: page.label, route: page.route },
          create: { id: page.id, label: page.label, route: page.route }
        });
      }
    }

    const sectionsPath = path.join(SEED_DATA_DIR, 'sections.json');
    if (fs.existsSync(sectionsPath)) {
      const sections = JSON.parse(fs.readFileSync(sectionsPath, 'utf-8'));
      for (const sec of sections) {
        await prisma.section.upsert({
          where: { pageId_id: { pageId: sec.pageId, id: sec.id } },
          update: {
            label: sec.label,
            visible: sec.visible,
            order: sec.order
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
    }
  }

  // 6. Seed Admin User
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
