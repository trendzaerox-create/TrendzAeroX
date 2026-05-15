"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  clearSelectedOrder,
  fetchMyOrderById,
} from "@/features/orders/orderSlice";

export default function OrderDetailsClient() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const { token } = useSelector((state) => state.auth);
  const { selectedOrder, loading, error } = useSelector((state) => state.orders);

  const successType = searchParams.get("success");

  useEffect(() => {
    if (!token) {
      router.replace(`/login?next=/account/orders/${params.id}`);
      return;
    }

    if (params?.id) {
      dispatch(fetchMyOrderById(params.id));
    }

    return () => {
      dispatch(clearSelectedOrder());
    };
  }, [dispatch, token, params?.id, router]);

  if (!token) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] px-4 py-8 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-[#e5e5e5] bg-white p-8 shadow-sm">
            <p className="text-base font-semibold text-[#111111]">
              Loading order details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] px-4 py-8 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
            <p className="text-base font-semibold text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedOrder) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] px-4 py-8 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-[#e5e5e5] bg-white p-8 shadow-sm">
            <p className="text-base font-semibold text-[#111111]">
              Order not found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const order = selectedOrder;

  return (
    <div className="min-h-screen bg-[#f5f5f5] px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {successType === "cod" && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700 shadow-sm">
            Your Cash on Delivery order has been placed successfully.
          </div>
        )}

        {successType === "paid" && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700 shadow-sm">
            Payment successful. Your order has been confirmed.
          </div>
        )}

        <div className="mb-6 rounded-[28px] border border-[#e7e7e7] bg-white shadow-sm">
          <div className="flex flex-col gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a7a7a]">
                Order Details
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#111111] md:text-3xl">
                {order.orderNumber}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#4a4a4a]">
                <span className="rounded-full bg-[#f3f3f3] px-3 py-1 font-semibold text-[#111111]">
                  Status: {order.status}
                </span>
                <span className="rounded-full bg-[#f3f3f3] px-3 py-1 font-semibold text-[#111111]">
                  Payment: {order.paymentStatus || "PENDING"}
                </span>
                <span className="rounded-full bg-[#f3f3f3] px-3 py-1 font-semibold text-[#111111]">
                  Method: {order.paymentMethod}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/account/orders")}
                className="inline-flex items-center justify-center rounded-full border border-[#d6d6d6] bg-white px-5 py-3 text-sm font-semibold text-[#111111] transition hover:bg-[#f7f7f7]"
              >
                ← Back to Orders
              </button>

              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Go to Home Page
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-[#e7e7e7] bg-white p-6 shadow-sm md:p-8">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#111111]">Ordered Items</h2>
                <span className="rounded-full bg-[#f4f4f4] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#555555]">
                  {order.items?.length || 0} Items
                </span>
              </div>

              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-[#ededed] bg-[#fcfcfc] p-5"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-[#111111]">
                          {item.productTitle}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2 text-sm text-[#555555]">
                          <span className="rounded-full bg-white px-3 py-1 border border-[#e9e9e9]">
                            Qty: <span className="font-semibold text-[#111111]">{item.quantity}</span>
                          </span>
                        </div>
                      </div>

                      <div className="text-left md:text-right">
                        <p className="text-sm text-[#666666]">Line Total</p>
                        <p className="text-lg font-bold text-[#111111]">
                          ₹{item.lineTotal}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-[#e7e7e7] bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-bold text-[#111111]">Delivery Address</h2>

              <div className="mt-5 rounded-2xl border border-[#ededed] bg-[#fcfcfc] p-5">
                <p className="text-base font-bold text-[#111111]">
                  {order.addressFullName}
                </p>
                <p className="mt-2 text-sm font-medium text-[#444444]">
                  {order.addressPhone}
                </p>
                <p className="mt-1 text-sm font-medium text-[#444444]">
                  {order.addressLine1}
                  {order.addressLine2 ? `, ${order.addressLine2}` : ""}
                </p>
                <p className="mt-1 text-sm font-medium text-[#444444]">
                  {order.addressCity}, {order.addressState} - {order.addressPincode}
                </p>
                <p className="mt-1 text-sm font-medium text-[#444444]">
                  {order.addressCountry}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-[28px] border border-[#e7e7e7] bg-white p-6 shadow-sm md:p-8 lg:sticky lg:top-6">
              <h2 className="text-xl font-bold text-[#111111]">Order Summary</h2>

              {order.createdAt && (
                <div className="mt-4 rounded-2xl bg-[#f8f8f8] px-4 py-3 text-sm font-medium text-[#444444]">
                  Ordered On:{" "}
                  <span className="font-semibold text-[#111111]">
                    {new Date(order.createdAt).toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm font-medium text-[#555555]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#111111]">
                    ₹{order.subtotalAmount}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm font-medium text-[#555555]">
                  <span>Shipping</span>
                  <span className="font-semibold text-[#111111]">
                    ₹{order.shippingAmount}
                  </span>
                </div>

                <div className="border-t border-dashed border-[#dddddd] pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-[#111111]">Total</span>
                    <span className="text-2xl font-bold text-[#111111]">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push("/")}
                className="mt-6 w-full rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}