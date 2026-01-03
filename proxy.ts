import createMiddleware from 'next-intl/middleware';
import { routing } from './navigation';

// 1. Create the Intl Middleware using the new routing object
const intlMiddleware = createMiddleware(routing);

// 2. Export it as 'proxy' to satisfy Next.js 15+
export default function proxy(request: any) {
  return intlMiddleware(request);
}

// 3. Keep the config
export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
