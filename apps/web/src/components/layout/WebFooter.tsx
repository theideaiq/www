'use client';

import { Link } from '@/i18n/navigation';
import { Footer, type FooterProps } from '@repo/ui';

export function WebFooter(props: Omit<FooterProps, 'Link'>) {
  return <Footer {...props} Link={Link} />;
}
