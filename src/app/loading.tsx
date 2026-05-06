export default function Loading() {
  return (
    <div className="space-y-32 pb-32 animate-pulse">
      {/* Hero Skeleton */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-20 md:py-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto" />
          <div className="h-32 w-full max-w-4xl bg-gray-200 dark:bg-gray-800 rounded-3xl mx-auto" />
          <div className="h-20 w-full max-w-2xl bg-gray-200 dark:bg-gray-800 rounded-2xl mx-auto" />
          <div className="flex justify-center space-x-6 pt-6">
            <div className="h-16 w-48 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            <div className="h-16 w-48 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          </div>
        </div>
      </section>

      {/* Features Skeleton */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-8 bg-gray-100 dark:bg-gray-900/50 rounded-[2.5rem] h-64" />
          ))}
        </div>
      </section>

      {/* Skills Skeleton */}
      <section className="py-20 bg-blue-50/30 dark:bg-slate-900/50 h-64" />
    </div>
  );
}
