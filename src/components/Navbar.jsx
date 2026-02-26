import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSearch } from "../api/komikApi";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  // Debounce: only search after user stops typing for 400ms
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: searchResults, isFetching } = useQuery({
    queryKey: ["liveSearch", debouncedQuery],
    queryFn: () => fetchSearch(debouncedQuery),
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 1000 * 30,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setShowDropdown(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setShowDropdown(e.target.value.trim().length >= 2);
  };

  const handleResultClick = () => {
    setQuery("");
    setShowDropdown(false);
  };

  // Results to show in dropdown (limit 6)
  const results = Array.isArray(searchResults) ? searchResults.slice(0, 6) : [];

  return (
    <>
      {/* Top bar - desktop only */}
      <div className="hidden md:block border-b border-white/5" style={{ background: 'rgba(15,15,20,0.65)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
        <div className="container mx-auto max-w-6xl px-4 py-2 flex justify-between items-center text-xs text-gray-400">
          <div className="flex space-x-4">
            <a href="https://discord.gg/EAEDHZST" target="_blank" rel="noopener noreferrer" className="hover:text-white"><i className="fab fa-discord"></i> Discord</a>
            <Link to="/" className="hover:text-white"><i className="fas fa-file-alt"></i> Homepage</Link>
          </div>
          {/* Desktop Live Search */}
          <div ref={wrapperRef} className="relative w-64">
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative w-full">
                <input
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  onFocus={() => query.trim().length >= 2 && setShowDropdown(true)}
                  placeholder="Cari komik..."
                  autoComplete="off"
                  className="w-full bg-[#222] border border-dark-border rounded text-white px-3 py-1 focus:outline-none focus:border-brand-blue transition-colors"
                />
                <button type="submit" className="absolute right-3 top-2 text-gray-500 hover:text-white">
                  {isFetching && debouncedQuery.length >= 2
                    ? <i className="fas fa-spinner fa-spin text-brand-blue"></i>
                    : <i className="fas fa-search"></i>
                  }
                </button>
              </div>
            </form>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-[#1a1a1a] border border-dark-border rounded-lg shadow-2xl z-[9999] overflow-hidden">
                {isFetching && results.length === 0 ? (
                  <div className="flex items-center gap-2 px-4 py-3 text-gray-400 text-xs">
                    <i className="fas fa-spinner fa-spin text-brand-blue"></i>
                    <span>Mencari...</span>
                  </div>
                ) : results.length > 0 ? (
                  <>
                    {results.map((komik) => (
                      <Link
                        key={komik.slug}
                        to={`/komik/${komik.slug}`}
                        onClick={handleResultClick}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors group"
                      >
                        <img
                          src={komik.cover}
                          alt={komik.title}
                          className="w-9 h-12 object-cover rounded flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-semibold line-clamp-1 group-hover:text-brand-blue transition-colors">
                            {komik.title}
                          </p>
                          <p className="text-gray-500 text-[10px] mt-0.5">
                            {typeof komik.type === 'object' ? komik.type?.name : komik.type || '-'}
                          </p>
                        </div>
                        {komik.rating && (
                          <span className="text-yellow-400 text-[10px] flex items-center gap-1 flex-shrink-0">
                            <i className="fas fa-star text-[8px]"></i>
                            {komik.rating}
                          </span>
                        )}
                      </Link>
                    ))}
                    <button
                      onClick={handleSearch}
                      className="w-full py-2 text-center text-xs text-brand-blue hover:bg-brand-blue/10 transition-colors border-t border-dark-border font-medium"
                    >
                      Lihat semua hasil untuk "{query}" →
                    </button>
                  </>
                ) : debouncedQuery.length >= 2 && !isFetching ? (
                  <div className="px-4 py-3 text-gray-500 text-xs italic">
                    Tidak ada komik ditemukan untuk "{debouncedQuery}"
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10" style={{ background: 'rgba(10,10,16,0.6)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: '0 4px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
        <div className="container mx-auto max-w-6xl px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/Logo Header.png" alt="BacaKomik" className="h-9 w-auto object-contain" />
          </Link>

          <div className="hidden md:flex space-x-6 text-sm font-semibold">
            <Link to="/" className="text-white hover:text-brand-blue">Home</Link>
            <Link to="/type/manga" className="hover:text-brand-blue">Manga</Link>
            <Link to="/type/manhwa" className="hover:text-brand-blue">Manhwa</Link>
            <Link to="/type/manhua" className="hover:text-brand-blue">Manhua</Link>
            <Link to="/bookmark" className="hover:text-brand-blue">Bookmark</Link>
            <Link to="/daftar-genre" className="hover:text-brand-blue">Daftar Genre</Link>
          </div>

          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"} text-xl`}></i>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 px-4 py-3 space-y-3" style={{ background: 'rgba(10,10,16,0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
            {/* Mobile Live Search */}
            <div className="relative" ref={wrapperRef}>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  onFocus={() => query.trim().length >= 2 && setShowDropdown(true)}
                  placeholder="Cari komik..."
                  autoComplete="off"
                  className="w-full bg-[#222] border border-dark-border rounded text-white px-3 py-2 pr-10 focus:outline-none focus:border-brand-blue"
                />
                <button type="submit" className="absolute right-3 top-3 text-gray-500">
                  {isFetching ? <i className="fas fa-spinner fa-spin text-brand-blue"></i> : <i className="fas fa-search"></i>}
                </button>
              </form>
              {showDropdown && results.length > 0 && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-[#1a1a1a] border border-dark-border rounded-lg shadow-2xl z-[9999] overflow-hidden">
                  {results.map((komik) => (
                    <Link
                      key={komik.slug}
                      to={`/komik/${komik.slug}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors"
                    >
                      <img src={komik.cover} alt={komik.title} className="w-9 h-12 object-cover rounded flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold line-clamp-1">{komik.title}</p>
                        <p className="text-gray-500 text-[10px]">{typeof komik.type === 'object' ? komik.type?.name : komik.type || '-'}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link to="/" onClick={() => setMenuOpen(false)} className="block text-white hover:text-brand-blue">Home</Link>
            <Link to="/type/manga" onClick={() => setMenuOpen(false)} className="block hover:text-brand-blue">Manga</Link>
            <Link to="/type/manhwa" onClick={() => setMenuOpen(false)} className="block hover:text-brand-blue">Manhwa</Link>
            <Link to="/type/manhua" onClick={() => setMenuOpen(false)} className="block hover:text-brand-blue">Manhua</Link>
            <Link to="/bookmark" onClick={() => setMenuOpen(false)} className="block hover:text-brand-blue">Bookmark</Link>
            <Link to="/daftar-genre" onClick={() => setMenuOpen(false)} className="block hover:text-brand-blue">Daftar Genre</Link>
          </div>
        )}
      </nav>
    </>
  );
}
