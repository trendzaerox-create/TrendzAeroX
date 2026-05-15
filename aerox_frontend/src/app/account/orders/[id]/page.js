// "use client";

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useRouter, useSearchParams } from "next/navigation";
// import {
//   clearSelectedOrder,
//   fetchMyOrderById,
// } from "@/features/orders/orderSlice";

// export default function OrderDetailsPage() {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const params = useParams();
//   const searchParams = useSearchParams();

//   const { token } = useSelector((state) => state.auth);
//   const { selectedOrder, loading, error } = useSelector((state) => state.orders);

//   const successType = searchParams.get("success");

//   useEffect(() => {
//     if (!token) {
//       router.replace(`/login?next=/account/orders/${params.id}`);
//       return;
//     }

//     if (params?.id) {
//       dispatch(fetchMyOrderById(params.id));
//     }

//     return () => {
//       dispatch(clearSelectedOrder());
//     };
//   }, [dispatch, token, params?.id, router]);

//   if (!token) return null;

//   if (loading) {
//     return (
//       <div style={{ maxWidth: 1100, margin: "0 auto", padding: 20 }}>
//         Loading order details...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={{ maxWidth: 1100, margin: "0 auto", padding: 20 }}>
//         <p style={{ color: "red" }}>{error}</p>
//       </div>
//     );
//   }

//   if (!selectedOrder) {
//     return (
//       <div style={{ maxWidth: 1100, margin: "0 auto", padding: 20 }}>
//         <p>Order not found.</p>
//       </div>
//     );
//   }

//   const order = selectedOrder;

//   return (
//     <div style={{ maxWidth: 1100, margin: "0 auto", padding: 20 }}>
//       {successType === "cod" && (
//         <div
//           style={{
//             marginBottom: 16,
//             padding: 12,
//             borderRadius: 10,
//             background: "#e8f7e8",
//             color: "#136c13",
//             border: "1px solid #b7e3b7",
//           }}
//         >
//           Your Cash on Delivery order has been placed successfully.
//         </div>
//       )}

//       {successType === "paid" && (
//         <div
//           style={{
//             marginBottom: 16,
//             padding: 12,
//             borderRadius: 10,
//             background: "#e8f7e8",
//             color: "#136c13",
//             border: "1px solid #b7e3b7",
//           }}
//         >
//           Payment successful. Your order has been confirmed.
//         </div>
//       )}

//       <button
//         onClick={() => router.push("/account/orders")}
//         style={{
//           marginBottom: 16,
//           padding: "10px 14px",
//           border: "1px solid #ccc",
//           borderRadius: 8,
//           background: "#fff",
//           cursor: "pointer",
//         }}
//       >
//         ← Back to Orders
//       </button>

//       <div
//         style={{
//           border: "1px solid #ddd",
//           borderRadius: 12,
//           padding: 20,
//           background: "#fff",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             gap: 20,
//             flexWrap: "wrap",
//             marginBottom: 20,
//           }}
//         >
//           <div>
//             <h1 style={{ margin: 0 }}>{order.orderNumber}</h1>
//             <p style={{ margin: "8px 0 0" }}>
//               Status: <strong>{order.status}</strong>
//             </p>
//             <p style={{ margin: "6px 0 0" }}>
//               Payment Method: <strong>{order.paymentMethod}</strong>
//             </p>
//             <p style={{ margin: "6px 0 0" }}>
//               Payment Status: <strong>{order.paymentStatus || "PENDING"}</strong>
//             </p>
//             {order.createdAt && (
//               <p style={{ margin: "6px 0 0" }}>
//                 Ordered On:{" "}
//                 <strong>{new Date(order.createdAt).toLocaleString("en-IN")}</strong>
//               </p>
//             )}
//           </div>

//           <div style={{ textAlign: "right" }}>
//             <p style={{ margin: 0 }}>Subtotal: ₹{order.subtotalAmount}</p>
//             <p style={{ margin: "6px 0 0" }}>Shipping: ₹{order.shippingAmount}</p>
//             <p style={{ margin: "6px 0 0", fontSize: 18 }}>
//               Total: <strong>₹{order.totalAmount}</strong>
//             </p>
//           </div>
//         </div>

//         <div
//           style={{
//             borderTop: "1px solid #eee",
//             paddingTop: 16,
//             marginTop: 16,
//           }}
//         >
//           <h3>Delivery Address</h3>
//           <p style={{ margin: "6px 0" }}>{order.addressFullName}</p>
//           <p style={{ margin: "6px 0" }}>{order.addressPhone}</p>
//           <p style={{ margin: "6px 0" }}>
//             {order.addressLine1}
//             {order.addressLine2 ? `, ${order.addressLine2}` : ""}
//           </p>
//           <p style={{ margin: "6px 0" }}>
//             {order.addressCity}, {order.addressState} - {order.addressPincode}
//           </p>
//           <p style={{ margin: "6px 0" }}>{order.addressCountry}</p>
//         </div>

//         <div
//           style={{
//             borderTop: "1px solid #eee",
//             paddingTop: 16,
//             marginTop: 16,
//           }}
//         >
//           <h3>Ordered Items</h3>

//           <div style={{ display: "grid", gap: 12 }}>
//             {order.items?.map((item) => (
//               <div
//                 key={item.id}
//                 style={{
//                   display: "flex",
//                   gap: 12,
//                   alignItems: "center",
//                   border: "1px solid #f1f1f1",
//                   borderRadius: 10,
//                   padding: 10,
//                 }}
//               >
//                 <img
//                   src={
//                     item.imageUrl
//                       ? `${process.env.NEXT_PUBLIC_API_BASE}${item.imageUrl}`
//                       : "/placeholder.png"
//                   }
//                   alt={item.productTitle}
//                   width={75}
//                   height={75}
//                   style={{
//                     objectFit: "cover",
//                     borderRadius: 8,
//                     flexShrink: 0,
//                   }}
//                 />

//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontWeight: 600 }}>{item.productTitle}</div>
//                   <small>
//                     Qty: {item.quantity} | Unit: ₹{item.unitPrice} | Total: ₹{item.lineTotal}
//                   </small>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }












import { Suspense } from "react";
import OrderDetailsClient from "./OrderDetailsClient";

export default function OrderDetailsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
      <OrderDetailsClient />
    </Suspense>
  );
}