export default function Skeleton({ className = "", count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-dark-border rounded ${className}`}
        />
      ))}
    </>
  );
}

export function CardSkeleton({ count = 5 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-dark-card border border-dark-border rounded overflow-hidden">
          <div className="aspect-[2/3] bg-dark-border animate-pulse" />
          <div className="p-2 space-y-2">
            <div className="h-4 bg-dark-border rounded animate-pulse w-3/4" />
            <div className="h-3 bg-dark-border rounded animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </>
  );
}

export function ListSkeleton({ count = 6 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-3 bg-dark-card p-2 rounded border border-dark-border">
          <div className="w-16 h-24 flex-shrink-0 bg-dark-border rounded animate-pulse" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-dark-border rounded animate-pulse w-3/4" />
            <div className="h-3 bg-dark-border rounded animate-pulse w-1/3" />
            <div className="h-3 bg-dark-border rounded animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </>
  );
}
