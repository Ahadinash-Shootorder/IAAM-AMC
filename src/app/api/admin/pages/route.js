import { getPages, getPageLayout } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pagesConfig = await getPages();
    const filteredPages = pagesConfig.pages.filter(page => !page.id.startsWith('event-') && !page.id.startsWith('proceeding-'));
    const pagesWithSections = await Promise.all(
      filteredPages.map(async (page) => {
        const layout = await getPageLayout(page.id);
        return {
          ...page,
          sections: layout.sections || [],
        };
      })
    );
    return Response.json({ pages: pagesWithSections });
  } catch (error) {
    return Response.json({ error: 'Failed to read pages' }, { status: 500 });
  }
}
