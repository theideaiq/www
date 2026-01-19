'use client';

import { Link } from '@/i18n/navigation';
import { Navbar, type NavbarProps } from '@repo/ui';

export function WebNavbar(props: Omit<NavbarProps, 'Link'>) {
  return <Navbar {...props} Link={Link} />;
}
