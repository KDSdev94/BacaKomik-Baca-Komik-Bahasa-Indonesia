import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ popular = [], genres = [] }) {
  return (
    <div className="sidebar-human space-y-8">
      {/* Popular Section */}
      <section>
        <div className="sidebar-header mb-4" data-reveal>
          <div className="sidebar-header__indicator" />
          <h3 className="sidebar-header__title">Terpopuler</h3>
          <span className="sidebar-header__label">Hari Ini</span>
        </div>

        <div className="sidebar-list">
          {popular.length === 0 ? (
            <div className="sidebar-empty">
              <p className="text-gray-500 text-sm italic font-mono uppercase tracking-tighter">Memuat deretan terbaik...</p>
            </div>
          ) : (
            popular.slice(0, 10).map((komik, i) => (
              <Link
                key={komik.slug || i}
                to={`/komik/${komik.slug}`}
                className="sidebar-item group"
                data-reveal
              >
                <div className="sidebar-item__rank">
                  <span className="sidebar-item__rank-num">{(i + 1).toString().padStart(2, '0')}</span>
                  <div className="sidebar-item__rank-line" />
                </div>

                <div className="sidebar-item__cover">
                  <img
                    src={komik.cover}
                    alt={komik.title}
                    loading="lazy"
                    className="sidebar-item__img"
                  />
                </div>

                <div className="sidebar-item__content">
                  <h4 className="sidebar-item__title group-hover:text-brand-blue transition-colors">
                    {komik.title}
                  </h4>
                  <div className="sidebar-item__meta">
                    <span className="sidebar-item__type">
                      {typeof komik.type === 'object' ? komik.type.name : komik.type}
                    </span>
                    {komik.rating && (
                      <span className="sidebar-item__rating">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        {komik.rating}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>


    </div>
  );
}
