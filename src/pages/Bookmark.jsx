import { Link } from "react-router-dom";
import { useBookmark } from "../hooks/useBookmark";

export default function Bookmark() {
  const { bookmarks, removeBookmark } = useBookmark();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-xl font-bold text-white mb-4">
        <i className="fas fa-bookmark text-brand-blue mr-2"></i>
        Bookmark Saya ({bookmarks.length})
      </h1>

      {bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <i className="fas fa-bookmark text-4xl text-gray-600 mb-4 block"></i>
          <p className="text-gray-400 mb-4">Belum ada komik yang di-bookmark.</p>
          <Link to="/" className="text-brand-blue hover:underline">
            Cari komik untuk dibookmark
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {bookmarks.map((komik) => (
            <div key={komik.slug} className="relative group">
              <Link
                to={`/komik/${komik.slug}`}
                className="block bg-dark-card border border-dark-border rounded overflow-hidden hover:border-brand-blue transition"
              >
                <div className="aspect-[2/3]">
                  <img
                    src={komik.cover}
                    alt={komik.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2">
                  <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight h-10">
                    {komik.title}
                  </h3>
                </div>
              </Link>
              <button
                onClick={() => removeBookmark(komik.slug)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                title="Hapus bookmark"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
