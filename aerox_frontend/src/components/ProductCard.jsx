"use client";

import { useDispatch } from "react-redux";
import { addToCart, openCartDrawer } from "@/features/cart/cartSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = async () => {
    await dispatch(addToCart({ product, quantity: 1 }));
    dispatch(openCartDrawer());
  };

  return (
    <div className="h-full rounded-[14px] border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="overflow-hidden rounded-[10px] bg-neutral-100">
        <img
          src={product.images?.[0] || "/placeholder.png"}
          alt={product.title || "Product image"}
          className="h-[220px] w-full object-cover"
        />
      </div>

      <h3 className="mt-3 text-[15px] font-semibold text-black">
        {product.title}
      </h3>

      <p className="mt-1 text-[14px] font-medium text-neutral-800">
        ₹{product.priceInr}
      </p>

      <button
        onClick={handleAddToCart}
        className="mt-3 w-full rounded-full bg-black px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-neutral-800"
      >
        Add to Cart
      </button>
    </div>
  );
}