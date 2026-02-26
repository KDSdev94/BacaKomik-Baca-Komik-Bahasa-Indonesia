import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark-card border-t border-dark-border mt-2 pt-5 pb-8 md:pb-6">
      <div className="container mx-auto max-w-6xl px-4 flex flex-col items-center justify-center text-sm text-gray-500">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 mb-3">
          <img src="/Logo Header.png" alt="BacaKomik" className="h-8 w-auto object-contain opacity-90" />

        </Link>
        <div className="flex gap-4 mb-2 flex-wrap justify-center">
          <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
          <Link to="/type/manga" className="hover:text-white transition-colors">Manga</Link>
          <a
            href="https://discord.gg/EAEDHZST"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-[#5865F2]"
          >
            <i className="fab fa-discord"></i>
            Discord
          </a>
        </div>
        <p className="text-xs">© 2026 BacaKomik. All rights reserved.</p>
      </div>
    </footer>
  );
}
