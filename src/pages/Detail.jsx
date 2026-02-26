import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchKomikDetail } from "../api/komikApi";
import Skeleton from "../components/Skeleton";
import { useBookmark } from "../hooks/useBookmark";

export default function Detail() {
  const { slug } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["detail", slug],
    queryFn: () => fetchKomikDetail(slug),
  });
  const { addBookmark, removeBookmark, isBookmarked } = useBookmark();

  if (isLoading) {
    return (
      <div className="min-h-screen pt-12 px-6 container mx-auto flex gap-10">
        <Skeleton className="w-[300px] h-[450px] rounded-2xl" />
        <div className="flex-1 space-y-6 pt-10">
          <Skeleton className="h-16 w-3/4 rounded-lg" />
          <Skeleton className="h-6 w-1/4 rounded" />
          <div className="pt-10 space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="border border-red-500/20 bg-red-500/5 p-12 rounded-3xl text-center">
          <h2 className="text-red-400 font-mono tracking-widest uppercase mb-2">Error 404</h2>
          <p className="text-gray-400">Data fragment not found or corrupted.</p>
        </div>
      </div>
    );
  }

  const bookmarked = isBookmarked(slug);
  const typeName = Array.isArray(data.type) ? data.type.map(t => t.name).join(', ') : (typeof data.type === 'object' ? data.type.name : data.type);

  return (
    <div className="min-h-screen bg-[#070709] text-gray-200 selection:bg-white selection:text-black">

      {/* Editorial Hero Background / Glassmorphism Base */}
      <div className="relative w-full h-[25vh] lg:h-[30vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/80 to-transparent z-20"></div>
        <img
          src={data.cover}
          alt={data.title}
          className="w-full h-full object-cover blur-2xl scale-110 opacity-40 saturate-50"
        />
      </div>

      <div className="container mx-auto max-w-7xl px-6 relative z-30 -mt-[15vh] lg:-mt-[20vh] pb-12">
        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* Left Column: Cover & Sticky Actions */}
          <div className="w-[180px] md:w-[220px] lg:w-[260px] mx-auto md:mx-0 flex-shrink-0 lg:sticky top-24 pt-4">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img
                src={data.cover}
                alt={data.title}
                className="w-full aspect-[2/3] object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => bookmarked ? removeBookmark(slug) : addBookmark({ slug, title: data.title, cover: data.cover })}
                className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-3 font-mono text-sm tracking-widest uppercase transition-all duration-300 border ${bookmarked
                  ? "bg-white/5 border-red-500/30 text-red-400 hover:bg-red-500/10"
                  : "bg-[#fafafa] border-[#fafafa] text-black hover:bg-transparent hover:text-white"
                  }`}
              >
                <i className={`${bookmarked ? 'fas fa-bookmark' : 'far fa-bookmark'} ${bookmarked ? 'text-red-400' : ''}`}></i>
                <span>{bookmarked ? "Saved" : "Save"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Editorial Details */}
          <div className="flex-1 pt-6 lg:pt-10">
            <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-brand-blue tracking-widest uppercase mb-4">
              {data.status || 'Status Unknown'}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter leading-[1.2] mb-6 text-white text-center md:text-left">
              {data.title}
            </h1>

            {/* Meta Bento Bar */}
            <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4 mb-8 border-y border-white/10 py-4">
              <div>
                <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-1">Author</p>
                <p className="text-white font-medium">{data.author || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-1">Type</p>
                <p className="text-white font-medium">{typeName || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-1">Rating</p>
                <p className="text-yellow-400 font-medium flex items-center gap-1.5">
                  <i className="fas fa-star text-xs"></i> {data.rating || 'N/A'}
                </p>
              </div>
            </div>

            {/* Synopsis */}
            <div className="mb-8">
              <p className="text-base md:text-lg text-gray-400 leading-relaxed font-light md:pr-12 text-center md:text-left">
                {data.synopsis || "No synopsis available for this title."}
              </p>
            </div>

            {/* Genres Patchwork */}
            {data.genres && data.genres.length > 0 && (
              <div className="mb-12">
                <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-3 text-center md:text-left">Classifications</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {data.genres.map((genre) => (
                    <Link
                      key={genre.slug || genre}
                      to={`/genre/${genre.slug || genre}`}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs hover:bg-white hover:text-black transition-all duration-300"
                    >
                      {genre.name || genre}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Chapter List (Bento-style scroll container) */}
            {data.chapters && data.chapters.length > 0 && (
              <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-6 lg:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2"></div>

                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold tracking-tight text-white">{data.title}</h2>
                  <span className="text-xs font-mono tracking-widest text-gray-500 uppercase">{data.chapters.length} Chapters</span>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                  {data.chapters.map((ch, idx) => (
                    <Link
                      key={ch.slug}
                      to={`/chapter/${ch.slug}`}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white hover:text-black transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 border-l-2 border-transparent group-hover:border-black pl-2 transition-all">
                        <span className="text-xs font-mono text-gray-500 group-hover:text-gray-400">
                          {(data.chapters.length - idx).toString().padStart(3, '0')}
                        </span>
                        <span className="font-medium text-white group-hover:text-black">{ch.name}</span>
                      </div>
                      <span className="text-[11px] font-mono text-gray-500 group-hover:text-gray-600 mt-2 sm:mt-0 tracking-widest uppercase">
                        {ch.release_date || 'Unknown'}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
