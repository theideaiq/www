import Link from 'next/link';
import { ReactNode } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  PieChart
} from 'lucide-react';
import { cn } from '@repo/utils';

export default function FinanceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
        <p className="text-muted-foreground">
          Manage ledger, staff planning, and equity.
        </p>
      </div>

      <FinanceNav />

      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

// Client component for navigation active states
import { FinanceNav } from './components/FinanceNav';
