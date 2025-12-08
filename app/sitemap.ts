import { MetadataRoute } from 'next';
import { METADATA_URL } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: METADATA_URL,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${METADATA_URL}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${METADATA_URL}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${METADATA_URL}/governance-structure`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}
