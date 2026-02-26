import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchChapter } from "../api/komikApi";
import { useState, useCallback } from "react";

// Skeleton placeholder for a single chapter page image
function PageSkeleton() {
  return (
    <div
      className="w-full bg-[#161616] animate-pulse"
      style={{ minHeight: "600px", maxWidth: "100%" }}
    />
  );
}

// Single chapter image with skeleton until loaded
function ChapterImage({ src, index }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full">
      {/* Skeleton shown until image loaded */}
      {!loaded && !error && <PageSkeleton />}

      {error ? (
        <div
          className="w-full flex flex-col items-center justify-center gap-2 bg-[#1a1a1a] text-gray-600 text-sm"
          style={{ minHeight: "200px" }}
        >
          <i className="fas fa-image-slash text-2xl" />
          <span>Halaman {index + 1} gagal dimuat</span>
        </div>
      ) : (
        <img
          src={src}
          alt={`Halaman ${index + 1}`}
          onLoad={() => setLoaded(true)}
          onError={() => { setLoaded(true); setError(true); }}
          className="w-full block"
          style={{ display: loaded ? "block" : "none" }}
        />
      )}
    </div>
  );
}

export default function Reader() {
  const { slug } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["chapter", slug],
    queryFn: () => fetchChapter(slug),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-0 md:px-4 py-6 space-y-1">
        {/* Header skeleton */}
        <div className="px-4 md:px-0 mb-4 space-y-2">
          <div className="h-6 bg-[#1e1e1e] rounded w-2/3 animate-pulse" />
          <div className="h-4 bg-[#1e1e1e] rounded w-24 animate-pulse" />
        </div>
        {/* Nav bar skeleton */}
        <div className="flex justify-between px-4 md:px-0 mb-4">
          <div className="h-9 w-20 bg-[#1e1e1e] rounded animate-pulse" />
          <div className="h-9 w-20 bg-[#1e1e1e] rounded animate-pulse" />
        </div>
        {/* Page image skeletons */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="w-full bg-[#161616] animate-pulse"
            style={{
              minHeight: i === 0 ? "700px" : "600px",
              animationDelay: `${i * 100}ms`,
            }}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16 text-center">
        <i className="fas fa-triangle-exclamation text-3xl text-red-400 mb-4 block" />
        <p className="text-red-400 font-medium">Gagal memuat chapter.</p>
        <p className="text-gray-500 text-sm mt-2">Silakan coba lagi atau kembali ke halaman sebelumnya.</p>
      </div>
    );
  }

  const pages = data?.pages?.filter(Boolean) || [];

  return (
    <div className="container mx-auto max-w-3xl px-0 md:px-4 py-6">
      {/* Header */}
      <div className="px-4 md:px-0 mb-4">
        <h1 className="text-lg font-bold text-white line-clamp-2">{data?.title}</h1>
        {data?.chapter_list?.[0]?.slug && (
          <Link to={`/komik/${data.chapter_list[0].slug}`} className="text-sm text-brand-blue hover:underline">
            ← Kembali ke detail
          </Link>
        )}
      </div>

      {/* Top Navigation */}
      <div className="flex justify-between px-4 md:px-0 mb-4 gap-2">
        {data?.prev_chapter?.slug ? (
          <Link to={`/chapter/${data.prev_chapter.slug}`} className="bg-brand-blue text-white px-4 py-2 rounded text-sm hover:bg-brand-hover flex items-center gap-1">
            <i className="fas fa-chevron-left text-xs" /> Prev
          </Link>
        ) : <div />}
        {data?.next_chapter?.slug && (
          <Link to={`/chapter/${data.next_chapter.slug}`} className="bg-brand-blue text-white px-4 py-2 rounded text-sm hover:bg-brand-hover flex items-center gap-1">
            Next <i className="fas fa-chevron-right text-xs" />
          </Link>
        )}
      </div>

      {/* Chapter Images — each with individual skeleton */}
      <div className="flex flex-col items-center">
        {pages.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            <i className="fas fa-book-open text-3xl mb-3 block" />
            <p>Halaman tidak tersedia.</p>
          </div>
        ) : (
          pages.map((img, i) => (
            <ChapterImage key={`${slug}-${i}`} src={img} index={i} />
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-between px-4 md:px-0 mt-6 gap-2">
        {data?.prev_chapter?.slug ? (
          <Link to={`/chapter/${data.prev_chapter.slug}`} className="bg-brand-blue text-white px-4 py-2 rounded text-sm hover:bg-brand-hover flex items-center gap-1">
            <i className="fas fa-chevron-left text-xs" /> Prev
          </Link>
        ) : <div />}
        {data?.next_chapter?.slug && (
          <Link to={`/chapter/${data.next_chapter.slug}`} className="bg-brand-blue text-white px-4 py-2 rounded text-sm hover:bg-brand-hover flex items-center gap-1">
            Next <i className="fas fa-chevron-right text-xs" />
          </Link>
        )}
      </div>
    </div>
  );
}
