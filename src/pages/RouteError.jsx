import { useRouteError, Link, isRouteErrorResponse } from "react-router-dom";

export default function RouteError() {
    const error = useRouteError();

    const isNotFound =
        isRouteErrorResponse(error) && error.status === 404;

    const title = isNotFound ? "Konten Tidak Ditemukan" : "Terjadi Kesalahan";
    const code = isRouteErrorResponse(error) ? error.status : "ERR";
    const message = isRouteErrorResponse(error)
        ? error.statusText
        : error?.message || "Terjadi kesalahan yang tidak terduga.";

    return (
        <main
            className="min-h-[80vh] flex items-center px-4"
            aria-label="Halaman error"
        >
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-16">

                    {/* Kiri — kode error besar */}
                    <div className="relative flex-shrink-0 select-none" aria-hidden="true">
                        <span
                            className="block font-black leading-none tracking-tighter text-white"
                            style={{
                                fontSize: "clamp(6rem, 24vw, 16rem)",
                                lineHeight: 0.85,
                                opacity: 0.06,
                                userSelect: "none",
                            }}
                        >
                            {code}
                        </span>
                        <span
                            className="absolute inset-0 flex items-center font-black leading-none tracking-tighter"
                            style={{
                                fontSize: "clamp(6rem, 24vw, 16rem)",
                                lineHeight: 0.85,
                                background: isNotFound
                                    ? "linear-gradient(135deg, #007bff 0%, #00cfff 100%)"
                                    : "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                                fontVariantNumeric: "tabular-nums",
                            }}
                        >
                            {code}
                        </span>
                    </div>

                    {/* Kanan — penjelasan */}
                    <div className="md:pb-6 max-w-sm">
                        <p
                            className="text-[0.7rem] font-semibold uppercase mb-4"
                            style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em" }}
                        >
                            {isNotFound ? "404 · Tidak Ditemukan" : "Error · Sesuatu yang salah"}
                        </p>

                        <h1
                            className="font-bold text-white mb-3"
                            style={{
                                fontSize: "clamp(1.25rem, 4vw, 1.75rem)",
                                lineHeight: 1.15,
                                letterSpacing: "-0.03em",
                            }}
                        >
                            {title}
                        </h1>

                        <p
                            className="mb-8 leading-relaxed font-mono text-xs px-3 py-2 rounded-lg"
                            style={{
                                color: "rgba(255,255,255,0.5)",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                wordBreak: "break-all",
                            }}
                        >
                            {message}
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                to="/"
                                id="btn-home-error"
                                className="inline-flex items-center gap-2 font-semibold text-white px-5 py-2.5 rounded-lg text-sm"
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
                                Ke Beranda
                            </Link>

                            <button
                                id="btn-back-error"
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
                                Kembali
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className="mt-16 h-px"
                    aria-hidden="true"
                    style={{
                        background: isNotFound
                            ? "linear-gradient(90deg, #007bff 0%, rgba(0,123,255,0) 60%)"
                            : "linear-gradient(90deg, #ef4444 0%, rgba(239,68,68,0) 60%)",
                        maxWidth: "320px",
                    }}
                />
            </div>
        </main>
    );
}
