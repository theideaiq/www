export interface WebNavItem {
  labelKey: string;
  href: string;
}

export const webNavigation: WebNavItem[] = [
  { labelKey: 'Nav.store', href: '/megastore' },
  { labelKey: 'Nav.plus', href: '/plus' },
  { labelKey: 'Nav.academy', href: '/academy' },
  { labelKey: 'Nav.business', href: '/suite' },
];

export interface AdminNavItem {
  title: string;
  href: string;
  icon: string;
}

export const adminNavigation: AdminNavItem[] = [
  {
    title: 'Overview',
    href: '/',
    icon: 'LayoutDashboard',
  },
  {
    title: 'CRM',
    href: '/crm',
    icon: 'Users',
  },
  {
    title: 'Finance',
    href: '/finance',
    icon: 'BadgeDollarSign',
  },
  {
    title: 'Marketing',
    href: '/marketing',
    icon: 'Megaphone',
  },
  {
    title: 'Products',
    href: '/products',
    icon: 'Package',
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: 'Settings',
  },
];
