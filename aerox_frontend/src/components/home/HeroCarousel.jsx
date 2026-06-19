
"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    image: "/images/banners/Home/home-hero-banner-1.png",
    alt: "Signature premium bags banner",
  },
  {
    id: 2,
    image: "/images/banners/Home/home-hero-banner-1.png",
    alt: "Luxury electronics banner",
  },
  {
    id: 3,
    image: "/images/banners/Home/home-hero-banner-1.png",
    alt: "Trending electronics banner",
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
    <section className="w-full bg-gradient-to-b from-black via-[#6b6b6b] to-white px-2 py-0 sm:px-5 lg:px-7">
      <div className="w-full max-w-none">
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






















// "use client";

// import { useEffect, useState } from "react";

// const slides = [
//   {
//     id: 1,
//     image: "/images/banners/home/home-hero-banner-1.png",
//     alt: "Signature premium bags banner",
//   },
//   {
//     id: 2,
//     image: "/images/banners/home/home-hero-banner-2.png",
//     alt: "Luxury electronics banner",
//   },
//   {
//     id: 3,
//     image: "/images/banners/home/home-hero-banner-3.png",
//     alt: "Trending electronics banner",
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

//   return (
//     <section className="w-full bg-gradient-to-b from-black via-[#6b6b6b] to-white px-2 py-0 sm:px-5 lg:px-7">
//       <div className="w-full max-w-none">
//         <div className="relative h-[430px] w-full overflow-hidden rounded-[18px] bg-black shadow-2xl md:h-[520px]">
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
//                 <img
//                   src={slide.image}
//                   alt={slide.alt}
//                   loading={index === 0 ? "eager" : "lazy"}
//                   className={`h-full w-full object-contain object-center transition-opacity duration-[7000ms] ${
//                     isActive ? "opacity-100" : "opacity-0"
//                   }`}
//                 />
//               </div>
//             );
//           })}

//           <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-[9px]">
//             {slides.map((_, index) => (
//               <button
//                 key={index}
//                 type="button"
//                 onClick={() => goToSlide(index)}
//                 aria-label={`Go to slide ${index + 1}`}
//                 className={`h-[9px] w-[9px] rounded-full transition-all duration-300 ${
//                   activeIndex === index
//                     ? "bg-black"
//                     : "bg-white/75 hover:bg-white"
//                 }`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }