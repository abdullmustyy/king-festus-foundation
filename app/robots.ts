import { MetadataRoute } from 'next';
import { METADATA_URL } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${METADATA_URL}/sitemap.xml`,
  };
}
