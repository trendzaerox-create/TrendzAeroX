

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    image: "/images/banners/banner-1.png",
    alt: "Signature premium bags banner",
    eyebrow: "Signature Collection",
    title: "Premium Bags",
    offer: "Upto 50% Off",
    buttonText: "Shop Now",
    buttonLink: "/products",
  },
  {
    id: 2,
    image: "/images/banners/banner-2.png",
    alt: "Luxury handbags banner",
    eyebrow: "New Arrival",
    title: "Luxury Handbags",
    offer: "Elegant Everyday Styles",
    buttonText: "Explore Collection",
    buttonLink: "/categories",
  },
  {
    id: 3,
    image: "/images/banners/banner-3.png",
    alt: "Trending handbags sale banner",
    eyebrow: "Trending Now",
    title: "Office to Evening",
    offer: "Shop Premium Picks",
    buttonText: "View Products",
    buttonLink: "/products",
  },
];

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => setActiveIndex(index);

  const prevSlide = () => {
    setActiveIndex((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative w-full">
        {/* ✅ MOBILE: 430px | DESKTOP: 480px */}
        <div className="relative h-[430px] w-full md:h-[480px]">
          {slides.map((slide, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-1000 ${
                  isActive
                    ? "z-10 opacity-100"
                    : "pointer-events-none z-0 opacity-0"
                }`}
              >
                {/* IMAGE */}
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className={`h-full w-full object-cover object-center transition-transform duration-[7000ms] ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-black/25" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/10" />

                {/* CONTENT */}
                <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-10">
                  <div
                    className={`max-w-[650px] text-center text-white transition-all duration-1000 ${
                      isActive
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0"
                    }`}
                  >
                    <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.32em] text-white/85 sm:text-xs md:text-sm">
                      {slide.eyebrow}
                    </p>

                    <h2 className="text-[20px] font-light uppercase tracking-[0.14em] sm:text-[28px] md:text-[38px] lg:text-[50px] xl:text-[56px]">
                      {slide.title}
                    </h2>

                    <div
                      className={`mx-auto mt-3 h-[2px] bg-white/80 transition-all duration-1000 ${
                        isActive ? "w-20 sm:w-24" : "w-0"
                      }`}
                    />

                    <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/90 sm:text-[16px] md:text-[22px] lg:text-[24px]">
                      {slide.offer}
                    </p>

                    <div className="mt-6 flex items-center justify-center">
                      <Link
                        href={slide.buttonLink}
                        className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md transition duration-300 hover:scale-105 hover:bg-white hover:text-black sm:min-h-[46px] sm:px-8"
                      >
                        {slide.buttonText}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* LEFT */}
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-black"
          >
            ‹
          </button>

          {/* RIGHT */}
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-black"
          >
            ›
          </button>

          {/* DOTS */}
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  activeIndex === index
                    ? "w-10 bg-white"
                    : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}