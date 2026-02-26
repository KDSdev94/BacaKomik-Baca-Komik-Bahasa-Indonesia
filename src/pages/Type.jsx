import React, { useEffect, useRef, useCallback } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchByType, fetchHome } from "../api/komikApi";
import Sidebar from "../components/Sidebar";
import "./genre.css";

function TypeComicCard({ komik, index }) {
  return (
    <Link
      id={`type-comic-${komik.slug}`}
      to={`/komik/${komik.slug}`}
      className="gc-card"
      data-reveal
    >
      <div className="gc-card__cover">
        <img
          src={komik.cover}
          alt={komik.title}
          loading="lazy"
          className="gc-card__img"
        />
        <div className="gc-card__overlay">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
        {komik.type && (
          <span className="gc-card__type">{typeof komik.type === "object" ? komik.type.name : komik.type}</span>
        )}
        {komik.colored && (
          <span className="gc-card__color-badge">COLOR</span>
        )}
      </div>
      <div className="gc-card__info">
        <h3 className="gc-card__title">{komik.title}</h3>
        <div className="gc-card__meta">
          {komik.chapter && (
            <span className="gc-card__chapter">
              {typeof komik.chapter === "object" ? komik.chapter.name : komik.chapter}
            </span>
          )}
          {komik.rating && (
            <span className="gc-card__rating">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {komik.rating}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function Type() {
  const { kind } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const containerRef = useRef(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["type", kind, page],
    queryFn: () => fetchByType(kind, page),
  });

  const { data: homeData } = useQuery({
    queryKey: ["home"],
    queryFn: fetchHome,
  });

  const comics = data?.list || data || [];
  const pagination = data?.pagination;
  const popularComics = Array.isArray(homeData?.popular_today) ? homeData.popular_today : [];
  const displayName = kind ? kind.replace(/-/g, " ") : "";

  const setupObserver = useCallback(() => {
    if (!containerRef.current) return;
    const els = containerRef.current.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );
    els.forEach((el, i) => {
      el.style.transitionDelay = `${i * 60}ms`;
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isLoading && comics.length > 0) {
      const timer = setTimeout(setupObserver, 50);
      return () => clearTimeout(timer);
    }
  }, [isLoading, comics.length, setupObserver]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="genre-page" ref={containerRef}>
      <div className="gp-container">

        <header className="gp-header">
          <nav className="gp-breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="gp-breadcrumb__link">Home</Link>
            <span className="gp-breadcrumb__sep" aria-hidden="true">/</span>
            <span className="gp-breadcrumb__link">Type</span>
            <span className="gp-breadcrumb__sep" aria-hidden="true">/</span>
            <span className="gp-breadcrumb__current capitalize">{displayName}</span>
          </nav>

          <div className="gp-header__row">
            <div className="gp-header__text">
              <h1 className="gp-header__title capitalize">
                <span className="gp-header__title--label">Type</span>
                {displayName}
              </h1>
              {!isLoading && pagination && (
                <p className="gp-header__count">
                  Halaman {pagination.current_page} dari {pagination.total_pages}
                </p>
              )}
            </div>
            <Link to="/" className="gp-back-btn" aria-label="Kembali ke Beranda">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Beranda
            </Link>
          </div>
        </header>

        {error && (
          <div className="gp-error">
            <p>Gagal memuat data untuk Tipe ini. Silakan coba lagi.</p>
          </div>
        )}

        <div className="gp-layout">
          <section className="gp-main">
            {isLoading ? (
              <div className="gp-skeleton-grid">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="gp-skeleton" />
                ))}
              </div>
            ) : comics.length === 0 ? (
              <div className="gp-empty">
                <p>Belum ada komik dalam tipe ini.</p>
                <Link to="/" className="gp-empty__link">
                  Jelajahi Beranda
                </Link>
              </div>
            ) : (
              <>
                <div className="gp-grid">
                  {comics.map((komik, idx) => (
                    <TypeComicCard key={komik.slug || idx} komik={komik} index={idx} />
                  ))}
                </div>

                {pagination && pagination.total_pages > 1 && (
                  <div className="mt-12 mb-8 flex items-center justify-center gap-2 flex-wrap">
                    <button
                      disabled={!pagination.has_prev}
                      onClick={() => handlePageChange(Math.max(1, page - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-gray-300 hover:bg-brand-blue hover:text-white hover:border-brand-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <i className="fas fa-chevron-left text-sm"></i>
                    </button>

                    {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                      let p = page;
                      if (page <= 3) p = 1 + i;
                      else if (page >= pagination.total_pages - 2) p = pagination.total_pages - 4 + i;
                      else p = page - 2 + i;

                      if (p < 1 || p > pagination.total_pages) return null;

                      return (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p)}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${page === p
                            ? "bg-brand-blue text-white border-brand-blue"
                            : "border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700"
                            }`}
                        >
                          {p}
                        </button>
                      );
                    })}

                    <button
                      disabled={!pagination.has_next}
                      onClick={() => handlePageChange(page + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-gray-300 hover:bg-brand-blue hover:text-white hover:border-brand-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <i className="fas fa-chevron-right text-sm"></i>
                    </button>
                  </div>
                )}
              </>
            )}
          </section>

          <aside className="gp-sidebar">
            <Sidebar popular={popularComics} />
          </aside>
        </div>
      </div>
    </main>
  );
}
