import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
    const location = useLocation();
    const glitchRef = useRef(null);

    useEffect(() => {
        const el = glitchRef.current;
        if (!el) return;
        let frame;
        const chars = "!@#$%^&*<>?/|\\[]{}=+~`0123456789";
        const original = "404";
        let step = 0;

        const glitch = () => {
            if (step > 18) {
                el.textContent = original;
                setTimeout(() => {
                    step = 0;
                    frame = requestAnimationFrame(glitch);
                }, 3500);
                return;
            }
            el.textContent = original
                .split("")
                .map((c, i) =>
                    i < step / 6
                        ? c
                        : chars[Math.floor(Math.random() * chars.length)]
                )
                .join("");
            step++;
            frame = requestAnimationFrame(glitch);
        };

        const timeout = setTimeout(() => {
            frame = requestAnimationFrame(glitch);
        }, 800);

        return () => {
            clearTimeout(timeout);
            cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <main
            className="flex-1 flex flex-col items-center justify-center px-4 py-12"
            aria-label="Halaman tidak ditemukan"
        >
            <div className="container mx-auto max-w-6xl">
                {/* Asymmetric layout — number kiri besar, teks kanan */}
                <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-16">

                    {/* Kiri — angka raksasa dengan glitch */}
                    <div className="relative flex-shrink-0 select-none" aria-hidden="true">
                        <span
                            className="block font-black leading-none tracking-tighter text-white"
                            style={{
                                fontSize: "clamp(7rem, 28vw, 18rem)",
                                lineHeight: 0.85,
                                opacity: 0.06,
                                userSelect: "none",
                            }}
                        >
                            404
                        </span>
                        <span
                            ref={glitchRef}
                            className="absolute inset-0 flex items-center font-black leading-none tracking-tighter"
                            style={{
                                fontSize: "clamp(7rem, 28vw, 18rem)",
                                lineHeight: 0.85,
                                background: "linear-gradient(135deg, #007bff 0%, #00cfff 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                                fontVariantNumeric: "tabular-nums",
                            }}
                        >
                            404
                        </span>
                    </div>

                    {/* Kanan — pesan dan aksi */}
                    <div className="md:pb-6 max-w-sm">
                        {/* Label path */}
                        <p
                            className="text-[0.7rem] font-semibold uppercase tracking-widest mb-4"
                            style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em" }}
                        >
                            {location.pathname}
                        </p>

                        <h1
                            className="font-bold text-white mb-3"
                            style={{
                                fontSize: "clamp(1.25rem, 4vw, 1.75rem)",
                                lineHeight: 1.15,
                                letterSpacing: "-0.03em",
                            }}
                        >
                            Halaman ini tidak ada
                        </h1>

                        <p
                            className="mb-8 leading-relaxed"
                            style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem" }}
                        >
                            Route yang kamu tuju tidak ditemukan atau sudah dipindah.
                            Pastikan URL sudah benar.
                        </p>

                        {/* CTA — dua pilihan */}
                        <div className="flex flex-wrap gap-3">
                            <Link
                                to="/"
                                id="btn-home-404"
                                className="inline-flex items-center gap-2 font-semibold text-white px-5 py-2.5 rounded-lg text-sm transition-transform"
                                style={{
                                    background: "linear-gradient(135deg, #007bff, #0056d6)",
                                    boxShadow: "0 4px 20px rgba(0,123,255,0.35)",
                                    transition: "transform 280ms ease, box-shadow 280ms ease",
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,123,255,0.45)";
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,123,255,0.35)";
                                }}
                            >
                                <i className="fas fa-house text-xs" />
                                Kembali ke Beranda
                            </Link>

                            <button
                                id="btn-back-404"
                                onClick={() => window.history.back()}
                                className="inline-flex items-center gap-2 font-semibold px-5 py-2.5 rounded-lg text-sm"
                                style={{
                                    background: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    color: "rgba(255,255,255,0.6)",
                                    transition: "background 280ms ease, color 280ms ease",
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                                    e.currentTarget.style.color = "#fff";
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                                    e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                                }}
                            >
                                <i className="fas fa-arrow-left text-xs" />
                                Halaman sebelumnya
                            </button>
                        </div>

                        {/* Hint cari komik */}
                        <p
                            className="mt-8 text-xs"
                            style={{ color: "rgba(255,255,255,0.2)" }}
                        >
                            Mau cari komik?{" "}
                            <Link
                                to="/search"
                                className="underline underline-offset-2 transition-colors"
                                style={{ color: "rgba(0,123,255,0.7)" }}
                                onMouseEnter={e => (e.currentTarget.style.color = "#007bff")}
                                onMouseLeave={e => (e.currentTarget.style.color = "rgba(0,123,255,0.7)")}
                            >
                                Cari di sini
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Garis dekoratif bawah — memecah grid secara intentional */}
                <div
                    className="mt-16 h-px"
                    aria-hidden="true"
                    style={{
                        background: "linear-gradient(90deg, #007bff 0%, rgba(0,123,255,0) 60%)",
                        maxWidth: "320px",
                    }}
                />
            </div>
        </main>
    );
}
