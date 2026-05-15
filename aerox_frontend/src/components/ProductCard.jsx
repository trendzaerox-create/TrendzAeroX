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
    <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
      <img
        src={product.images?.[0] || "/placeholder.png"}
        alt={product.title}
        width="100%"
        height="220"
        style={{ objectFit: "cover", borderRadius: 10 }}
      />
      <h3>{product.title}</h3>
      <p>₹{product.priceInr}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}