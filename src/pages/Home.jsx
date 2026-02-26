import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchHome, fetchLatestUpdate } from "../api/komikApi";
import { ListSkeleton } from "../components/Skeleton";
import HeroSlider from "../components/HeroSlider";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";

export default function Home() {
  const [latestPage, setLatestPage] = useState(1);

  const { data: homeData, isLoading: homeLoading, error: homeError } = useQuery({
    queryKey: ["home"],
    queryFn: fetchHome,
  });

  const { data: latestData, isLoading: latestLoading, isFetching } = useQuery({
    queryKey: ["latest_update", latestPage],
    queryFn: () => fetchLatestUpdate(latestPage),
    keepPreviousData: true,
  });

  const latestList = latestData?.list || [];
  const pagination = latestData?.pagination || {};
  const totalPages = pagination.total_pages || 1;
  const hasNext = pagination.has_next;
  const hasPrev = pagination.has_prev;

  const handlePageChange = (page) => {
    setLatestPage(page);
    document.getElementById("latest-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (homeError) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8 text-center">
        <p className="text-red-400">Gagal memuat data. Silakan coba lagi.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      {/* Hero Slider */}
      {!homeLoading && homeData?.slider && <HeroSlider slides={homeData.slider} />}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="w-full lg:w-[70%]">
          {/* Latest Update */}
          <div className="mb-6" id="latest-section">
            <div className="flex justify-between items-center border-b-2 border-brand-blue pb-2 mb-4">
              <h2 className="text-lg font-bold text-white">Daftar Komik Terbaru</h2>
              {isFetching && !latestLoading && (
                <span className="text-xs text-gray-500 animate-pulse">Memuat...</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {latestLoading ? (
                <ListSkeleton count={6} />
              ) : (
                latestList.map((komik) => (
                  <div
                    key={komik.slug}
                    className="flex gap-3 bg-dark-card p-2 rounded border border-dark-border hover:bg-dark-hover transition"
                    style={{ opacity: isFetching ? 0.6 : 1, transition: "opacity 0.2s" }}
                  >
                    <div className="w-16 h-24 flex-shrink-0">
                      <img src={komik.cover} alt={komik.title} loading="lazy" className="w-full h-full object-cover rounded" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/komik/${komik.slug}`}>
                        <h3 className="text-sm font-bold text-white line-clamp-1 mb-1 hover:text-brand-blue">{komik.title}</h3>
                      </Link>
                      {komik.type && (
                        <div className="flex gap-2 text-[0.65rem] text-gray-400 mb-2">
                          <span className="bg-blue-900 text-blue-300 px-1.5 py-0.5 rounded">
                            {typeof komik.type === "object" ? komik.type.name : komik.type}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col gap-1 text-xs">
                        {komik.chapters?.slice(0, 2).map((ch) => (
                          <Link key={ch.slug} to={`/chapter/${ch.slug}`} className="flex justify-between hover:text-brand-blue">
                            <span>{ch.name}</span>
                            <span className="text-gray-500">{formatDate(ch.date)}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {!latestLoading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
                <button
                  onClick={() => handlePageChange(latestPage - 1)}
                  disabled={!hasPrev}
                  className="px-3 py-1.5 rounded text-sm font-medium border border-dark-border text-gray-400 hover:text-white hover:border-brand-blue disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <i className="fas fa-chevron-left text-xs mr-1" /> Prev
                </button>

                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let page;
                  if (totalPages <= 7) {
                    page = i + 1;
                  } else if (latestPage <= 4) {
                    page = i + 1 <= 5 ? i + 1 : i + 1 === 6 ? "..." : totalPages;
                  } else if (latestPage >= totalPages - 3) {
                    page = i === 0 ? 1 : i === 1 ? "..." : totalPages - (6 - i);
                  } else {
                    const map = [1, "...", latestPage - 1, latestPage, latestPage + 1, "...", totalPages];
                    page = map[i];
                  }
                  return page === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-gray-600">…</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 rounded text-sm font-medium transition-colors ${page === latestPage
                          ? "bg-brand-blue text-white"
                          : "border border-dark-border text-gray-400 hover:text-white hover:border-brand-blue"
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(latestPage + 1)}
                  disabled={!hasNext}
                  className="px-3 py-1.5 rounded text-sm font-medium border border-dark-border text-gray-400 hover:text-white hover:border-brand-blue disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next <i className="fas fa-chevron-right text-xs ml-1" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        {!homeLoading && homeData && (
          <Sidebar popular={homeData.popular_today || []} genres={homeData.genres || []} />
        )}
      </div>
    </div>
  );
}
