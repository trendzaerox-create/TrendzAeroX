"use client";

import Link from "next/link";

export default function ProductCard({ product }) {
  const firstImage = product.images?.[0] || "/placeholder.png";
  const secondImage = product.images?.[1];

  const sellingPrice = Number(product.priceInr || 0);
  const mrp = Number(product.mrpInr || 0);

  const discountPercent =
    mrp > 0 && sellingPrice > 0 && mrp > sellingPrice
      ? Math.round(((mrp - sellingPrice) / mrp) * 100)
      : 0;

  const productInfo =
    product.shortDescription ||
    product.description ||
    product.category?.name ||
    "Premium product by Trendz AeroX";

  return (
    <Link href={`/product/${product.id}`} className="block h-full">
      <article className="group flex h-full min-h-[360px] flex-col overflow-hidden rounded-[14px] border border-neutral-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(0,0,0,0.18)] sm:min-h-[400px]">
        {/* Product Image */}
        <div className="relative flex h-[210px] items-center justify-center overflow-hidden rounded-t-[14px] bg-white sm:h-[240px] lg:h-[260px]">
          <div className="relative h-full w-full">
            <img
              src={firstImage}
              alt={product.title || "Product image"}
              className="absolute inset-0 h-full w-full object-contain p-3 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-0"
            />

            <img
              src={secondImage || firstImage}
              alt={`${product.title || "Product"} second view`}
              className="absolute inset-0 h-full w-full object-contain p-3 opacity-0 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-3 pb-3 pt-3">
          <h3 className="line-clamp-1 text-[16px] font-bold leading-5 text-black">
            {product.title}
          </h3>

          {/* Price */}
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

          {/* Product Info */}
          <p className="mt-2 line-clamp-1 text-[11px] font-medium text-neutral-700">
            {productInfo}
          </p>

          {/* Offer Row */}
          {discountPercent > 0 && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c69b2d] text-[10px] text-white">
                %
              </span>

              <span className="text-[13px] font-semibold text-green-700">
                Special Offer Available
              </span>
            </div>
          )}

          {/* Compare Row */}
          <div className="mt-auto flex items-center gap-2 pt-3">
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