"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";

function formatMoney(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusText(value) {
  if (!value) return "—";

  return String(value).replaceAll("_", " ");
}

async function apiFetch(path, token, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message =
      typeof data === "string"
        ? data
        : data?.message || data?.error || "Request failed";

    throw new Error(message);
  }

  return data;
}

export default function ShiprocketCreateClient({ orderId }) {
  const router = useRouter();

  const { token } = useSelector((state) => state.auth);

  const [order, setOrder] = useState(null);
  const [shiprocketOrder, setShiprocketOrder] = useState(null);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    pickupLocation:
      process.env.NEXT_PUBLIC_SHIPROCKET_PICKUP_LOCATION || "",
    lengthCm: "10",
    breadthCm: "10",
    heightCm: "5",
    weightKg: "0.50",
    assignAwb: true,
    courierId: "",
    generatePickup: false,
  });

  const canCreate = useMemo(() => {
    if (!order) return false;

    if (String(order.status || "").toUpperCase() === "CANCELLED") {
      return false;
    }

    if (
      String(order.paymentMethod || "").toUpperCase() === "ONLINE" &&
      String(order.paymentStatus || "").toUpperCase() !== "PAID"
    ) {
      return false;
    }

    return true;
  }, [order]);

  useEffect(() => {
    if (!token) {
      router.replace(`/login?next=/admin/orders/${orderId}/shiprocket`);
      return;
    }

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, orderId]);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const orderData = await apiFetch(`/api/admin/orders/${orderId}`, token);

      setOrder(orderData);

      const shipmentData = await apiFetch(
        `/api/admin/shiprocket/orders/${orderId}`,
        token
      );

      setShiprocketOrder(shipmentData);
    } catch (err) {
      setError(err.message || "Failed to load Shiprocket details");
    } finally {
      setLoading(false);
    }
  }

  function updateField(name, value) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function createShiprocketOrder() {
    try {
      setCreating(true);
      setError("");
      setSuccess("");

      const payload = {
        pickupLocation: form.pickupLocation || null,
        lengthCm: Number(form.lengthCm || 0),
        breadthCm: Number(form.breadthCm || 0),
        heightCm: Number(form.heightCm || 0),
        weightKg: Number(form.weightKg || 0),
        assignAwb: Boolean(form.assignAwb),
        courierId: form.courierId ? Number(form.courierId) : null,
        generatePickup: Boolean(form.generatePickup),
      };

      const result = await apiFetch(
        `/api/admin/shiprocket/orders/${orderId}/create`,
        token,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      setShiprocketOrder(result);
      setSuccess(
        result?.awbCode
          ? "Shiprocket shipment created and AWB assigned."
          : "Shiprocket order created. AWB is not assigned yet."
      );

      const orderData = await apiFetch(`/api/admin/orders/${orderId}`, token);
      setOrder(orderData);
    } catch (err) {
      setError(err.message || "Shiprocket shipment creation failed");
    } finally {
      setCreating(false);
    }
  }

  if (!token) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] px-4 py-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-sm">
          Loading Shiprocket shipment...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-[28px] border border-[#e7e7e7] bg-white p-6 shadow-sm md:p-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-5 rounded-full border border-[#d8d8d8] px-4 py-2 text-sm font-semibold text-[#111111] hover:bg-[#f7f7f7]"
          >
            ← Back
          </button>

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#777777]">
            Admin Shipment
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#111111] md:text-3xl">
            Create Shiprocket Shipment
          </h1>

          <p className="mt-2 text-sm text-[#666666]">
            This creates the order in Shiprocket and, if enabled, assigns AWB.
            After AWB is assigned, your existing customer tracking block will
            show courier and tracking ID.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
            {success}
          </div>
        )}

        {order && (
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="space-y-6">
              <div className="rounded-[28px] border border-[#e7e7e7] bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-xl font-bold text-[#111111]">
                  Website Order
                </h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Info label="Order Number" value={order.orderNumber} />
                  <Info label="Status" value={statusText(order.status)} />
                  <Info
                    label="Payment"
                    value={`${statusText(order.paymentMethod)} / ${statusText(
                      order.paymentStatus
                    )}`}
                  />
                  <Info label="Total" value={formatMoney(order.totalAmount)} />
                  <Info label="Created" value={formatDate(order.createdAt)} />
                  <Info
                    label="Customer"
                    value={`${order.addressFullName || "—"} · ${
                      order.addressPhone || "—"
                    }`}
                  />
                </div>

                <div className="mt-5 rounded-2xl bg-[#fafafa] p-4 text-sm leading-6 text-[#555555]">
                  <b>Delivery:</b> {order.addressLine1}
                  {order.addressLine2 ? `, ${order.addressLine2}` : ""},{" "}
                  {order.addressCity}, {order.addressState} -{" "}
                  {order.addressPincode}
                </div>
              </div>

              <div className="rounded-[28px] border border-[#e7e7e7] bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-xl font-bold text-[#111111]">
                  Package Details
                </h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Pickup Location"
                    value={form.pickupLocation}
                    onChange={(value) => updateField("pickupLocation", value)}
                    placeholder="Same as Shiprocket dashboard"
                  />

                  <Field
                    label="Weight KG"
                    value={form.weightKg}
                    onChange={(value) => updateField("weightKg", value)}
                    type="number"
                    step="0.01"
                  />

                  <Field
                    label="Length CM"
                    value={form.lengthCm}
                    onChange={(value) => updateField("lengthCm", value)}
                    type="number"
                    step="0.01"
                  />

                  <Field
                    label="Breadth CM"
                    value={form.breadthCm}
                    onChange={(value) => updateField("breadthCm", value)}
                    type="number"
                    step="0.01"
                  />

                  <Field
                    label="Height CM"
                    value={form.heightCm}
                    onChange={(value) => updateField("heightCm", value)}
                    type="number"
                    step="0.01"
                  />

                  <Field
                    label="Courier ID optional"
                    value={form.courierId}
                    onChange={(value) => updateField("courierId", value)}
                    type="number"
                    placeholder="Blank = auto assign"
                  />
                </div>

                <div className="mt-5 space-y-3">
                  <label className="flex items-center gap-3 rounded-2xl border border-[#ececec] bg-[#fafafa] p-4 text-sm font-semibold text-[#111111]">
                    <input
                      type="checkbox"
                      checked={form.assignAwb}
                      onChange={(event) =>
                        updateField("assignAwb", event.target.checked)
                      }
                    />
                    Assign AWB immediately
                  </label>

                  <label className="flex items-center gap-3 rounded-2xl border border-[#ececec] bg-[#fafafa] p-4 text-sm font-semibold text-[#111111]">
                    <input
                      type="checkbox"
                      checked={form.generatePickup}
                      onChange={(event) =>
                        updateField("generatePickup", event.target.checked)
                      }
                    />
                    Generate pickup immediately
                  </label>
                </div>

                {!canCreate && (
                  <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-700">
                    This order cannot be shipped yet. Cancelled orders are
                    blocked, and online orders must be PAID before shipment.
                  </div>
                )}

                <button
                  type="button"
                  onClick={createShiprocketOrder}
                  disabled={!canCreate || creating}
                  className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create / Continue Shiprocket"}
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[28px] border border-[#e7e7e7] bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-xl font-bold text-[#111111]">
                  Shiprocket Result
                </h2>

                {shiprocketOrder ? (
                  <div className="mt-5 space-y-4">
                    <Info
                      label="Shiprocket Order ID"
                      value={shiprocketOrder.shiprocketOrderId || "—"}
                    />
                    <Info
                      label="Shipment ID"
                      value={shiprocketOrder.shiprocketShipmentId || "—"}
                    />
                    <Info label="AWB" value={shiprocketOrder.awbCode || "—"} />
                    <Info
                      label="Courier"
                      value={shiprocketOrder.courierName || "—"}
                    />
                    <Info
                      label="Status"
                      value={statusText(shiprocketOrder.status)}
                    />

                    {shiprocketOrder.trackingUrl && (
                      <a
                        href={shiprocketOrder.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white transition hover:opacity-90"
                      >
                        Open Tracking
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-[#666666]">
                    Shiprocket has not been created for this order yet.
                  </p>
                )}
              </div>

              {order.shipment && (
                <div className="rounded-[28px] border border-blue-200 bg-white p-6 shadow-sm md:p-8">
                  <h2 className="text-xl font-bold text-[#111111]">
                    Customer Tracking
                  </h2>

                  <div className="mt-5 space-y-4">
                    <Info
                      label="Courier"
                      value={order.shipment.courierName || "—"}
                    />
                    <Info
                      label="Tracking ID / AWB"
                      value={order.shipment.trackingId || "—"}
                    />
                    <Info
                      label="Shipped At"
                      value={formatDate(order.shipment.shippedAt)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#ededed] bg-[#fafafa] p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-[#777777]">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-bold text-[#111111]">
        {value}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  step,
  placeholder,
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wide text-[#777777]">
        {label}
      </span>

      <input
        type={type}
        step={step}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-2xl border border-[#dcdcdc] bg-white px-4 text-sm font-semibold text-[#111111] outline-none transition focus:border-black"
      />
    </label>
  );
}
