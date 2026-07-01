'use client';

import { useState, useEffect, useRef, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import CrudTable from '@/components/Admin/CrudTable';
import MediaPickerModal from '@/components/Admin/MediaPickerModal';
import RichTextEditor from '@/components/Admin/RichTextEditor';
import LinkInput from '@/components/Admin/LinkInput';
import { FiClock, FiSave, FiEye, FiUploadCloud, FiImage } from 'react-icons/fi';

// Map page IDs to their DB event type for interlinked filtering
const dbBackedSections = {
  'upcoming-events.eventsList': { type: 'events', filter: 'upcoming', label: 'Upcoming Events' },
  'individual-events.eventsList': { type: 'events', filter: 'individual', label: 'Individual Events' },
  'congress-archive.eventsList': { type: 'events', filter: 'archive', label: 'Archive Events' },
  'congress-proceedings.proceedingsList': { type: 'proceedings', filter: null, label: 'Congress Proceedings' },
};

// Schema definitions for each section's editable fields
const sectionSchemas = {
  header: {
    label: 'Header / Navigation',
    fields: [
      { key: 'logo', label: 'Logo Image', type: 'image' },
      {
        key: 'navItems', label: 'Navigation Items', type: 'array', itemFields: [
          { key: 'label', label: 'Label', type: 'text' },
          { key: 'link', label: 'Link URL', type: 'text' },
        ]
      },
      { key: 'ctaButton.text', label: 'CTA Button Text', type: 'text' },
      { key: 'ctaButton.link', label: 'CTA Button Link', type: 'text' },
    ],
  },
  hero: {
    label: 'Hero Banner',
    fields: [
      { key: 'backgroundImage', label: 'Background Image (Desktop / Default)', type: 'image' },
      { key: 'backgroundImageMobile', label: 'Background Image (Mobile)', type: 'image' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'tagline', label: 'Tagline', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      {
        key: 'buttons', label: 'Buttons', type: 'array', itemFields: [
          { key: 'text', label: 'Button Text', type: 'text' },
          { key: 'link', label: 'Button Link', type: 'text' },
          { key: 'style', label: 'Style (primary/outline)', type: 'text' },
        ]
      },
      {
        key: 'bottomStats', label: 'Bottom Stats', type: 'array', itemFields: [
          { key: 'text', label: 'Stat Text', type: 'text' },
        ]
      },
    ],
  },
  stats: {
    label: 'Stats Bar',
    fields: [
      {
        key: 'items', label: 'Stats', type: 'array', itemFields: [
          { key: 'number', label: 'Number', type: 'text' },
          { key: 'label', label: 'Label', type: 'text' },
        ]
      },
    ],
  },
  'home.speakers': {
    label: 'Home Speakers Section',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
    ],
  },
  'about.speakers': {
    label: 'About Speakers Section',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
    ],
  },
  'about.sponsors': {
    label: 'About Sponsors Section',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
    ],
  },
  aboutHero: {
    label: 'About Hero',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'image', label: 'Side Image', type: 'image' },
    ],
  },
  ourStory: {
    label: 'Our Story',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'paragraphs', label: 'Paragraphs', type: 'stringArray' },
      { key: 'image', label: 'Side Image', type: 'image' },
    ],
  },
  globalEvents: {
    label: 'Global Events',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      {
        key: 'events', label: 'Event Images', type: 'array', itemFields: [
          { key: 'image', label: 'Image', type: 'image' },
        ]
      },
    ],
  },
  eventsList: {
    label: 'Events List',
    fields: [
      { key: 'title', label: 'Page Title', type: 'text' },
    ],
  },
  proceedingsHeader: {
    label: 'Page Header / Title',
    fields: [
      { key: 'title', label: 'Page Title', type: 'text' },
    ],
  },
  proceedingsList: {
    label: 'Proceedings List',
    fields: [],
  },
  proceedingHero: {
    label: 'Hero Section',
    fields: [
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'author', label: 'Author Name', type: 'text' },
      { key: 'date', label: 'Date Text', type: 'text' },
    ]
  },
  proceedingDownload: {
    label: 'Download Section',
    fields: [
      { key: 'buttonText', label: 'Button Text', type: 'text' },
      { key: 'pdfUrl', label: 'PDF File', type: 'file' },
    ]
  },
  proceedingContent: {
    label: 'Main Content',
    fields: [
      { key: 'htmlContent', label: 'Report HTML Content', type: 'textarea' },
    ]
  },
  relatedProceedings: {
    label: 'Related Proceedings',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
      { key: 'exploreText', label: 'Explore Link Text', type: 'text' },
      { key: 'exploreLink', label: 'Explore Link URL', type: 'text' },
    ]
  },
  becomeMember: {
    label: 'Become Member CTA',
    fields: [
      { key: 'titlePrefix', label: 'Title Prefix', type: 'text' },
      { key: 'type', label: 'Type (Member)', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'subDescription', label: 'Sub Description', type: 'textarea' },
      { key: 'buttonText', label: 'Button Text', type: 'text' },
      { key: 'buttonLink', label: 'Button Link', type: 'text' },
      { key: 'backgroundImage', label: 'Background Image (Desktop)', type: 'image' },
      { key: 'backgroundImageMobile', label: 'Background Image (Mobile)', type: 'image' },
    ],
  },
  explore: {
    label: 'Explore More',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
      {
        key: 'cards', label: 'Cards', type: 'array', itemFields: [
          { key: 'heading', label: 'Heading', type: 'text' },
          { key: 'subHeading', label: 'Sub Heading', type: 'text' },
          { key: 'buttonText', label: 'Button Text', type: 'text' },
          { key: 'buttonLink', label: 'Button Link', type: 'text' },
          { key: 'image', label: 'Card Image', type: 'image' },
        ]
      },
    ],
  },
  sponsors: {
    label: 'Sponsors',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
    ],
  },
  becomeSponsor: {
    label: 'Become Sponsor CTA',
    fields: [
      { key: 'titlePrefix', label: 'Title Prefix', type: 'text' },
      { key: 'type', label: 'Type (Sponsor)', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'subDescription', label: 'Sub Description', type: 'textarea' },
      { key: 'buttonText', label: 'Button Text', type: 'text' },
      { key: 'buttonLink', label: 'Button Link', type: 'text' },
      { key: 'backgroundImage', label: 'Background Image (Desktop)', type: 'image' },
      { key: 'backgroundImageMobile', label: 'Background Image (Mobile)', type: 'image' },
    ],
  },
  footer: {
    label: 'Footer',
    fields: [
      { key: 'title', label: 'Organization Name', type: 'text' },
      { key: 'subtitle', label: 'Location', type: 'text' },
      { key: 'infoTexts', label: 'Info Texts', type: 'stringArray' },
      {
        key: 'links', label: 'Quick Links', type: 'array', itemFields: [
          { key: 'label', label: 'Link Text', type: 'text' },
          { key: 'link', label: 'Link URL', type: 'text' },
        ]
      },
      { key: 'bottomText', label: 'Bottom Text', type: 'text' },
    ],
  },
  'site-identity': {
    label: 'Site Identity & SEO',
    fields: [
      { key: 'websiteTitle', label: 'Website Title', type: 'text' },
      { key: 'websiteDescription', label: 'Website Description', type: 'textarea' },
      { key: 'keywords', label: 'Keywords (Comma separated)', type: 'text' },
      { key: 'faviconImage', label: 'Favicon (.ico or .png)', type: 'image' },
      { key: 'ogImage', label: 'OpenGraph Image (Banner for social sharing)', type: 'image' },
    ],
  },
  assembliesHero: {
    label: 'Assemblies Hero Banner',
    fields: [
      { key: 'backgroundImage', label: 'Background Image', type: 'image' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      {
        key: 'badges', label: 'Badges', type: 'array', itemFields: [
          { key: 'icon', label: 'Icon Type (globe/radio/etc.)', type: 'text' },
          { key: 'text', label: 'Badge Text', type: 'text' },
        ]
      },
    ],
  },
  assembliesTabs: {
    label: 'Assemblies Tab Buttons',
    fields: [
      {
        key: 'tabs', label: 'Tabs List', type: 'array', itemFields: [
          { key: 'label', label: 'Tab Label', type: 'text' },
          { key: 'link', label: 'Link URL', type: 'text' },
          { key: 'isActive', label: 'Is Active (true/false)', type: 'text' },
        ]
      },
    ],
  },
  assembliesCards: {
    label: 'Congress Cards',
    fields: [
      {
        key: 'cards', label: 'Event Cards', type: 'array', itemFields: [
          { key: 'image', label: 'Card Image', type: 'image' },
          { key: 'isFeatured', label: 'Is Featured (true/false)', type: 'text' },
          { key: 'date', label: 'Date', type: 'text' },
          { key: 'location', label: 'Location', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          {
            key: 'stats', label: 'Stats', type: 'subArray', subFields: [
              { key: 'value', label: 'Value (e.g. 500+)' },
              { key: 'label', label: 'Label (e.g. Delegates)' },
            ]
          },
          {
            key: 'buttons', label: 'Buttons', type: 'subArray', subFields: [
              { key: 'text', label: 'Button Text' },
              { key: 'link', label: 'Button Link' },
            ]
          }
        ]
      }
    ]
  },
  assembliesCta: {
    label: 'Cannot Find Congress CTA',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      {
        key: 'buttons', label: 'Action Buttons', type: 'array', itemFields: [
          { key: 'text', label: 'Button Text', type: 'text' },
          { key: 'link', label: 'Button Link', type: 'text' },
        ]
      },
      {
        key: 'features', label: 'Right Side Feature Cards', type: 'array', itemFields: [
          { key: 'title', label: 'Card Title', type: 'text' },
          { key: 'iconType', label: 'Icon Type (sparkles / publish)', type: 'text' },
        ]
      }
    ]
  },
  awardsHero: {
    label: 'Awards Hero Banner',
    fields: [
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  awardsIntro: {
    label: 'FIAAM Introduction',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'image', label: 'Trophy Image', type: 'image' },
      { key: 'quoteText', label: 'Quote Text', type: 'textarea' },
      {
        key: 'criteriaList', label: 'Criteria Cards', type: 'array', itemFields: [
          { key: 'title', label: 'Card Title', type: 'text' },
          { key: 'description', label: 'Card Description', type: 'textarea' },
        ]
      },
    ],
  },
  awardsCategories: {
    label: 'Awards Categories Grid',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
      { key: 'description', label: 'Section Description', type: 'textarea' },
      {
        key: 'categories', label: 'Awards Categories', type: 'array', itemFields: [
          { key: 'badge', label: 'Badge (uppercase label)', type: 'text' },
          { key: 'title', label: 'Award Title', type: 'text' },
          { key: 'description', label: 'Award Description', type: 'textarea' },
          { key: 'theme', label: 'Theme (dark-blue/purple/white/white-2/light-orange)', type: 'text' },
        ]
      },
    ],
  },
  awardsPublications: {
    label: 'Indexed Publications Grid',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
      { key: 'description', label: 'Section Description', type: 'textarea' },
      {
        key: 'items', label: 'Publication Columns', type: 'array', itemFields: [
          { key: 'title', label: 'Publication Title', type: 'text' },
          { key: 'description', label: 'Publication Description', type: 'textarea' },
          { key: 'linkText', label: 'Link Label Text', type: 'text' },
          { key: 'linkUrl', label: 'Link URL / Path', type: 'text' },
        ]
      },
    ],
  },
  awardsNomination: {
    label: 'Nomination Process & Form',
    fields: [
      { key: 'title', label: 'Process Title', type: 'text' },
      { key: 'description', label: 'Process Description', type: 'textarea' },
      {
        key: 'steps', label: 'Process Steps', type: 'array', itemFields: [
          { key: 'number', label: 'Step Number (e.g. 01)', type: 'text' },
          { key: 'title', label: 'Step Title', type: 'text' },
          { key: 'description', label: 'Step Description', type: 'textarea' },
        ]
      },
      { key: 'formTitle', label: 'Form Box Title', type: 'text' },
      { key: 'categories', label: 'Form Category Options (string array)', type: 'stringArray' },
    ],
  },
  awardsLaureates: {
    label: 'Distinguished Fellows Directory',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
      { key: 'description', label: 'Section Description', type: 'textarea' },
      { key: 'ctaText', label: 'CTA Link Label', type: 'text' },
      { key: 'ctaLink', label: 'CTA Link URL', type: 'text' },
      {
        key: 'laureates', label: 'Laureate Cards', type: 'array', itemFields: [
          { key: 'image', label: 'Laureate Image', type: 'image' },
          { key: 'name', label: 'Full Name', type: 'text' },
          { key: 'title', label: 'Award Title / Designation', type: 'text' },
          { key: 'description', label: 'Biography', type: 'textarea' },
          { key: 'affiliation', label: 'Academic Affiliation', type: 'text' },
        ]
      },
    ],
  },
  eventHero: {
    label: 'Event Hero Banner',
    fields: [
      { key: 'edition', label: 'Edition Label (e.g. 8th)', type: 'text' },
      { key: 'editionSuffix', label: 'Edition Suffix (e.g. Anniversary Edition)', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'tagline', label: 'Tagline', type: 'textarea' },
      { key: 'date', label: 'Date Text', type: 'text' },
      { key: 'location', label: 'Location Text', type: 'text' },
      { key: 'registerText', label: 'Register Button Text', type: 'text' },
      { key: 'registerLink', label: 'Register Button Link', type: 'text' },
      { key: 'programText', label: 'Program Button Text', type: 'text' },
      { key: 'programLink', label: 'Program Button Link', type: 'text' },
      { key: 'backgroundImage', label: 'Background Image', type: 'image' },
    ]
  },
  eventIntro: {
    label: 'Decade of Excellence (Intro)',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
      { key: 'paragraphs', label: 'Paragraphs', type: 'stringArray' },
      { key: 'image', label: 'Side Image', type: 'image' },
      {
        key: 'stats', label: 'Stats Boxes', type: 'array', itemFields: [
          { key: 'value', label: 'Stat Value (e.g. 60+)', type: 'text' },
          { key: 'label', label: 'Stat Label (e.g. PAST ASSEMBLIES)', type: 'text' },
        ]
      }
    ]
  },
  eventSymposia: {
    label: 'Conference Symposia',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
      { key: 'description', label: 'Section Description', type: 'textarea' },
      {
        key: 'symposia', label: 'Symposia Cards', type: 'array', itemFields: [
          { key: 'title', label: 'Card Title', type: 'text' },
          { key: 'description', label: 'Card Description', type: 'textarea' },
        ]
      },
      { key: 'flyerText', label: 'Download Button Text', type: 'text' },
      { key: 'flyerLink', label: 'Download Button Link', type: 'text' },
    ]
  },
  eventDeadlines: {
    label: 'Critical Deadlines',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
      { key: 'description', label: 'Section Description', type: 'textarea' },
      {
        key: 'deadlines', label: 'Deadline Cards', type: 'array', itemFields: [
          { key: 'label', label: 'Label (e.g. EARLY-BIRD)', type: 'text' },
          { key: 'date', label: 'Date Text', type: 'text' },
          { key: 'description', label: 'Details', type: 'textarea' },
        ]
      }
    ]
  },
  eventHighlights: {
    label: 'Conference Highlights',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
      { key: 'description', label: 'Section Description', type: 'textarea' },
      {
        key: 'highlights', label: 'Highlight Cards', type: 'array', itemFields: [
          { key: 'yearRange', label: 'Year Range (e.g. 2011 to 2015)', type: 'text' },
          { key: 'title', label: 'Card Title', type: 'text' },
          { key: 'image', label: 'Card Image', type: 'image' },
        ]
      }
    ]
  },
  eventSDGs: {
    label: 'UNSDGs Commitments',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
      { key: 'description', label: 'Section Description', type: 'textarea' },
      { key: 'reportText', label: 'Report Link Text', type: 'text' },
      { key: 'reportLink', label: 'Report Link URL', type: 'text' },
      {
        key: 'goals', label: 'SDG Cards', type: 'array', itemFields: [
          { key: 'number', label: 'Goal Number (e.g. Goal 7)', type: 'text' },
          { key: 'title', label: 'Goal Title', type: 'text' },
          { key: 'description', label: 'Goal Description', type: 'textarea' },
          { key: 'bgColor', label: 'Background Color (hex, e.g. #DBEAFE)', type: 'text' },
          { key: 'iconColor', label: 'Icon / Text Color (hex, e.g. #2563EB)', type: 'text' },
        ]
      }
    ]
  },
  eventPublications: {
    label: 'Indexed Publications',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
      { key: 'description', label: 'Section Description', type: 'textarea' },
      {
        key: 'publications', label: 'Publications', type: 'array', itemFields: [
          { key: 'title', label: 'Publication Title', type: 'text' },
          { key: 'description', label: 'Publication Description', type: 'textarea' },
          { key: 'linkText', label: 'Link Text', type: 'text' },
          { key: 'linkUrl', label: 'Link URL', type: 'text' },
        ]
      }
    ]
  },
  // ── Contacts Page ───────────────────────────────────────────────────────────
  contactsTitle: {
    label: 'Contacts Page Title',
    fields: [
      { key: 'title', label: 'Page Title (e.g. CONTACT US)', type: 'text' },
    ],
  },
  contactsDetails: {
    label: 'Contact Details',
    fields: [
      { key: 'heading', label: 'Section Heading', type: 'text' },
      { key: 'description', label: 'Introductory Description', type: 'textarea' },
      { key: 'address', label: 'Office Address', type: 'text' },
      { key: 'phone', label: 'Phone Number', type: 'text' },
      { key: 'email', label: 'Email Address', type: 'text' },
    ],
  },
  contactsMap: {
    label: 'Google Maps Embed',
    fields: [
      { key: 'embedUrl', label: 'Google Maps Embed URL (iframe src)', type: 'text' },
    ],
  },
};

// Helper to get nested value from an object using dot notation
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Helper to set nested value in an object using dot notation
function setNestedValue(obj, path, value) {
  const clone = JSON.parse(JSON.stringify(obj));
  const keys = path.split('.');
  let current = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
  return clone;
}

export default function SectionEditor({ params }) {
  const { pageId, section } = use(params);
  const router = useRouter();
  const [data, setData] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingType, setSavingType] = useState(null); // 'draft' | 'publish' | null
  const saving = savingType !== null;
  const [toast, setToast] = useState(null);
  const [uploading, setUploading] = useState(null);
  const [dragArrayKey, setDragArrayKey] = useState(null);
  const [dragArrayOverIdx, setDragArrayOverIdx] = useState(null);
  const [expandedArrayItems, setExpandedArrayItems] = useState({});
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerField, setMediaPickerField] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);
  const arrayDragItem = useRef(null);
  const arrayDragOverItem = useRef(null);

  // Compute if there are unsaved changes
  const isDirty = initialData !== null && JSON.stringify(data) !== JSON.stringify(initialData);

  const showToast = useCallback((message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const schema = sectionSchemas[`${pageId}.${section}`] || sectionSchemas[section];

  // Check if this section is DB-backed (events/proceedings)
  const dbConfig = dbBackedSections[`${pageId}.${section}`];

  // Warn on browser unload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  const handleBack = () => {
    if (isDirty) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to go back?')) {
        return;
      }
    }
    router.push(`/admin/pages/${pageId}`);
  };

  useEffect(() => {
    if (!schema && !dbConfig) {
      router.push(`/admin/pages/${pageId}`);
      return;
    }

    async function fetchData() {
      try {
        const res = await fetch(`/api/admin/pages/${pageId}/content/${section}`);
        const json = await res.json();
        setData(json);
        setInitialData(JSON.parse(JSON.stringify(json)));
      } catch (err) {
        setData({});
        setInitialData({});
        showToast('Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [pageId, section, schema, dbConfig, router, showToast]);

  async function handleSave(asDraft = false) {
    const isDraft = asDraft === true;
    setSavingType(isDraft ? 'draft' : 'publish');
    try {
      const res = await fetch(`/api/admin/pages/${pageId}/content/${section}${isDraft ? '?draft=true' : ''}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        showToast(isDraft ? 'Draft saved!' : 'Published successfully!', 'success');
        setInitialData(JSON.parse(JSON.stringify(data)));
      } else {
        showToast('Failed to save', 'error');
      }
    } catch (err) {
      showToast('Failed to save', 'error');
    } finally {
      setSavingType(null);
    }
  }

  async function handlePreview() {
    let route;
    if (pageId === 'home' || pageId === 'global') {
      route = '/';
    } else if (pageId === 'fellow-awards') {
      route = '/fellow-&-awards';
    } else if (pageId.startsWith('event-')) {
      try {
        const eventId = pageId.slice(6);
        const res = await fetch(`/api/admin/events/${eventId}`);
        const event = await res.json();
        if (event && event.slug) {
          if (event.eventType === 'upcoming') {
            route = `/upcoming-events/${event.slug}`;
          } else if (event.eventType === 'individual') {
            route = `/individual-events/${event.slug}`;
          } else if (event.eventType === 'archive') {
            route = `/congress-archive/${event.slug}`;
          } else {
            route = `/events/${event.slug}`;
          }
        } else {
          route = `/events/${eventId}`;
        }
      } catch (err) {
        route = `/events/${pageId.slice(6)}`;
      }
    } else {
      route = `/${pageId}`;
    }
    window.open(`${route}?preview=true`, '_blank');
  }

  async function fetchHistory() {
    try {
      const res = await fetch(`/api/admin/pages/${pageId}/history/${section}`);
      const data = await res.json();
      setHistoryItems(data.history || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRestoreHistory(historyId) {
    if (!confirm('This will overwrite your current draft with the selected version. Are you sure?')) return;

    try {
      const res = await fetch(`/api/admin/pages/${pageId}/history/${section}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ historyId }),
      });
      const result = await res.json();
      if (result.success) {
        setData(result.restoredContent);
        setInitialData(JSON.parse(JSON.stringify(result.restoredContent)));
        setHistoryOpen(false);
        showToast('Version restored to draft!', 'success');
      } else {
        showToast('Failed to restore', 'error');
      }
    } catch (err) {
      showToast('Failed to restore', 'error');
    }
  }

  async function handleImageUpload(fieldPath, file, arrayIndex) {
    const uploadKey = arrayIndex !== undefined ? `${fieldPath}-${arrayIndex}` : fieldPath;
    setUploading(uploadKey);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('pageId', pageId);
    formData.append('section', section);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();

      if (result.success) {
        if (arrayIndex !== undefined) {
          // Field inside an array item
          const arrayKey = fieldPath.split('.')[0];
          const itemField = fieldPath.split('.')[1];
          const updated = JSON.parse(JSON.stringify(data));
          updated[arrayKey][arrayIndex][itemField] = result.path;
          setData(updated);
        } else {
          setData(setNestedValue(data, fieldPath, result.path));
        }
        showToast('Image uploaded!', 'success');
      } else {
        showToast('Upload failed', 'error');
      }
    } catch (err) {
      showToast('Upload failed', 'error');
    } finally {
      setUploading(null);
    }
  }

  function handleFieldChange(fieldPath, value) {
    setData(setNestedValue(data, fieldPath, value));
  }

  function handleArrayItemChange(arrayKey, index, itemKey, value) {
    const updated = JSON.parse(JSON.stringify(data));
    updated[arrayKey][index][itemKey] = value;
    setData(updated);
  }

  function addArrayItem(arrayKey, itemFields) {
    const updated = JSON.parse(JSON.stringify(data));
    const newItem = {};
    itemFields.forEach((f) => {
      newItem[f.key] = '';
    });
    if (!updated[arrayKey]) updated[arrayKey] = [];
    updated[arrayKey].push(newItem);
    setData(updated);
  }

  function removeArrayItem(arrayKey, index) {
    const updated = JSON.parse(JSON.stringify(data));
    updated[arrayKey].splice(index, 1);
    setData(updated);
  }

  // Drag-and-drop for array items (nav items, speakers, sponsors etc.)
  function handleArrayDragStart(e, arrayKey, index) {
    arrayDragItem.current = index;
    setDragArrayKey(arrayKey);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleArrayDragEnter(arrayKey, index) {
    if (dragArrayKey !== arrayKey) return;
    arrayDragOverItem.current = index;
    setDragArrayOverIdx(index);
  }

  function handleArrayDragEnd(arrayKey) {
    setDragArrayOverIdx(null);
    setDragArrayKey(null);
    if (arrayDragItem.current === null || arrayDragOverItem.current === null) return;
    if (arrayDragItem.current === arrayDragOverItem.current) {
      arrayDragItem.current = null;
      arrayDragOverItem.current = null;
      return;
    }

    const updated = JSON.parse(JSON.stringify(data));
    const items = updated[arrayKey];
    const dragged = items[arrayDragItem.current];
    items.splice(arrayDragItem.current, 1);
    items.splice(arrayDragOverItem.current, 0, dragged);
    updated[arrayKey] = items;

    arrayDragItem.current = null;
    arrayDragOverItem.current = null;
    setData(updated);
  }

  const toggleArrayItem = (fieldKey, idx) => {
    const key = `${fieldKey}-${idx}`;
    setExpandedArrayItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleStringArrayChange = (fieldKey, idx, value) => {
    const updated = JSON.parse(JSON.stringify(data));
    updated[fieldKey][idx] = value;
    setData(updated);
  }

  function addStringArrayItem(key) {
    const updated = JSON.parse(JSON.stringify(data));
    if (!updated[key]) updated[key] = [];
    updated[key].push('');
    setData(updated);
  }

  function removeStringArrayItem(key, index) {
    const updated = JSON.parse(JSON.stringify(data));
    updated[key].splice(index, 1);
    setData(updated);
  }

  if (!schema && !dbConfig) return null;

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner} />
        <p>Loading {schema?.label || dbConfig?.label}...</p>
      </div>
    );
  }

  // DB-backed section: show CrudTable with filtered data
  if (dbConfig) {
    const eventsTableColumns = [
      { key: 'title', label: 'Event Title' },
      { key: 'slug', label: 'Slug' },
      { key: 'order', label: 'Order' },
    ];
    const eventsFormColumns = [
      { key: 'title', label: 'Event Title', required: true },
      { key: 'slug', label: 'Slug' },
      { key: 'image', label: 'Card Image Override', type: 'image' },
      { key: 'link', label: 'External Event Link (Optional)' },
      { key: 'order', label: 'Order', type: 'number' },
    ];
    const procTableColumns = [
      { key: 'title', label: 'Title' },
      { key: 'slug', label: 'Slug' },
      { key: 'category', label: 'Category' },
      { key: 'authors', label: 'Authors' },
      { key: 'featured', label: 'Featured' },
      { key: 'order', label: 'Order' },
    ];
    const procFormColumns = [
      { key: 'title', label: 'Title', required: true },
      { key: 'slug', label: 'Slug' },
      { key: 'category', label: 'Category', type: 'category' },
      { key: 'authors', label: 'Authors' },
      { key: 'pdfUrl', label: 'PDF File', type: 'file' },
      { key: 'date', label: 'Date' },
      { key: 'coverImage', label: 'Cover Image', type: 'image' },
      { key: 'link', label: 'Link' },
      { key: 'featured', label: 'Featured', type: 'boolean' },
      { key: 'description', label: 'Description (Rich Text)', type: 'textarea' },
      { key: 'order', label: 'Order', type: 'number' },
    ];

    const isEvents = dbConfig.type === 'events';
    const endpoint = isEvents
      ? `/api/admin/events?eventType=${dbConfig.filter}`
      : '/api/admin/proceedings';

    const renderCustomAction = (item) => (
      <Link
        href={`/admin/pages/event-${item.id}`}
        style={{
          background: '#1C3F9E',
          color: '#fff',
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '13px',
          fontWeight: '500',
          textDecoration: 'none',
          marginRight: '8px',
          display: 'inline-flex',
          alignItems: 'center'
        }}
      >
        Manage Content
      </Link>
    );

    return (
      <div className={styles.editor}>
        {toast && (
          <div className={`${styles.toast} ${styles[toast.type]}`}>
            {toast.message}
          </div>
        )}
        <div className={styles.editorHeader}>
          <button className={styles.backBtn} onClick={handleBack}>
            ← Back
          </button>
          <div className={styles.editorTitleGroup}>
            <h2 className={styles.editorTitle}>{dbConfig.label}</h2>
            <p className={styles.editorSubtitle}>Manage {dbConfig.label.toLowerCase()} — saved directly to database</p>
          </div>
        </div>

        {/* Page title field (still from JSON) */}
        {schema && data && schema.fields.length > 0 && (
          <div className={styles.fieldsContainer} style={{ marginBottom: '0' }}>
            {schema.fields.map((field) => (
              <div key={field.key} className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>{field.label}</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={getNestedValue(data, field.key) || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  />
                  <button className={styles.saveBtn} onClick={handleSave} disabled={saving} style={{ whiteSpace: 'nowrap' }}>
                    {saving ? 'Saving...' : 'Save Title'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DB-backed CrudTable */}
        <CrudTable
          title={dbConfig.label}
          endpoint={endpoint}
          tableColumns={isEvents ? eventsTableColumns : procTableColumns}
          formColumns={isEvents ? eventsFormColumns : procFormColumns}
          defaultValues={isEvents ? { eventType: dbConfig.filter } : {}}
          customAction={isEvents ? renderCustomAction : undefined}
        />
      </div>
    );
  }

  return (
    <div className={styles.editor}>
      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className={styles.editorHeader}>
        <button className={styles.backBtn} onClick={handleBack}>
          ← Back
        </button>
        <div className={styles.editorTitleGroup}>
          <h2 className={styles.editorTitle}>{schema.label}</h2>
          <p className={styles.editorSubtitle}>Edit section content and media</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className={styles.secondaryBtn}
            onClick={() => { fetchHistory(); setHistoryOpen(true); }}
          >
            <FiClock /> History
          </button>
          <button
            className={styles.secondaryBtn}
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            {savingType === 'draft' ? (
              <span className={styles.btnSpinnerContainer}><div className={styles.btnSpinner} /> Saving Draft...</span>
            ) : (
              <><FiSave /> Save Draft</>
            )}
          </button>
          <button
            className={styles.secondaryBtn}
            onClick={handlePreview}
            disabled={saving}
          >
            <FiEye /> Preview
          </button>
          <button
            className={styles.saveBtn}
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            {savingType === 'publish' ? (
              <span className={styles.btnSpinnerContainer}><div className={styles.btnSpinner} /> Publishing...</span>
            ) : (
              <><FiUploadCloud /> Publish Live</>
            )}
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className={styles.fieldsContainer}>
        {schema.fields.map((field) => (
          <div key={field.key} className={styles.fieldGroup}>
            {field.type === 'text' && (
              <>
                <label className={styles.fieldLabel}>{field.label}</label>
                {field.key.toLowerCase().includes('link') || field.key.toLowerCase().includes('url') ? (
                  <LinkInput
                    value={getNestedValue(data, field.key) || ''}
                    onChange={(val) => handleFieldChange(field.key, val)}
                  />
                ) : (
                  <input
                    type="text"
                    className={styles.textInput}
                    value={getNestedValue(data, field.key) || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  />
                )}
              </>
            )}

            {field.type === 'textarea' && (
              <>
                <label className={styles.fieldLabel}>{field.label}</label>
                <RichTextEditor
                  value={getNestedValue(data, field.key) || ''}
                  onChange={(html) => handleFieldChange(field.key, html)}
                  placeholder={`Enter ${field.label.toLowerCase()}...`}
                />
              </>
            )}

            {field.type === 'image' && (
              <>
                <label className={styles.fieldLabel}>{field.label}</label>
                <div className={styles.imageField}>
                  {getNestedValue(data, field.key) && (() => {
                    const rawImg = getNestedValue(data, field.key);
                    return (
                      <div className={styles.imagePreview}>
                        <Image
                          src={getNestedValue(data, field.key)}
                          alt="Preview"
                          fill
                          style={{ objectFit: 'contain' }}
                          unoptimized
                        />
                      </div>
                    );
                  })()}
                  <div className={styles.imageControls}>
                    <input
                      type="text"
                      className={styles.textInput}
                      value={getNestedValue(data, field.key) || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      placeholder="Image path or URL"
                    />
                    <label className={styles.uploadBtn}>
                      {uploading === field.key ? 'Uploading...' : <><FiUploadCloud /> Upload New</>}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleImageUpload(field.key, e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => { setMediaPickerField(field.key); setMediaPickerOpen(true); }}
                      style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s' }}
                      onMouseOver={(e) => { e.target.style.background = '#f1f5f9'; }}
                      onMouseOut={(e) => { e.target.style.background = '#f8fafc'; }}
                    >
                      <FiImage /> Select from Library
                    </button>
                    {getNestedValue(data, field.key) && (
                      <button
                        className={styles.removeBtn}
                        onClick={() => handleFieldChange(field.key, '')}
                        title="Remove Image"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {field.type === 'file' && (
              <>
                <label className={styles.fieldLabel}>{field.label}</label>
                <div className={styles.imageField}>
                  {getNestedValue(data, field.key) && (
                    <div className={styles.filePreview} style={{ padding: '12px', background: '#f1f5f9', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#334155' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <span style={{ wordBreak: 'break-all' }}>{getNestedValue(data, field.key)}</span>
                    </div>
                  )}
                  <div className={styles.imageControls}>
                    <input
                      type="text"
                      className={styles.textInput}
                      value={getNestedValue(data, field.key) || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      placeholder="File path or URL"
                    />
                    <label className={styles.uploadBtn}>
                      {uploading === field.key ? 'Uploading...' : <><FiUploadCloud /> Upload PDF / File</>}
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        hidden
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleImageUpload(field.key, e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                    {getNestedValue(data, field.key) && (
                      <button
                        className={styles.removeBtn}
                        onClick={() => handleFieldChange(field.key, '')}
                        title="Remove File"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {field.type === 'stringArray' && (
              <>
                <label className={styles.fieldLabel}>{field.label}</label>
                <div className={styles.arrayContainer}>
                  {(data?.[field.key] || []).map((item, idx) => (
                    <div key={idx} className={styles.stringArrayItem}>
                      <input
                        type="text"
                        className={styles.textInput}
                        value={item}
                        onChange={(e) => handleStringArrayChange(field.key, idx, e.target.value)}
                      />
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeStringArrayItem(field.key, idx)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    className={styles.addBtn}
                    onClick={() => addStringArrayItem(field.key)}
                  >
                    + Add Item
                  </button>
                </div>
              </>
            )}

            {field.type === 'array' && (
              <>
                <label className={styles.fieldLabel}>
                  {field.label}
                  <span className={styles.arrayCount}>
                    {(data?.[field.key] || []).length} items
                  </span>
                </label>
                <div className={styles.arrayContainer}>
                  {(data?.[field.key] || []).map((rawItem, idx) => {
                    const item = typeof rawItem === 'object' && rawItem !== null ? rawItem : {};
                    return (
                      <div
                        key={idx}
                        className={`${styles.arrayItem} ${dragArrayKey === field.key && dragArrayOverIdx === idx ? styles.arrayItemDragOver : ''}`}
                        draggable
                        onDragStart={(e) => handleArrayDragStart(e, field.key, idx)}
                        onDragEnter={() => handleArrayDragEnter(field.key, idx)}
                        onDragEnd={() => handleArrayDragEnd(field.key)}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        <div className={styles.arrayItemHeader}>
                          <div className={styles.arrayItemLeft}>
                            <span className={styles.arrayDragHandle} title="Drag to reorder">⠿</span>
                            <span className={styles.arrayItemIndex}>
                              #{idx + 1}
                              {(() => {
                                const titleField = field.itemFields.find(f => f.type === 'text');
                                const val = titleField ? item[titleField.key] : null;
                                return val ? ` - ${val}` : '';
                              })()}
                            </span>
                          </div>
                          <div className={styles.arrayItemActions}>
                            <button
                              className={styles.editBtn}
                              onClick={() => toggleArrayItem(field.key, idx)}
                            >
                              {expandedArrayItems[`${field.key}-${idx}`] ? '▲ Collapse' : '▼ Edit Item'}
                            </button>
                            <button
                              className={styles.removeBtn}
                              onClick={() => removeArrayItem(field.key, idx)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        {expandedArrayItems[`${field.key}-${idx}`] && (
                          <div className={styles.arrayItemFields}>
                            {field.itemFields.map((subField) => {
                              const isFullWidth = subField.type === 'textarea' || subField.type === 'subArray' || subField.type === 'commaSeparated';
                              return (
                                <div key={subField.key} className={`${styles.subField} ${isFullWidth ? styles.subFieldFull : ''}`}>
                                  <label className={styles.subFieldLabel}>
                                    {subField.label}
                                  </label>
                                  {subField.type === 'text' && (
                                    subField.key.toLowerCase().includes('link') || subField.key.toLowerCase().includes('url') ? (
                                      <LinkInput
                                        value={item[subField.key] || ''}
                                        onChange={(val) =>
                                          handleArrayItemChange(field.key, idx, subField.key, val)
                                        }
                                      />
                                    ) : (
                                      <input
                                        type="text"
                                        className={styles.textInput}
                                        value={item[subField.key] || ''}
                                        onChange={(e) =>
                                          handleArrayItemChange(field.key, idx, subField.key, e.target.value)
                                        }
                                      />
                                    )
                                  )}
                                  {subField.type === 'textarea' && (
                                    <RichTextEditor
                                      value={item[subField.key] || ''}
                                      onChange={(html) =>
                                        handleArrayItemChange(field.key, idx, subField.key, html)
                                      }
                                      placeholder={`Enter ${subField.label.toLowerCase()}...`}
                                    />
                                  )}
                                  {subField.type === 'commaSeparated' && (
                                    <input
                                      type="text"
                                      className={styles.textInput}
                                      value={Array.isArray(item[subField.key]) ? item[subField.key].join(', ') : (item[subField.key] || '')}
                                      onChange={(e) => {
                                        const val = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                        handleArrayItemChange(field.key, idx, subField.key, val);
                                      }}
                                      placeholder="Tag1, Tag2, Tag3"
                                    />
                                  )}
                                  {subField.type === 'subArray' && (
                                    <div className={styles.subArrayContainer}>
                                      {(item[subField.key] || []).map((rawSubItem, subIdx) => {
                                      const subItem = typeof rawSubItem === 'object' && rawSubItem !== null ? rawSubItem : {};
                                      return (
                                        <div key={subIdx} className={styles.subArrayItem}>
                                          <div className={styles.subArrayHeader}>
                                            <span className={styles.arrayItemIndex}>#{subIdx + 1}</span>
                                            <button
                                              className={styles.removeBtn}
                                              onClick={() => {
                                                const updated = JSON.parse(JSON.stringify(data));
                                                updated[field.key][idx][subField.key].splice(subIdx, 1);
                                                setData(updated);
                                              }}
                                            >
                                              ✕
                                            </button>
                                          </div>
                                          {subField.subFields.map((sf) => (
                                            <div key={sf.key} className={styles.subField}>
                                              <label className={styles.subFieldLabel}>{sf.label}</label>
                                              <input
                                                type="text"
                                                className={styles.textInput}
                                                value={subItem[sf.key] || ''}
                                                onChange={(e) => {
                                                  const updated = JSON.parse(JSON.stringify(data));
                                                  updated[field.key][idx][subField.key][subIdx][sf.key] = e.target.value;
                                                  setData(updated);
                                                }}
                                              />
                                            </div>
                                          ))}
                                        </div>
                                      );
                                    })}
                                      <button
                                        className={styles.addBtn}
                                        onClick={() => {
                                          const updated = JSON.parse(JSON.stringify(data));
                                          const newSub = {};
                                          subField.subFields.forEach((sf) => { newSub[sf.key] = ''; });
                                          if (!updated[field.key][idx][subField.key]) {
                                            updated[field.key][idx][subField.key] = [];
                                          }
                                          updated[field.key][idx][subField.key].push(newSub);
                                          setData(updated);
                                        }}
                                      >
                                        + Add Stat
                                      </button>
                                    </div>
                                  )}
                                  {subField.type === 'image' && (
                                    <div className={styles.imageField}>
                                      {item[subField.key] && (() => {
                                        const rawImg = item[subField.key];
                                        const imgSrc = rawImg.startsWith('/') || rawImg.startsWith('http') ? rawImg : `/${rawImg}`;
                                        return (
                                          <div className={styles.imagePreviewSmall}>
                                            <Image
                                              src={imgSrc}
                                              alt={subField.label}
                                              className={styles.previewImgSmall}
                                              width={100}
                                              height={50}
                                              style={{ objectFit: 'contain' }}
                                            />
                                          </div>
                                        );
                                      })()}
                                      <div className={styles.imageControls}>
                                        <input
                                          type="text"
                                          className={styles.textInput}
                                          value={item[subField.key] || ''}
                                          onChange={(e) =>
                                            handleArrayItemChange(field.key, idx, subField.key, e.target.value)
                                          }
                                          placeholder="Image path or URL"
                                        />
                                        <label className={styles.uploadBtn}>
                                          {uploading === `${field.key}.${subField.key}-${idx}` ? 'Uploading...' : <><FiUploadCloud /> Upload</>}
                                          <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={(e) => {
                                              if (e.target.files?.[0]) {
                                                handleImageUpload(
                                                  `${field.key}.${subField.key}`,
                                                  e.target.files[0],
                                                  idx
                                                );
                                              }
                                            }}
                                          />
                                        </label>
                                        {item[subField.key] && (
                                          <button
                                            className={styles.removeBtn}
                                            onClick={() => handleArrayItemChange(field.key, idx, subField.key, '')}
                                            title="Remove Image"
                                          >
                                            ✕ Remove
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <button
                    className={styles.addBtn}
                    onClick={() => addArrayItem(field.key, field.itemFields)}
                  >
                    + Add {field.label.replace(/s$/, '')}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => {
          // If the field contains a dot, it might be an array item or nested, but handleFieldChange handles simple keys.
          // Wait, handleFieldChange just sets simple root keys in the data state.
          handleFieldChange(mediaPickerField, url);
          setMediaPickerOpen(false);
        }}
      />

      {/* History Modal */}
      {historyOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'white', width: '500px', maxHeight: '80vh',
            borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden'
          }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0, fontSize: '18px' }}>Version History</h2>
              <button onClick={() => setHistoryOpen(false)} style={{ cursor: 'pointer', background: 'transparent', border: 'none', fontSize: '24px' }}>&times;</button>
            </div>
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              {historyItems.length === 0 ? (
                <p>No history available for this section yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {historyItems.map((h, i) => (
                    <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>Version {historyItems.length - i}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{new Date(h.createdAt).toLocaleString()}</div>
                      </div>
                      <button
                        onClick={() => handleRestoreHistory(h.id)}
                        style={{ background: '#240E8B', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                      >
                        Restore
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Save Bar */}
      <div className={styles.stickyBar}>
        <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'flex-end' }}>
          <button
            className={styles.secondaryBtn}
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            {saving ? '...' : <><FiSave /> Save Draft</>}
          </button>
          <button
            className={styles.secondaryBtn}
            onClick={handlePreview}
            disabled={saving}
          >
            <FiEye /> Preview
          </button>
          <button
            className={styles.saveBtn}
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            {saving ? 'Publishing...' : <><FiUploadCloud /> Publish Live</>}
          </button>
        </div>
      </div>
    </div>
  );
}
