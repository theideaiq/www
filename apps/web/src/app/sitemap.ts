import type { MetadataRoute } from 'next';
import { env } from '@/env';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL;

  // Core routes of your application
  const routes = [
    '',
    '/jukebox',
    '/club',
    '/academy',
    '/business',
    '/megastore',
    '/loyalty',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'yearly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));
}
