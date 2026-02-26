import { Link, useLocation } from "react-router-dom";

export default function MobileNav() {
  const { pathname } = useLocation();

  const links = [
    { to: "/", icon: "fa-home", label: "Home", exact: true },
    { to: "/type/manga", icon: "fa-list", label: "Manga" },
    { to: "/bookmark", icon: "fa-bookmark", label: "Bookmark" },
    { to: "/search", icon: "fa-search", label: "Cari" },
  ];

  const isActive = (to, exact) =>
    exact ? pathname === to : pathname.startsWith(to);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 md:hidden z-50 px-2 py-1.5 flex justify-around border-t border-white/8"
      style={{
        background: "rgba(10,10,16,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {links.map(({ to, icon, label, exact }) => {
        const active = isActive(to, exact);
        return (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors"
            style={{ color: active ? "#007bff" : "#6b7280" }}
          >
            <i className={`fas ${icon} text-lg`} />
            <span
              className="text-[10px] font-medium"
              style={{ color: active ? "#007bff" : "#6b7280" }}
            >
              {label}
            </span>
            {active && (
              <span
                className="absolute bottom-1 w-1 h-1 rounded-full bg-brand-blue"
                style={{ position: "absolute", bottom: "6px" }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}
