import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectCoverflow } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

export default function HeroSlider({ slides = [] }) {
  if (!slides.length) return null;

  return (
    <div className="relative mb-4 w-full group overflow-hidden bg-[#111111] py-6">
      <Swiper
        modules={[Autoplay, Navigation, EffectCoverflow]}
        effect="coverflow"
        centeredSlides={true}
        loop={true}
        slidesPerView="auto"
        spaceBetween={30}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false,
        }}
        navigation={{
          nextEl: ".swiper-nav-next",
          prevEl: ".swiper-nav-prev",
        }}
        className="w-full max-w-7xl mx-auto h-[480px] !overflow-visible"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i} className="!w-auto flex items-center justify-center">
            {({ isActive }) => (
              <div className={`flex items-center relative transition-all duration-500 ease-out ${isActive ? 'z-30' : 'z-10'}`}>

                {/* Main Cover Image */}
                <div className={`relative rounded-xl overflow-hidden shadow-2xl transition-all duration-500 border border-gray-700 bg-black flex-shrink-0 ${isActive ? 'w-[300px] h-[420px] scale-100 opacity-100' : 'w-[240px] h-[340px] scale-95 opacity-50 brightness-75 hover:opacity-75 transition-all'}`}>
                  <img
                    src={slide.cover}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient Overlay & Title pada Cover */}
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-center">
                    <h3 className={`font-bold text-white drop-shadow-md transition-all line-clamp-2 ${isActive ? 'text-xl leading-tight' : 'text-sm'}`}>
                      {slide.title}
                    </h3>
                    {isActive && slide.type && (
                      <span className="text-xs text-gray-300 mt-1 drop-shadow-md block">
                        {typeof slide.type === 'object' ? slide.type.name : slide.type}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Info Panel (Absolute positioning to keep cover centered) */}
                {isActive && (
                  <div
                    className={`hidden lg:flex absolute left-[285px] overflow-hidden transition-all duration-700 ease-in-out origin-left z-[-1] animate-in slide-in-from-left-5 fade-in`}
                  >
                    <div className="w-[400px] h-[360px] bg-[#1c1c1c]/95 backdrop-blur-md rounded-r-xl p-8 flex flex-col justify-between border border-gray-800 shadow-2xl">

                      {/* Content Atas: Clean & Elegant */}
                      <div className="flex-1">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 line-clamp-2 leading-tight tracking-tight" title={slide.title}>
                          {slide.title}
                        </h2>

                        <div className="w-12 h-1 bg-blue-600 mb-6 rounded-full" />

                        <p className="text-[14px] text-gray-400 line-clamp-6 leading-relaxed font-light italic">
                          {slide.synopsis || "Deskripsi tidak tersedia untuk judul ini."}
                        </p>
                      </div>

                      {/* Content Bawah (Rating & Type) - Stable Bottom Bar */}
                      <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-auto bg-[#111111 ] p-1 rounded-b-xl">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                            <i className="fas fa-star text-yellow-500 text-[12px]"></i>
                            <span className="text-white font-bold text-sm">{slide.rating || 'N/A'}</span>
                          </div>
                          <div className="px-3 py-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
                            <span className="text-gray-300 font-medium text-[11px] uppercase tracking-[0.1em]">
                              {typeof slide.type === 'object' ? slide.type.name : slide.type || 'Comics'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Floating Play Button - Fixed position to prevent shifting */}
                      <Link
                        to={`/komik/${slide.slug}`}
                        className="absolute bottom-6 right-6 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(37,99,235,0.4)] hover:bg-white hover:text-blue-600 hover:scale-110 transition-all duration-500 cursor-pointer z-30 group/play border-4 border-[#1c1c1c]"
                      >
                        <i className="fas fa-play ml-1 text-xl group-hover:scale-110 transition-transform"></i>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Mobile Play Button - Now inside the main div where isActive is available */}
                {isActive && (
                  <Link
                    to={`/komik/${slide.slug}`}
                    className="lg:hidden absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 w-16 h-16 bg-blue-600/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-500 hover:scale-105 transition-all z-30"
                  >
                    <i className="fas fa-play text-white ml-1 text-xl"></i>
                  </Link>
                )}
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button className="swiper-nav-prev absolute top-1/2 left-4 md:left-6 z-40 w-12 h-12 bg-black/40 hover:bg-black/60 flex items-center justify-center rounded-full transition backdrop-blur-md border border-white/10 text-white -translate-y-1/2">
        <i className="fas fa-chevron-left"></i>
      </button>
      <button className="swiper-nav-next absolute top-1/2 right-4 md:right-6 z-40 w-12 h-12 bg-black/40 hover:bg-black/60 flex items-center justify-center rounded-full transition backdrop-blur-md border border-white/10 text-white -translate-y-1/2">
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
}