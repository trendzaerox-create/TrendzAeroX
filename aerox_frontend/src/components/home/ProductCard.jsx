"use client";

import Link from "next/link";
import StarRating from "@/components/StarRating";
import getImageUrl from "@/lib/getImageUrl";

export default function ProductCard({ product }) {
  const firstImage = product.images?.[0];
  const secondImage = product.images?.[1];
  const reviewCount = product.reviews?.length || 0;

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

  return (
    <Link href={`/product/${product.id}`} className="block h-full">
      <article className="group flex h-full min-h-[420px] flex-col overflow-hidden rounded-[18px] border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] sm:min-h-[480px] sm:rounded-[22px] lg:min-h-[520px]">
        {/* IMAGE AREA */}
        <div className="relative flex basis-[72%] items-center justify-center overflow-hidden bg-white p-2 sm:basis-[80%] sm:p-4 lg:basis-[85%]">
          {firstImage ? (
            <div className="relative h-full w-full">
              <img
                src={getImageUrl(firstImage)}
                alt={product.title}
                className="absolute inset-0 h-full max-h-full w-full object-contain transition-all duration-500 group-hover:scale-[1.03] group-hover:opacity-0"
              />

              {secondImage && (
                <img
                  src={getImageUrl(secondImage)}
                  alt={`${product.title} second view`}
                  className="absolute inset-0 h-full max-h-full w-full object-contain opacity-0 transition-all duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
                />
              )}

              {!secondImage && (
                <img
                  src={getImageUrl(firstImage)}
                  alt={product.title}
                  className="absolute inset-0 h-full max-h-full w-full object-contain opacity-0 transition-all duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
                />
              )}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-white text-[16px] text-neutral-500 sm:text-[18px]">
              No Image
            </div>
          )}

          <span className="absolute left-2 top-2 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#111111] shadow-sm sm:left-3 sm:top-3 sm:px-3 sm:text-[12px] sm:tracking-[0.14em]">
            Trendz Aerox
          </span>
        </div>

        {/* CONTENT AREA */}
        <div className="flex basis-[28%] flex-col bg-white p-2.5 sm:basis-[20%] sm:p-4 lg:basis-[15%]">
          <h3 className="line-clamp-1 text-[14px] font-semibold leading-5 text-[#111111] sm:text-[18px]">
            {product.title}
          </h3>

          <div className="mt-1 flex items-center gap-1.5 sm:gap-2">
            <StarRating value={Number(avgRating)} size="14px" />
            <span className="text-[11px] text-neutral-600 sm:text-[14px]">
              {reviewCount > 0
                ? `${avgRating} (${reviewCount})`
                : "No reviews yet"}
            </span>
          </div>

          <div className="mt-1.5 flex items-start justify-between gap-2 sm:mt-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
                {discountPercent > 0 && (
                  <span className="text-[15px] font-bold leading-none tracking-[-0.02em] text-[#cc0c39] sm:text-[20px]">
                    -{discountPercent}%
                  </span>
                )}

                <p className="m-0 text-[19px] font-bold leading-none tracking-[-0.03em] text-[#111111] sm:text-[26px]">
                  ₹{sellingPrice.toLocaleString("en-IN")}
                </p>
              </div>

              {mrp > 0 && (
                <p className="mt-1 text-[11px] font-medium leading-none text-neutral-500 sm:text-[14px]">
                  <span>M.R.P.:</span>{" "}
                  <span className="line-through">
                    ₹{mrp.toLocaleString("en-IN")}
                  </span>
                </p>
              )}
            </div>

            <span
              className={`shrink-0 text-right text-[10px] font-semibold uppercase tracking-[0.06em] sm:text-[12px] sm:tracking-[0.08em] ${
                product.stock === 0
                  ? "text-red-600"
                  : product.stock <= 5
                  ? "text-amber-600"
                  : "text-green-700"
              }`}
            >
              {product.stock === 0
                ? "Out of Stock"
                : product.stock <= 5
                ? `${product.stock} Left`
                : "In Stock"}
            </span>
          </div>

          <div className="mt-auto pt-2 sm:pt-3">
            <div className="inline-flex min-h-[34px] w-full items-center justify-center rounded-full bg-[#111111] px-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:bg-black sm:min-h-[40px] sm:px-4 sm:text-[13px] sm:tracking-[0.12em]">
              View Product
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}