import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import "./hero-slider.css";

export default function HeroSlider({ slides = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [direction, setDirection] = useState("next"); // "next" | "prev"
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef(null);

  const total = slides.length;

  const goTo = useCallback(
    (idx, dir = "next") => {
      if (isAnimating || idx === activeIndex) return;
      setDirection(dir);
      setPrevIndex(activeIndex);
      setIsAnimating(true);
      setActiveIndex(idx);
      setTimeout(() => {
        setPrevIndex(null);
        setIsAnimating(false);
      }, 700);
    },
    [activeIndex, isAnimating]
  );

  const goNext = useCallback(() => {
    goTo((activeIndex + 1) % total, "next");
  }, [activeIndex, total, goTo]);

  const goPrev = useCallback(() => {
    goTo((activeIndex - 1 + total) % total, "prev");
  }, [activeIndex, total, goTo]);

  // Auto-slide
  useEffect(() => {
    if (total <= 1) return;
    timerRef.current = setInterval(goNext, 6000);
    return () => clearInterval(timerRef.current);
  }, [goNext, total]);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(goNext, 6000);
  };

  if (!slides.length) return null;

  const slide = slides[activeIndex];
  const typeName =
    slide.type && typeof slide.type === "object"
      ? slide.type.name
      : slide.type || "Komik";

  return (
    <div className="hs-root">
      {/* ── Background Layer ── */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`hs-bg ${
            i === activeIndex
              ? `hs-bg--active hs-bg--in-${direction}`
              : i === prevIndex
              ? `hs-bg--out-${direction}`
              : ""
          }`}
          aria-hidden="true"
        >
          <img src={s.cover} alt="" className="hs-bg__img" />
          <div className="hs-bg__overlay" />
        </div>
      ))}

      {/* ── Decorative noise texture ── */}
      <div className="hs-noise" aria-hidden="true" />

      {/* ── Content ── */}
      <div className="hs-content">
        {/* Left: Cover (desktop only) */}
        <div className="hs-cover-wrap">
          <div
            className={`hs-cover ${isAnimating ? "hs-cover--swap" : ""}`}
            key={activeIndex}
          >
            <img src={slide.cover} alt={slide.title} className="hs-cover__img" />
            <div className="hs-cover__shine" />
          </div>
        </div>

        {/* Right: Info */}
        <div className="hs-info" key={activeIndex}>
          {/* Mobile cover thumbnail */}
          <div className="hs-mobile-cover">
            <img src={slide.cover} alt={slide.title} className="hs-mobile-cover__img" />
            <div className="hs-mobile-cover__shine" />
          </div>

          <div className="hs-info__badge">
            <span className="hs-badge-type">{typeName}</span>
            {slide.rating && (
              <span className="hs-badge-rating">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {slide.rating}
              </span>
            )}
          </div>

          <h1 className="hs-info__title">{slide.title}</h1>

          <div className="hs-info__divider" />

          {slide.synopsis && (
            <p className="hs-info__synopsis">{slide.synopsis}</p>
          )}

          <div className="hs-info__actions">
            <Link
              to={`/komik/${slide.slug}`}
              className="hs-btn hs-btn--primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Baca Sekarang
            </Link>
            <Link
              to={`/komik/${slide.slug}`}
              className="hs-btn hs-btn--ghost"
            >
              Detail
            </Link>
          </div>

          {/* Slide counter + dots — always visible */}
          <div className="hs-info__footer">
            <div className="hs-counter">
              <span className="hs-counter__current">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <span className="hs-counter__sep" />
              <span className="hs-counter__total">
                {String(total).padStart(2, "0")}
              </span>
            </div>
            <div className="hs-dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`hs-dot ${i === activeIndex ? "hs-dot--active" : ""}`}
                  onClick={() => {
                    resetTimer();
                    goTo(i, i > activeIndex ? "next" : "prev");
                  }}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <button
        className="hs-nav hs-nav--prev"
        onClick={() => { resetTimer(); goPrev(); }}
        aria-label="Slide sebelumnya"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        className="hs-nav hs-nav--next"
        onClick={() => { resetTimer(); goNext(); }}
        aria-label="Slide berikutnya"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* ── Progress Bar ── */}
      <div className="hs-progress" aria-hidden="true">
        <div className="hs-progress__bar" key={activeIndex} />
      </div>
    </div>
  );
}
