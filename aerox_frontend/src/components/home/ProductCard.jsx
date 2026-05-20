
// "use client";

// import Link from "next/link";
// import StarRating from "@/components/StarRating";
// import getImageUrl from "@/lib/getImageUrl";

// export default function ProductCard({ product }) {
//   const firstImage = product.images?.[0];
//   const secondImage = product.images?.[1];
//   const reviewCount = product.reviews?.length || 0;

//   const avgRating =
//     reviewCount > 0
//       ? (
//           product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
//         ).toFixed(1)
//       : 0;

//   const sellingPrice = Number(product.priceInr || 0);
//   const mrp = Number(product.mrpInr || 0);

//   const discountPercent =
//     mrp > 0 && sellingPrice > 0 && mrp > sellingPrice
//       ? Math.round(((mrp - sellingPrice) / mrp) * 100)
//       : 0;

//   const offerPrice =
//     discountPercent > 0 ? Math.max(sellingPrice - 500, 0) : sellingPrice;

//   return (
//     <Link href={`/product/${product.id}`} className="block h-full">
//       <article className="group flex h-full min-h-[400px] flex-col overflow-hidden rounded-[14px] border border-neutral-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(0,0,0,0.18)]">
//         {/* IMAGE AREA */}
//         <div className="m-2 mb-0 flex h-[240px] items-center justify-center overflow-hidden rounded-[6px] bg-[#A9A9A9] p-4">
//           {firstImage ? (
//             <div className="relative h-full w-full">
//               <img
//                 src={getImageUrl(firstImage)}
//                 alt={product.title}
//                 className="absolute inset-0 h-full w-full object-contain transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-0"
//               />

//               {secondImage ? (
//                 <img
//                   src={getImageUrl(secondImage)}
//                   alt={`${product.title} second view`}
//                   className="absolute inset-0 h-full w-full object-contain opacity-0 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
//                 />
//               ) : (
//                 <img
//                   src={getImageUrl(firstImage)}
//                   alt={product.title}
//                   className="absolute inset-0 h-full w-full object-contain opacity-0 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
//                 />
//               )}
//             </div>
//           ) : (
//             <div className="flex h-full w-full items-center justify-center text-sm text-neutral-500">
//               No Image
//             </div>
//           )}
//         </div>

//         {/* CONTENT AREA */}
//         <div className="flex flex-1 flex-col px-3 pb-3 pt-3">
//           {/* RATING */}
//           <div className="flex items-center gap-1">
//             <StarRating value={Number(avgRating)} size="13px" />
//             <span className="text-[11px] font-medium text-neutral-600">
//               ({reviewCount > 0 ? reviewCount : 0})
//             </span>
//           </div>

//           {/* TITLE */}
//           <h3 className="mt-2 line-clamp-1 text-[16px] font-bold leading-5 text-black">
//             {product.title}
//           </h3>

//           {/* PRICE */}
//           <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[13px] leading-none">
//             {mrp > 0 && (
//               <span className="font-medium text-neutral-500 line-through">
//                 ₹{mrp.toLocaleString("en-IN")}
//               </span>
//             )}

//             <span className="font-bold text-black">
//               ₹{sellingPrice.toLocaleString("en-IN")}
//             </span>

//             {discountPercent > 0 && (
//               <span className="font-bold text-green-700">
//                 {discountPercent}% OFF
//               </span>
//             )}
//           </div>

//           {/* FEATURES */}
//           <p className="mt-2 line-clamp-1 text-[10px] font-medium text-neutral-700">
//             Adaptive ANC | 80H Playtime
//           </p>

//           {/* OFFER PRICE */}
//           <div className="mt-2 flex items-center gap-1.5">
//             <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c69b2d] text-[10px] text-white">
//               %
//             </span>
//             <span className="text-[14px] font-semibold text-green-700">
//               Offer Price ₹{offerPrice.toLocaleString("en-IN")}
//             </span>
//           </div>

//           {/* COMPARE */}
//           <div className="mt-2 flex items-center gap-2">
//             <span className="h-4 w-4 rounded-[2px] border border-neutral-400 bg-white" />
//             <span className="text-[13px] font-medium text-neutral-800">
//               Add to Compare
//             </span>
//           </div>
//         </div>
//       </article>
//     </Link>
//   );
// }
















"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import StarRating from "@/components/StarRating";
import getImageUrl from "@/lib/getImageUrl";
import { getToken } from "@/lib/tokenStorage";
import { toggleWishlist } from "@/features/wishlist/wishlistSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const wishlistItems = useSelector((state) => state.wishlist.items);

  const firstImage = product.images?.[0];
  const secondImage = product.images?.[1];
  const reviewCount = product.reviews?.length || 0;

  const isWishlisted = wishlistItems.some(
    (item) => Number(item.productId) === Number(product.id)
  );

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    dispatch(toggleWishlist(product.id));
  };

  const avgRating =
    reviewCount > 0
      ? (
          product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        ).toFixed(1)
      : 0;

  const sellingPrice = Number(product.priceInr || 0);
  const mrp = Number(product.mrpInr || 0);

  const discountPercent =
    mrp > 0 && sellingPrice > 0 && mrp > sellingPrice
      ? Math.round(((mrp - sellingPrice) / mrp) * 100)
      : 0;

  const offerPrice =
    discountPercent > 0 ? Math.max(sellingPrice - 500, 0) : sellingPrice;

  return (
    <Link href={`/product/${product.id}`} className="block h-full">
      <article className="group flex h-full min-h-[400px] flex-col overflow-hidden rounded-[14px] border border-neutral-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(0,0,0,0.18)]">
        <div className="relative m-2 mb-0 flex h-[240px] items-center justify-center overflow-hidden rounded-[6px] bg-[#A9A9A9] p-4">
          <button
            type="button"
            onClick={handleWishlistClick}
            className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[22px] font-bold shadow-md transition hover:scale-105"
            aria-label="Toggle wishlist"
          >
            <span className={isWishlisted ? "text-red-500" : "text-black"}>
              {isWishlisted ? "♥" : "♡"}
            </span>
          </button>

          {firstImage ? (
            <div className="relative h-full w-full">
              <img
                src={getImageUrl(firstImage)}
                alt={product.title}
                className="absolute inset-0 h-full w-full object-contain transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-0"
              />

              {secondImage ? (
                <img
                  src={getImageUrl(secondImage)}
                  alt={`${product.title} second view`}
                  className="absolute inset-0 h-full w-full object-contain opacity-0 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
                />
              ) : (
                <img
                  src={getImageUrl(firstImage)}
                  alt={product.title}
                  className="absolute inset-0 h-full w-full object-contain opacity-0 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
                />
              )}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-neutral-500">
              No Image
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col px-3 pb-3 pt-3">
          <div className="flex items-center gap-1">
            <StarRating value={Number(avgRating)} size="13px" />

            <span className="text-[11px] font-medium text-neutral-600">
              ({reviewCount > 0 ? reviewCount : 0})
            </span>
          </div>

          <h3 className="mt-2 line-clamp-1 text-[16px] font-bold leading-5 text-black">
            {product.title}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[13px] leading-none">
            {mrp > 0 && (
              <span className="font-medium text-neutral-500 line-through">
                ₹{mrp.toLocaleString("en-IN")}
              </span>
            )}

            <span className="font-bold text-black">
              ₹{sellingPrice.toLocaleString("en-IN")}
            </span>

            {discountPercent > 0 && (
              <span className="font-bold text-green-700">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          <p className="mt-2 line-clamp-1 text-[10px] font-medium text-neutral-700">
            Adaptive ANC | 80H Playtime
          </p>

          <div className="mt-2 flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c69b2d] text-[10px] text-white">
              %
            </span>

            <span className="text-[14px] font-semibold text-green-700">
              Offer Price ₹{offerPrice.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span className="h-4 w-4 rounded-[2px] border border-neutral-400 bg-white" />

            <span className="text-[13px] font-medium text-neutral-800">
              Add to Compare
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}