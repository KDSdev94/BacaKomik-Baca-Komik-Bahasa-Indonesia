import { useState, useRef, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSearch, fetchHome } from "../api/komikApi";
import ComicCard from "../components/ComicCard";
import { CardSkeleton } from "../components/Skeleton";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [inputVal, setInputVal] = useState(query);
  const inputRef = useRef(null);

  // Sync input ketika query URL berubah
  useEffect(() => {
    setInputVal(query);
  }, [query]);

  // Auto-focus input saat halaman dibuka
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const { data: searchData, isLoading: isSearching, error } = useQuery({
    queryKey: ["search", query],
    queryFn: () => fetchSearch(query),
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 30,
  });

  const { data: homeData } = useQuery({
    queryKey: ["home"],
    queryFn: fetchHome,
    staleTime: 1000 * 60 * 5,
  });

  const results = Array.isArray(searchData) ? searchData : [];
  const popularComics = Array.isArray(homeData?.popular_today) ? homeData.popular_today : [];
  const hasQuery = query.trim().length >= 2;
  const hasResults = results.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = inputVal.trim();
    if (val) setSearchParams({ q: val });
  };

  const handleClear = () => {
    setInputVal("");
    setSearchParams({});
    inputRef.current?.focus();
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">

      {/* ── Search Header ── */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue mb-2">
          Pencarian
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
          {hasQuery ? (
            <>Hasil untuk <span className="text-brand-blue">"{query}"</span></>
          ) : (
            "Cari Komikmu"
          )}
        </h1>

        {/* Search Input */}
        <form onSubmit={handleSubmit} className="relative max-w-2xl">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm focus-within:border-brand-blue focus-within:bg-white/8 transition-all duration-200"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}>
            <i className="fas fa-search text-gray-500 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Judul komik, manhwa, manhua..."
              autoComplete="off"
              className="flex-1 bg-transparent text-white placeholder-gray-500 text-base outline-none"
            />
            {inputVal && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
                aria-label="Hapus pencarian"
              >
                <i className="fas fa-times" />
              </button>
            )}
            <button
              type="submit"
              className="flex-shrink-0 bg-brand-blue hover:bg-brand-hover text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
            >
              Cari
            </button>
          </div>
        </form>
      </div>

      {/* ── Konten Utama ── */}
      {hasQuery ? (
        /* ── MODE HASIL PENCARIAN ── */
        <div>
          {/* Status bar */}
          {!isSearching && (
            <p className="text-sm text-gray-400 mb-5">
              {hasResults
                ? <><span className="text-white font-semibold">{results.length}</span> komik ditemukan</>
                : "Tidak ada komik yang cocok"}
            </p>
          )}

          {error && (
            <div className="py-10 text-center text-red-400 text-sm">
              <i className="fas fa-exclamation-circle text-2xl mb-3 block" />
              Gagal memuat hasil pencarian. Silakan coba lagi.
            </div>
          )}

          {isSearching ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              <CardSkeleton count={10} />
            </div>
          ) : hasResults ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {results.map((komik) => (
                <ComicCard key={komik.slug} {...komik} />
              ))}
            </div>
          ) : !error && (
            <div className="py-20 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-white font-semibold text-lg mb-2">
                Komik "{query}" tidak ditemukan
              </p>
              <p className="text-gray-500 text-sm mb-6">
                Coba periksa ejaan atau gunakan kata kunci yang berbeda
              </p>
              <button
                onClick={handleClear}
                className="text-brand-blue hover:underline text-sm font-medium"
              >
                ← Kembali ke halaman pencarian
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ── MODE ETALASE (belum ada pencarian) ── */
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Kiri: Popular Today - grid etalase */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-5 bg-brand-blue rounded-full" />
              <h2 className="text-base font-bold text-white">Terpopuler Hari Ini</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
              {popularComics.length === 0
                ? <CardSkeleton count={8} />
                : popularComics.slice(0, 8).map((komik) => (
                  <ComicCard key={komik.slug} {...komik} />
                ))
              }
            </div>
          </div>

          {/* Kanan: Daftar cepat + tips */}
          <div className="w-full lg:w-[260px] flex-shrink-0 space-y-6">

            {/* Tips Pencarian */}
            <div className="rounded-xl border border-white/8 bg-white/4 p-5"
              style={{ backdropFilter: "blur(12px)" }}>
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <i className="fas fa-lightbulb text-yellow-400 text-xs" />
                Tips Pencarian
              </h3>
              <ul className="text-xs text-gray-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue mt-0.5">•</span>
                  Gunakan judul asli atau terjemahan
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue mt-0.5">•</span>
                  Minimal 2 karakter untuk mulai pencarian
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue mt-0.5">•</span>
                  Coba nama karakter atau genre
                </li>
              </ul>
            </div>

            {/* Jelajah Genre */}
            <div className="rounded-xl border border-white/8 bg-white/4 p-5"
              style={{ backdropFilter: "blur(12px)" }}>
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <i className="fas fa-tags text-brand-blue text-xs" />
                Jelajah Kategori
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Manga", to: "/type/manga", icon: "fa-book" },
                  { label: "Manhwa", to: "/type/manhwa", icon: "fa-book-open" },
                  { label: "Manhua", to: "/type/manhua", icon: "fa-scroll" },
                  { label: "Semua Genre", to: "/daftar-genre", icon: "fa-list" },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/8 transition-colors text-xs font-medium group"
                  >
                    <i className={`fas ${item.icon} text-brand-blue w-4 text-center`} />
                    {item.label}
                    <i className="fas fa-chevron-right ml-auto text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
