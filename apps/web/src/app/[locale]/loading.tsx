import { Skeleton } from '@repo/ui';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Hero Skeleton */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center text-center space-y-8">
            <Skeleton className="h-12 w-3/4 md:w-1/2" />
            <Skeleton className="h-6 w-full md:w-2/3" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-12 w-32 rounded-full" />
              <Skeleton className="h-12 w-32 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Skeleton */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="flex justify-center mb-16">
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static list
              key={i}
              className="p-8 h-64 border rounded-xl bg-white shadow-sm"
            >
              <Skeleton className="w-8 h-8 rounded-md mb-6" />
              <Skeleton className="h-6 w-32 mb-3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
