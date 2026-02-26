import React, { useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchHome } from "../api/komikApi";
import Sidebar from "../components/Sidebar";
import "./genre.css";

const ALL_GENRES = [
    { name: "Action", slug: "action" },
    { name: "Adventure", slug: "adventure" },
    { name: "Comedy", slug: "comedy" },
    { name: "Cooking", slug: "cooking" },
    { name: "Demons", slug: "demons" },
    { name: "Drama", slug: "drama" },
    { name: "Ecchi", slug: "ecchi" },
    { name: "Fantasy", slug: "fantasy" },
    { name: "Game", slug: "game" },
    { name: "Gore", slug: "gore" },
    { name: "Harem", slug: "harem" },
    { name: "Historical", slug: "historical" },
    { name: "Horror", slug: "horror" },
    { name: "Isekai", slug: "isekai" },
    { name: "Josei", slug: "josei" },
    { name: "Magic", slug: "magic" },
    { name: "Martial Arts", slug: "martial-arts" },
    { name: "Mature", slug: "mature" },
    { name: "Mecha", slug: "mecha" },
    { name: "Military", slug: "military" },
    { name: "Music", slug: "music" },
    { name: "Mystery", slug: "mystery" },
    { name: "Psychological", slug: "psychological" },
    { name: "Romance", slug: "romance" },
    { name: "School", slug: "school" },
    { name: "School Life", slug: "school-life" },
    { name: "Sci-fi", slug: "sci-fi" },
    { name: "Seinen", slug: "seinen" },
    { name: "Shoujo", slug: "shoujo" },
    { name: "Shounen", slug: "shounen" },
    { name: "Slice of Life", slug: "slice-of-life" },
    { name: "Sports", slug: "sports" },
    { name: "Super Power", slug: "super-power" },
    { name: "Supernatural", slug: "supernatural" },
    { name: "Thriller", slug: "thriller" },
    { name: "Tragedy", slug: "tragedy" },
    { name: "Vampire", slug: "vampire" },
];

const GENRE_ACCENTS = [
    "var(--genre-crimson)", "var(--genre-azure)", "var(--genre-amber)",
    "var(--genre-emerald)", "var(--genre-violet)", "var(--genre-coral)",
    "var(--genre-teal)", "var(--genre-rose)", "var(--genre-lime)",
    "var(--genre-sky)",
];

function GenreCard({ genre, index, accent }) {
    const isLarge = index === 0 || index === 5 || index === 12 || index === 20 || index === 28;

    return (
        <Link
            id={`genre-card-${genre.slug}`}
            to={`/genre/${genre.slug}`}
            className={`genre-card ${isLarge ? "genre-card--large" : ""}`}
            style={{ "--card-accent": accent }}
            data-reveal
        >
            <div className="genre-card__inner">
                <div className="genre-card__accent-line" aria-hidden="true" />
                <div className="genre-card__content">
                    <span className="genre-card__label">Genre</span>
                    <h2 className="genre-card__title">{genre.name}</h2>
                </div>
                <div className="genre-card__arrow" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                    </svg>
                </div>
            </div>
        </Link>
    );
}

export default function DaftarGenre() {
    const containerRef = useRef(null);

    const { data: homeData } = useQuery({
        queryKey: ["home"],
        queryFn: fetchHome,
    });

    const popularComics = Array.isArray(homeData?.popular_today) ? homeData.popular_today : [];

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
            { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
        );
        els.forEach((el, i) => {
            el.style.transitionDelay = `${i * 50}ms`;
            observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const timer = setTimeout(setupObserver, 50);
        return () => clearTimeout(timer);
    }, [setupObserver]);

    return (
        <main className="daftar-genre-page" ref={containerRef}>
            <div className="dg-container">
                <div className="dg-layout">

                    <div className="dg-main">
                        <header className="dg-header" data-reveal>
                            <div className="dg-header__line" aria-hidden="true" />
                            <div className="dg-header__text">
                                <h1 className="dg-header__title">
                                    Jelajahi<br />
                                    <span className="dg-header__title--accent">Genre</span>
                                </h1>
                                <p className="dg-header__sub">
                                    {ALL_GENRES.length} genre tersedia untuk dijelajahi
                                </p>
                            </div>
                        </header>

                        <div className="dg-grid">
                            {ALL_GENRES.map((genre, idx) => {
                                const accent = GENRE_ACCENTS[idx % GENRE_ACCENTS.length];
                                return (
                                    <GenreCard
                                        key={genre.slug}
                                        genre={genre}
                                        index={idx}
                                        accent={accent}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <aside className="dg-sidebar">
                        <Sidebar popular={popularComics} />
                    </aside>
                </div>
            </div>
        </main>
    );
}
