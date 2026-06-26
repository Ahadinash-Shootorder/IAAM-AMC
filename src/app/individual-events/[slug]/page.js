import { EventDetailContent, generateMetadata as sharedGenerateMetadata } from '../../events/[slug]/page';

export const dynamic = 'force-dynamic';
export const generateMetadata = sharedGenerateMetadata;
export default EventDetailContent;
