import { Skeleton } from '@repo/ui';

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static list
            key={i}
            className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm"
          >
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-8 w-1/3" />
          </div>
        ))}
      </div>

      {/* Data Table Skeleton */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-64" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" /> {/* Table Header */}
          {[...Array(5)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static list
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
