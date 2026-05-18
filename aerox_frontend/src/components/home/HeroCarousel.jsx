

// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";

// const slides = [
//   {
//     id: 1,
//     image: "/images/banners/banner-1.png",
//     alt: "Signature premium bags banner",
//     eyebrow: "Signature Collection",
//     title: "Premium Bags",
//     offer: "Upto 50% Off",
//     buttonText: "Shop Now",
//     buttonLink: "/products",
//   },
//   {
//     id: 2,
//     image: "/images/banners/banner-2.png",
//     alt: "Luxury handbags banner",
//     eyebrow: "New Arrival",
//     title: "Luxury Handbags",
//     offer: "Elegant Everyday Styles",
//     buttonText: "Explore Collection",
//     buttonLink: "/categories",
//   },
//   {
//     id: 3,
//     image: "/images/banners/banner-3.png",
//     alt: "Trending handbags sale banner",
//     eyebrow: "Trending Now",
//     title: "Office to Evening",
//     offer: "Shop Premium Picks",
//     buttonText: "View Products",
//     buttonLink: "/products",
//   },
// ];

// export default function HeroCarousel() {
//   const [activeIndex, setActiveIndex] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setActiveIndex((prev) => (prev + 1) % slides.length);
//     }, 5000);

//     return () => clearInterval(timer);
//   }, []);

//   const goToSlide = (index) => setActiveIndex(index);

//   const prevSlide = () => {
//     setActiveIndex((prev) =>
//       prev === 0 ? slides.length - 1 : prev - 1
//     );
//   };

//   const nextSlide = () => {
//     setActiveIndex((prev) => (prev + 1) % slides.length);
//   };

//   return (
//     <section className="relative w-full overflow-hidden bg-white">
//       <div className="relative w-full">
//         {/* ✅ MOBILE: 430px | DESKTOP: 480px */}
//         <div className="relative h-[430px] w-full md:h-[480px]">
//           {slides.map((slide, index) => {
//             const isActive = activeIndex === index;

//             return (
//               <div
//                 key={slide.id}
//                 className={`absolute inset-0 transition-all duration-1000 ${
//                   isActive
//                     ? "z-10 opacity-100"
//                     : "pointer-events-none z-0 opacity-0"
//                 }`}
//               >
//                 {/* IMAGE */}
//                 <img
//                   src={slide.image}
//                   alt={slide.alt}
//                   className={`h-full w-full object-cover object-center transition-transform duration-[7000ms] ${
//                     isActive ? "scale-105" : "scale-100"
//                   }`}
//                 />

//                 {/* OVERLAY */}
//                 <div className="absolute inset-0 bg-black/25" />
//                 <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/10" />

//                 {/* CONTENT */}
//                 <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-10">
//                   <div
//                     className={`max-w-[650px] text-center text-white transition-all duration-1000 ${
//                       isActive
//                         ? "translate-y-0 opacity-100"
//                         : "translate-y-8 opacity-0"
//                     }`}
//                   >
//                     <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.32em] text-white/85 sm:text-xs md:text-sm">
//                       {slide.eyebrow}
//                     </p>

//                     <h2 className="text-[20px] font-light uppercase tracking-[0.14em] sm:text-[28px] md:text-[38px] lg:text-[50px] xl:text-[56px]">
//                       {slide.title}
//                     </h2>

//                     <div
//                       className={`mx-auto mt-3 h-[2px] bg-white/80 transition-all duration-1000 ${
//                         isActive ? "w-20 sm:w-24" : "w-0"
//                       }`}
//                     />

//                     <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/90 sm:text-[16px] md:text-[22px] lg:text-[24px]">
//                       {slide.offer}
//                     </p>

//                     <div className="mt-6 flex items-center justify-center">
//                       <Link
//                         href={slide.buttonLink}
//                         className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md transition duration-300 hover:scale-105 hover:bg-white hover:text-black sm:min-h-[46px] sm:px-8"
//                       >
//                         {slide.buttonText}
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}

//           {/* LEFT */}
//           <button
//             type="button"
//             onClick={prevSlide}
//             className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-black"
//           >
//             ‹
//           </button>

//           {/* RIGHT */}
//           <button
//             type="button"
//             onClick={nextSlide}
//             className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-black"
//           >
//             ›
//           </button>

//           {/* DOTS */}
//           <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
//             {slides.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => goToSlide(index)}
//                 className={`h-2 rounded-full transition-all ${
//                   activeIndex === index
//                     ? "w-10 bg-white"
//                     : "w-2 bg-white/50"
//                 }`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

















"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    image: "/images/banners/banner-1.png",
    alt: "Signature premium bags banner",
    eyebrow: "Trendz AeroX",
    title: "India's first open earbuds. Now upgraded.",
    offer: "Launching on 25th May, 12 PM",
    price: "Get ₹1,499 off on launch",
    buttonText: "Pre-book Now",
    buttonLink: "/products",
  },
  {
    id: 2,
    image: "/images/banners/banner-2.png",
    alt: "Luxury electronics banner",
    eyebrow: "New Arrival",
    title: "Smart sound. Premium everyday style.",
    offer: "Designed for comfort and performance",
    price: "Shop latest collection",
    buttonText: "Explore Now",
    buttonLink: "/categories",
  },
  {
    id: 3,
    image: "/images/banners/banner-3.png",
    alt: "Trending electronics banner",
    eyebrow: "Trending Now",
    title: "Upgrade your tech lifestyle.",
    offer: "Premium gadgets for daily use",
    price: "Limited launch offers",
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

  return (
    <section className="w-full bg-gradient-to-b from-black via-[#6b6b6b] to-white px-4 py-0 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-[1180px]">
        <div className="relative h-[430px] w-full overflow-hidden rounded-[18px] bg-black shadow-2xl md:h-[520px]">
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
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className={`h-full w-full object-cover object-center transition-transform duration-[7000ms] ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                />

                <div className="absolute inset-0 bg-black/25" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />

                <div className="absolute inset-0 flex items-center px-7 sm:px-12 md:px-16 lg:px-[180px]">
                  <div
                    className={`max-w-[460px] text-left text-white transition-all duration-1000 ${
                      isActive
                        ? "translate-y-0 opacity-100"
                        : "translate-y-6 opacity-0"
                    }`}
                  >
                    <p className="mb-2 text-[15px] font-medium tracking-wide text-white/95 sm:text-[18px]">
                      {slide.eyebrow}
                    </p>

                    <h2 className="max-w-[470px] text-[30px] font-bold leading-[1.13] tracking-[-0.02em] text-white sm:text-[38px] md:text-[44px]">
                      {slide.title}
                    </h2>

                    <p className="mt-3 text-[15px] font-semibold tracking-wide text-white sm:text-[18px]">
                      {slide.offer}
                    </p>

                    <p className="mt-1 text-[15px] font-semibold tracking-wide text-white sm:text-[18px]">
                      {slide.price}
                    </p>

                    <div className="mt-4">
                      <Link
                        href={slide.buttonLink}
                        className="inline-flex h-[28px] min-w-[155px] items-center justify-center rounded-full bg-[#6f6f6f] px-6 text-[13px] font-semibold text-white transition duration-300 hover:bg-white hover:text-black"
                      >
                        {slide.buttonText}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-[9px]">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-[9px] w-[9px] rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "bg-black"
                    : "bg-white/75 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}