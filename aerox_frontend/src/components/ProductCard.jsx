"use client";

import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart, openCartDrawer } from "@/features/cart/cartSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    await dispatch(addToCart({ product, quantity: 1 }));
    dispatch(openCartDrawer());
  };

  const sellingPrice = Number(product.priceInr || 0);
  const mrp = Number(product.mrpInr || 0);

  const discountPercent =
    mrp > 0 && sellingPrice > 0 && mrp > sellingPrice
      ? Math.round(((mrp - sellingPrice) / mrp) * 100)
      : 0;

  return (
    <Link href={`/product/${product.id}`} className="block h-full">
      <article className="flex h-full min-h-[400px] flex-col overflow-hidden rounded-[14px] border border-neutral-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(0,0,0,0.18)]">
        <div className="h-[240px] overflow-hidden rounded-t-[14px] bg-white">
          <img
            src={product.images?.[0] || "/placeholder.png"}
            alt={product.title || "Product image"}
            className="h-full w-full object-cover transition duration-500 hover:scale-[1.04]"
          />
        </div>

        <div className="flex flex-1 flex-col px-3 pb-3 pt-3">
          <h3 className="line-clamp-1 text-[16px] font-bold leading-5 text-black">
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

          <p className="mt-2 line-clamp-1 text-[11px] font-medium text-neutral-700">
            {product.shortDescription ||
              product.description ||
              product.category?.name ||
              "Premium product by Trendz AeroX"}
          </p>

          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-auto w-full rounded-full bg-black px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-neutral-800"
          >
            Add to Cart
          </button>
        </div>
      </article>
    </Link>
  );
}