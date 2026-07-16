// Route-level loading state shown by Next.js App Router while the page
// segment is being rendered on the server.
export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>

      {/* Hero skeleton */}
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-5 h-7 w-64 rounded-full shimmer" />
        <div className="mx-auto mb-4 h-12 w-3/4 rounded-xl shimmer" />
        <div className="mx-auto mb-8 h-12 w-2/3 rounded-xl shimmer" />
        <div className="mx-auto h-14 max-w-2xl rounded-2xl shimmer" />
      </div>

      {/* Stats skeleton */}
      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-4">
            <div className="h-9 w-9 rounded-xl shimmer" />
            <div className="mt-3 h-7 w-16 rounded shimmer" />
            <div className="mt-2 h-3 w-24 rounded shimmer" />
          </div>
        ))}
      </div>

      {/* Cards skeleton */}
      <div className="mt-12">
        <div className="mx-auto mb-6 h-7 w-48 rounded shimmer" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex gap-4">
                <div className="h-16 w-16 rounded-xl shimmer" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/3 rounded shimmer" />
                  <div className="h-3 w-1/2 rounded shimmer" />
                  <div className="h-3 w-3/4 rounded shimmer" />
                </div>
              </div>
              <div className="mt-4 h-8 w-full rounded shimmer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
