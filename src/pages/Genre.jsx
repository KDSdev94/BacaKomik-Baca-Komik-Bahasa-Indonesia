import React, { useEffect, useRef, useCallback, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchByGenre, fetchHome } from "../api/komikApi";
import Sidebar from "../components/Sidebar";
import "./genre.css";

function toArray(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.list)) return data.list;
  return [];
}

function GenreComicCard({ komik }) {
  return (
    <Link
      id={`genre-comic-${komik.slug}`}
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

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const delta = 2;
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);
    if (left > 2) pages.push("...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  return (
    <nav className="gp-pagination" aria-label="Navigasi halaman">
      <button
        className="gp-page-btn gp-page-btn--nav"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Halaman sebelumnya"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {getPages().map((page, idx) =>
        page === "..." ? (
          <span key={`ellipsis-${idx}`} className="gp-page-ellipsis">…</span>
        ) : (
          <button
            key={page}
            className={`gp-page-btn${page === currentPage ? " gp-page-btn--active" : ""}`}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        className="gp-page-btn gp-page-btn--nav"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Halaman berikutnya"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </nav>
  );
}

export default function Genre() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const containerRef = useRef(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["genre", slug, currentPage],
    queryFn: () => fetchByGenre(slug, currentPage),
    keepPreviousData: true,
  });

  const { data: homeData } = useQuery({
    queryKey: ["home"],
    queryFn: fetchHome,
  });

  const comics = toArray(data);
  const pagination = data?.pagination || null;
  const totalPages = pagination?.total_pages || 1;
  const popularComics = Array.isArray(homeData?.popular_today) ? homeData.popular_today : [];
  const displayName = slug ? slug.replace(/-/g, " ") : "";

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setSearchParams({ page: String(page) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  return (
    <main className="genre-page" ref={containerRef}>
      <div className="gp-container">

        <header className="gp-header">
          <nav className="gp-breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="gp-breadcrumb__link">Home</Link>
            <span className="gp-breadcrumb__sep" aria-hidden="true">/</span>
            <Link to="/daftar-genre" className="gp-breadcrumb__link">Genre</Link>
            <span className="gp-breadcrumb__sep" aria-hidden="true">/</span>
            <span className="gp-breadcrumb__current">{displayName}</span>
          </nav>

          <div className="gp-header__row">
            <div className="gp-header__text">
              <h1 className="gp-header__title">
                <span className="gp-header__title--label">Genre</span>
                {displayName}
              </h1>
              {!isLoading && (
                <p className="gp-header__count">
                  {comics.length} komik ditemukan
                  {totalPages > 1 && (
                    <span className="gp-header__page-info"> — Hal. {currentPage} dari {totalPages}</span>
                  )}
                </p>
              )}
            </div>
            <Link to="/daftar-genre" className="gp-back-btn" aria-label="Kembali ke daftar genre">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Semua Genre
            </Link>
          </div>
        </header>

        {error && (
          <div className="gp-error">
            <p>Gagal memuat data untuk genre ini. Silakan coba lagi.</p>
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
                <p>Belum ada komik dalam genre ini.</p>
                <Link to="/daftar-genre" className="gp-empty__link">
                  Jelajahi genre lain
                </Link>
              </div>
            ) : (
              <>
                <div className="gp-grid">
                  {comics.map((komik, idx) => (
                    <GenreComicCard key={komik.slug || idx} komik={komik} />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
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
