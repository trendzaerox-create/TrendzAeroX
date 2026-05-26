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
    <Link href={`/product/${product.id}`} className="block sm:h-full">
      <article className="group flex flex-col overflow-hidden rounded-[12px] border border-neutral-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)] sm:h-full sm:rounded-[16px] sm:shadow-[0_3px_14px_rgba(0,0,0,0.12)]">
        {/* Product Image - 1:1 Professional Square */}
        <div className="relative w-full overflow-hidden rounded-t-[12px] bg-white sm:rounded-t-[16px]">
          <div className="relative aspect-square w-full bg-white p-2 sm:p-4">
            <button
              type="button"
              onClick={handleWishlistClick}
              className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[19px] font-bold shadow-[0_4px_14px_rgba(0,0,0,0.18)] transition hover:scale-105 sm:right-3 sm:top-3 sm:h-9 sm:w-9 sm:text-[21px]"
              aria-label="Toggle wishlist"
            >
              <span className={isWishlisted ? "text-red-500" : "text-black"}>
                {isWishlisted ? "♥" : "♡"}
              </span>
            </button>

            {firstImage ? (
              <div className="relative h-full w-full overflow-hidden rounded-[10px] bg-white sm:rounded-[12px]">
                <img
                  src={getImageUrl(firstImage)}
                  alt={product.title}
                  className="absolute inset-0 h-full w-full object-contain p-1.5 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-0 sm:p-2"
                />

                {secondImage ? (
                  <img
                    src={getImageUrl(secondImage)}
                    alt={`${product.title} second view`}
                    className="absolute inset-0 h-full w-full object-contain p-1.5 opacity-0 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-100 sm:p-2"
                  />
                ) : (
                  <img
                    src={getImageUrl(firstImage)}
                    alt={product.title}
                    className="absolute inset-0 h-full w-full object-contain p-1.5 opacity-0 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-100 sm:p-2"
                  />
                )}
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white text-xs font-medium text-neutral-500 sm:rounded-[12px] sm:text-sm">
                No Image
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col px-2 pb-2 pt-1.5 sm:flex-1 sm:px-3 sm:pb-3 sm:pt-2.5">
          <div className="flex items-center gap-1">
            <StarRating value={Number(avgRating)} size="12px" />

            <span className="text-[10px] font-medium text-neutral-600 sm:text-[11px]">
              ({reviewCount > 0 ? reviewCount : 0})
            </span>
          </div>

          <h3 className="mt-1.5 line-clamp-1 text-[13px] font-bold leading-4 text-black sm:mt-2 sm:text-[16px] sm:leading-5">
            {product.title}
          </h3>

          <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[12px] leading-none sm:mt-2 sm:gap-1.5 sm:text-[13px]">
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

          {/* Hidden on mobile to decrease card height */}
          <p className="mt-2 hidden line-clamp-1 text-[10px] font-medium text-neutral-700 sm:block">
            Adaptive ANC | 80H Playtime
          </p>

          {/* Hidden on mobile to decrease card height */}
          <div className="mt-2 hidden items-center gap-1.5 sm:flex">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c69b2d] text-[10px] font-bold text-white">
              %
            </span>

            <span className="line-clamp-1 text-[14px] font-semibold text-green-700">
              Offer Price ₹{offerPrice.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Hidden on mobile to decrease card height */}
          <div className="mt-2 hidden items-center gap-2 sm:flex">
            <span className="h-4 w-4 shrink-0 rounded-[2px] border border-neutral-400 bg-white" />

            <span className="text-[13px] font-medium text-neutral-800">
              Add to Compare
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}