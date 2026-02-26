import { memo } from "react";
import { Link } from "react-router-dom";

function ComicCardDetailed({ title, slug, cover, rating, is_color, type, score }) {
  // Mapping type to flag/origin for visual representation like in screenshot
  const getOriginFlag = (type) => {
    const t = typeof type === 'string' ? type.toLowerCase() : '';
    if (t.includes('manga') || t.includes('japan')) return '🇯🇵';
    if (t.includes('manhwa') || t.includes('korea')) return '🇰🇷';
    if (t.includes('manhua') || t.includes('china')) return '🇨🇳';
    return null;
  };

  const flag = getOriginFlag(type);

  return (
    <Link
      to={`/komik/${slug}`}
      className="group block transition-all"
    >
      <div className="relative aspect-[2/3] rounded overflow-hidden mb-2">
        <img
          src={cover}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
        />
        
        {/* Color Badge */}
        {is_color && (
          <div className="absolute top-1 left-1 bg-yellow-400 text-black text-[10px] font-bold px-1 py-0.5 rounded flex items-center gap-1">
            <i className="fas fa-palette"></i> WARNA
          </div>
        )}

        {/* Origin Flag */}
        {flag && (
          <div className="absolute top-1 right-1 bg-white/90 rounded-sm px-1 py-0.5 text-sm leading-none">
            {flag}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-bold text-white group-hover:text-brand-blue line-clamp-2 leading-tight">
          {title}
        </h3>
        
        <div className="flex justify-between items-center">
          <div className="flex text-orange-500 text-[10px]">
            {[...Array(5)].map((_, i) => (
              <i 
                key={i} 
                className={`${i < Math.floor(rating / 2) ? 'fas' : 'far'} fa-star`}
              ></i>
            ))}
          </div>
          {rating && (
            <span className="text-gray-400 text-[11px] italic">
              {rating}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default memo(ComicCardDetailed);
