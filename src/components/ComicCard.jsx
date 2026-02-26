import { memo } from "react";
import { Link } from "react-router-dom";

function ComicCard({ title, slug, cover, chapter, rating, badge }) {
  return (
    <Link
      to={`/komik/${slug}`}
      className="group block bg-dark-card border border-dark-border rounded overflow-hidden hover:border-brand-blue transition"
    >
      <div className="relative aspect-[2/3]">
        <img
          src={cover}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {badge && (
          <span
            className={`absolute top-1 right-1 text-white text-[0.65rem] font-bold px-1.5 py-0.5 rounded ${
              badge === "HOT" ? "bg-red-600" : "bg-blue-600"
            }`}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="p-2">
        <h3 className="text-sm font-semibold text-white group-hover:text-brand-blue line-clamp-2 leading-tight h-10">
          {title}
        </h3>
        <div className="mt-2 flex justify-between items-center text-xs text-gray-400">
          {chapter && <span>{typeof chapter === 'object' ? chapter.name : `Ch. ${chapter}`}</span>}
          {rating && (
            <span>
              <i className="fas fa-star text-yellow-500"></i> {rating}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default memo(ComicCard);
