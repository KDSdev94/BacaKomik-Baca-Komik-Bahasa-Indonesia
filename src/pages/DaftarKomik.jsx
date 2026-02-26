import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchLatestUpdate,
  fetchHome,
  fetchByType,
  fetchByGenre,
  fetchByDemografis,
  fetchByTema,
  fetchByKonten,
} from "../api/komikApi";
import ComicCardDetailed from "../components/ComicCardDetailed";
import Sidebar from "../components/Sidebar";
import { CardSkeleton } from "../components/Skeleton";

// Mapping nama genre (dari API home) → slug untuk endpoint /genre/{slug}
const GENRE_SLUG_MAP = {
  "Aksi": "action",
  "Petualangan": "adventure",
  "Romantis": "romance",
  "Komedi": "comedy",
  "Fantasi": "fantasy",
  "Horor": "horror",
  "Misteri": "mystery",
  "Drama": "drama",
  "Slice of Life": "slice-of-life",
  "Sci-fi": "sci-fi",
  "Supernatural": "supernatural",
  "Psychological": "psychological",
  "Thriller": "thriller",
  "Sports": "sports",
  "Martial Arts": "martial-arts",
  "Harem": "harem",
  "Isekai": "isekai",
  "Mecha": "mecha",
};

// Filter dengan endpoint API khusus
const DEMOGRAFIS_OPTIONS = ["All", "Shounen", "Seinen", "Shoujo", "Josei"];
const TEMA_OPTIONS = ["All", "Magic", "School Life", "Martial Arts", "Reincarnation", "Monsters", "Survival", "Regression"];
const KONTEN_OPTIONS = ["All", "Ecchi", "Gore", "Smut"];
const TYPE_OPTIONS = ["All", "Manga", "Manhwa", "Manhua"];
const STATUS_OPTIONS = ["All", "Ongoing", "Tamat", "Hiatus"];
const ORDER_OPTIONS = ["All", "Latest Update", "Popular", "A-Z", "Rating"];

/** Tentukan queryKey & queryFn berdasarkan filter aktif */
function resolveQuery(filters) {
  const { genre, type, demografis, tema, konten } = filters;

  // Jenis Komik (type) → /manga, /manhwa, /manhua
  if (type && type !== "All") {
    return {
      key: ["byType", type.toLowerCase()],
      fn: () => fetchByType(type.toLowerCase()),
    };
  }
  // Genre → /genre/{slug}
  if (genre && genre !== "All") {
    const slug = GENRE_SLUG_MAP[genre] || genre.toLowerCase().replace(/\s+/g, "-");
    return {
      key: ["byGenre", slug],
      fn: () => fetchByGenre(slug),
    };
  }
  // Demografis → /demografis/{slug}
  if (demografis && demografis !== "All") {
    const slug = demografis.toLowerCase();
    return {
      key: ["byDemografis", slug],
      fn: () => fetchByDemografis(slug),
    };
  }
  // Tema → /tema/{slug}
  if (tema && tema !== "All") {
    const slug = tema.toLowerCase().replace(/\s+/g, "-");
    return {
      key: ["byTema", slug],
      fn: () => fetchByTema(slug),
    };
  }
  // Konten → /konten/{slug}
  if (konten && konten !== "All") {
    const slug = konten.toLowerCase();
    return {
      key: ["byKonten", slug],
      fn: () => fetchByKonten(slug),
    };
  }

  // Default → /latest_update
  return {
    key: ["latest_update"],
    fn: fetchLatestUpdate,
  };
}

function toArray(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.list)) return data.list;
  return [];
}

export default function DaftarKomik() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [textMode, setTextMode] = useState(false);
  const [filters, setFilters] = useState({
    genre: "All", type: "All", demografis: "All",
    tema: "All", konten: "All", status: "All", order: "All",
  });

  // Fetch home: genres list + sidebar popular
  const { data: homeData, isLoading: homeLoading } = useQuery({
    queryKey: ["home"],
    queryFn: fetchHome,
  });

  // Genre dari API (nama asli)
  const genreOptions = useMemo(() => {
    if (!homeData?.genres) return ["All"];
    return ["All", ...homeData.genres.map((g) => g.name)];
  }, [homeData]);

  const popularComics = toArray(homeData?.popular_today);

  // Dynamic query berdasarkan filter aktif
  const { key: activeKey, fn: activeFn } = useMemo(() => resolveQuery(filters), [filters]);

  const {
    data: rawData,
    isLoading: dataLoading,
    isFetching,
  } = useQuery({
    queryKey: activeKey,
    queryFn: activeFn,
    staleTime: 3 * 60 * 1000,
  });

  const comics = toArray(rawData);

  // Client-side: search + status + order
  const filteredComics = useMemo(() => {
    let result = [...comics];

    // Filter search
    if (searchTerm) {
      result = result.filter((k) =>
        k.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter status (client-side karena tidak ada endpoint)
    if (filters.status && filters.status !== "All") {
      result = result.filter((k) =>
        k.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Sort order
    if (filters.order === "A-Z") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (filters.order === "Rating") {
      result.sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0));
    }

    return result;
  }, [comics, searchTerm, filters.status, filters.order]);

  const isLoading = dataLoading || homeLoading;

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => setSearchTerm(searchInput);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Main Content */}
        <div className="w-full lg:w-[70%]">

          {/* Header */}
          <div className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded mb-4">
            <h1 className="text-lg font-bold text-white uppercase flex items-center gap-2">
              <i className="fas fa-list text-brand-blue"></i> Daftar Komik
              {isFetching && !isLoading && (
                <i className="fas fa-spinner fa-spin text-sm text-gray-400"></i>
              )}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 font-bold uppercase">Text Mode</span>
              <button
                onClick={() => setTextMode(!textMode)}
                className={`w-10 h-5 rounded-full relative transition-colors ${textMode ? "bg-brand-blue" : "bg-gray-600"}`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${textMode ? "translate-x-5" : ""}`}
                ></div>
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          <div className="bg-[#1a1a1a] p-4 rounded mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">

              {/* Genre — data real dari API */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-400 font-bold uppercase mb-1">Genre</label>
                <select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange("genre", e.target.value)}
                  disabled={homeLoading}
                  className="bg-[#2a2a2a] text-sm text-gray-200 p-2 rounded outline-none border border-transparent focus:border-brand-blue appearance-none cursor-pointer disabled:opacity-50"
                >
                  {genreOptions.map((g, i) => <option key={i} value={g}>{g}</option>)}
                </select>
              </div>

              {/* Demografis */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-400 font-bold uppercase mb-1">Demografis</label>
                <select
                  value={filters.demografis}
                  onChange={(e) => handleFilterChange("demografis", e.target.value)}
                  className="bg-[#2a2a2a] text-sm text-gray-200 p-2 rounded outline-none border border-transparent focus:border-brand-blue appearance-none cursor-pointer"
                >
                  {DEMOGRAFIS_OPTIONS.map((o, i) => <option key={i} value={o}>{o}</option>)}
                </select>
              </div>

              {/* Konten */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-400 font-bold uppercase mb-1">Konten</label>
                <select
                  value={filters.konten}
                  onChange={(e) => handleFilterChange("konten", e.target.value)}
                  className="bg-[#2a2a2a] text-sm text-gray-200 p-2 rounded outline-none border border-transparent focus:border-brand-blue appearance-none cursor-pointer"
                >
                  {KONTEN_OPTIONS.map((o, i) => <option key={i} value={o}>{o}</option>)}
                </select>
              </div>

              {/* Tema */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-400 font-bold uppercase mb-1">Tema</label>
                <select
                  value={filters.tema}
                  onChange={(e) => handleFilterChange("tema", e.target.value)}
                  className="bg-[#2a2a2a] text-sm text-gray-200 p-2 rounded outline-none border border-transparent focus:border-brand-blue appearance-none cursor-pointer"
                >
                  {TEMA_OPTIONS.map((o, i) => <option key={i} value={o}>{o}</option>)}
                </select>
              </div>

              {/* Status */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-400 font-bold uppercase mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="bg-[#2a2a2a] text-sm text-gray-200 p-2 rounded outline-none border border-transparent focus:border-brand-blue appearance-none cursor-pointer"
                >
                  {STATUS_OPTIONS.map((o, i) => <option key={i} value={o}>{o}</option>)}
                </select>
              </div>

              {/* Jenis Komik */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-400 font-bold uppercase mb-1">Jenis Komik</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                  className="bg-[#2a2a2a] text-sm text-gray-200 p-2 rounded outline-none border border-transparent focus:border-brand-blue appearance-none cursor-pointer"
                >
                  {TYPE_OPTIONS.map((o, i) => <option key={i} value={o}>{o}</option>)}
                </select>
              </div>

              {/* Order by */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-400 font-bold uppercase mb-1">Order by</label>
                <select
                  value={filters.order}
                  onChange={(e) => handleFilterChange("order", e.target.value)}
                  className="bg-[#2a2a2a] text-sm text-gray-200 p-2 rounded outline-none border border-transparent focus:border-brand-blue appearance-none cursor-pointer"
                >
                  {ORDER_OPTIONS.map((o, i) => <option key={i} value={o}>{o}</option>)}
                </select>
              </div>

            </div>

            {/* Search */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Cari komik..."
                className="w-full bg-[#2a2a2a] text-gray-200 p-2 rounded outline-none border border-transparent focus:border-brand-blue text-sm"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleSearch}
                className="bg-brand-blue text-white px-4 py-2 rounded text-sm font-bold uppercase hover:bg-blue-600 transition-colors"
              >
                <i className="fas fa-search mr-1"></i> Search
              </button>
            </div>
          </div>

          {/* Comic Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {isLoading ? (
              <CardSkeleton count={8} />
            ) : filteredComics.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-400">
                <i className="fas fa-inbox text-3xl mb-3 block"></i>
                <p>Tidak ada komik ditemukan.</p>
              </div>
            ) : (
              filteredComics.map((komik, idx) => (
                <ComicCardDetailed
                  key={komik.slug || idx}
                  title={komik.title}
                  slug={komik.slug}
                  cover={komik.cover}
                  rating={komik.rating || komik.score}
                  is_color={komik.is_color || komik.colored}
                  type={komik.type}
                />
              ))
            )}
          </div>

          {/* Load More */}
          {!isLoading && filteredComics.length > 0 && (
            <div className="flex justify-center mt-8">
              <button className="bg-[#1a1a1a] text-white px-6 py-2 rounded font-bold hover:text-brand-blue transition-colors border border-gray-800">
                Load More
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[30%]">
          <Sidebar data={popularComics} title="Komik Terpopuler" />
        </div>
      </div>
    </div>
  );
}
