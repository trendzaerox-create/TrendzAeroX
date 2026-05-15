"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminOrders,
  updateAdminOrderStatus,
} from "@/features/orders/orderSlice";

const statuses = [
  "PLACED",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrdersPage() {
  const dispatch = useDispatch();
  const { adminOrders } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const pageStyle = {
    minHeight: "100%",
    padding: "clamp(14px, 2vw, 24px)",
    background:
      "linear-gradient(180deg, #f8f8f8 0%, #f3f4f6 45%, #efefef 100%)",
  };

  const headerWrapStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
  };

  const headingStyle = {
    margin: 0,
    fontSize: "clamp(22px, 3vw, 34px)",
    fontWeight: 700,
    color: "#111827",
    letterSpacing: "-0.03em",
  };

  const subTextStyle = {
    margin: "6px 0 0",
    color: "#6b7280",
    fontSize: "clamp(13px, 1.5vw, 15px)",
  };

  const ordersGridStyle = {
    display: "grid",
    gap: "18px",
  };

  const cardStyle = {
    position: "relative",
    overflow: "hidden",
    borderRadius: "20px",
    padding: "clamp(16px, 2vw, 22px)",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(249,250,251,0.96) 100%)",
    border: "1px solid rgba(17,24,39,0.08)",
    boxShadow:
      "0 10px 30px rgba(17,24,39,0.06), 0 2px 10px rgba(17,24,39,0.04)",
    transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
  };

  const topBarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "14px",
  };

  const orderNumberStyle = {
    margin: 0,
    fontSize: "clamp(17px, 2vw, 22px)",
    fontWeight: 700,
    color: "#111827",
    wordBreak: "break-word",
  };

  const statusBadgeStyle = (status) => {
    const isDelivered = status === "DELIVERED";
    const isCancelled = status === "CANCELLED";
    const isShipped = status === "SHIPPED";
    const isPacked = status === "PACKED";
    const isConfirmed = status === "CONFIRMED";

    let bg = "rgba(17,24,39,0.08)";
    let color = "#111827";
    let border = "rgba(17,24,39,0.12)";

    if (isDelivered) {
      bg = "rgba(16,185,129,0.12)";
      color = "#047857";
      border = "rgba(16,185,129,0.22)";
    } else if (isCancelled) {
      bg = "rgba(239,68,68,0.12)";
      color = "#b91c1c";
      border = "rgba(239,68,68,0.22)";
    } else if (isShipped) {
      bg = "rgba(59,130,246,0.12)";
      color = "#1d4ed8";
      border = "rgba(59,130,246,0.22)";
    } else if (isPacked) {
      bg = "rgba(168,85,247,0.12)";
      color = "#7c3aed";
      border = "rgba(168,85,247,0.22)";
    } else if (isConfirmed) {
      bg = "rgba(245,158,11,0.12)";
      color = "#b45309";
      border = "rgba(245,158,11,0.22)";
    }

    return {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "36px",
      padding: "8px 14px",
      borderRadius: "999px",
      background: bg,
      color,
      border: `1px solid ${border}`,
      fontSize: "12px",
      fontWeight: 700,
      letterSpacing: "0.04em",
      whiteSpace: "nowrap",
    };
  };

  const infoGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
    marginBottom: "16px",
  };

  const infoCardStyle = {
    borderRadius: "16px",
    padding: "14px",
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(17,24,39,0.06)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
    minWidth: 0,
  };

  const infoLabelStyle = {
    margin: "0 0 6px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "#6b7280",
  };

  const infoValueStyle = {
    margin: 0,
    fontSize: "15px",
    fontWeight: 600,
    color: "#111827",
    wordBreak: "break-word",
  };

  const addressBoxStyle = {
    borderRadius: "16px",
    padding: "14px",
    background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
    border: "1px solid rgba(17,24,39,0.06)",
    color: "#374151",
    lineHeight: 1.65,
    fontSize: "14px",
    marginBottom: "16px",
    wordBreak: "break-word",
  };

  const actionsWrapStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  };

  const getButtonStyle = (currentStatus, buttonStatus) => {
    const active = currentStatus === buttonStatus;

    return {
      border: active
        ? "1px solid rgba(17,24,39,0.18)"
        : "1px solid rgba(17,24,39,0.08)",
      background: active
        ? "linear-gradient(135deg, #111827 0%, #1f2937 100%)"
        : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      color: active ? "#ffffff" : "#111827",
      borderRadius: "12px",
      padding: "10px 14px",
      minHeight: "42px",
      fontSize: "12px",
      fontWeight: 700,
      letterSpacing: "0.04em",
      cursor: "pointer",
      transition:
        "transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease, color 0.22s ease",
      boxShadow: active
        ? "0 10px 20px rgba(17,24,39,0.14)"
        : "0 4px 12px rgba(17,24,39,0.05)",
      whiteSpace: "nowrap",
      flex: "0 1 auto",
    };
  };

  const emptyStateStyle = {
    borderRadius: "20px",
    padding: "30px 20px",
    textAlign: "center",
    background: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(17,24,39,0.08)",
    color: "#6b7280",
    boxShadow: "0 10px 30px rgba(17,24,39,0.05)",
  };

  return (
    <div style={pageStyle}>
      <style jsx>{`
        .orders-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 40px rgba(17, 24, 39, 0.1),
            0 4px 16px rgba(17, 24, 39, 0.06);
          border-color: rgba(17, 24, 39, 0.12);
        }

        .status-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(17, 24, 39, 0.12);
        }

        .status-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .orders-topbar {
            flex-direction: column;
            align-items: flex-start;
          }

          .orders-actions {
            gap: 8px;
          }

          .status-btn {
            flex: 1 1 calc(50% - 8px);
            justify-content: center;
            text-align: center;
          }
        }

        @media (max-width: 520px) {
          .status-btn {
            flex: 1 1 100%;
            width: 100%;
          }
        }
      `}</style>

      <div style={headerWrapStyle}>
        <div>
          <h1 style={headingStyle}>Admin Orders</h1>
          <p style={subTextStyle}>
            Manage order flow with a clean, responsive, professional layout.
          </p>
        </div>
      </div>

      {adminOrders?.length > 0 ? (
        <div style={ordersGridStyle}>
          {adminOrders.map((order) => (
            <div key={order.id} className="orders-card" style={cardStyle}>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background:
                    "linear-gradient(90deg, #111827 0%, #4b5563 50%, #d1d5db 100%)",
                }}
              />

              <div className="orders-topbar" style={topBarStyle}>
                <div style={{ minWidth: 0 }}>
                  <h3 style={orderNumberStyle}>{order.orderNumber}</h3>
                </div>

                <div style={statusBadgeStyle(order.status)}>{order.status}</div>
              </div>

              <div style={infoGridStyle}>
                <div style={infoCardStyle}>
                  <p style={infoLabelStyle}>PAYMENT METHOD</p>
                  <p style={infoValueStyle}>{order.paymentMethod || "—"}</p>
                </div>

                <div style={infoCardStyle}>
                  <p style={infoLabelStyle}>TOTAL AMOUNT</p>
                  <p style={infoValueStyle}>₹{order.totalAmount}</p>
                </div>
              </div>

              <div style={addressBoxStyle}>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "#6b7280",
                    marginBottom: "8px",
                  }}
                >
                  DELIVERY ADDRESS
                </div>
                <strong style={{ color: "#111827" }}>
                  {order.addressFullName}
                </strong>
                {order.addressPhone ? `, ${order.addressPhone}` : ""}
                <br />
                {order.addressLine1}, {order.addressCity}, {order.addressState} -{" "}
                {order.addressPincode}
              </div>

              <div className="orders-actions" style={actionsWrapStyle}>
                {statuses.map((status) => (
                  <button
                    key={status}
                    className="status-btn"
                    style={getButtonStyle(order.status, status)}
                    onClick={() =>
                      dispatch(updateAdminOrderStatus({ id: order.id, status }))
                    }
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={emptyStateStyle}>
          <h3
            style={{
              margin: "0 0 8px",
              fontSize: "20px",
              color: "#111827",
            }}
          >
            No orders found
          </h3>
          <p style={{ margin: 0, fontSize: "14px" }}>
            Orders will appear here once customers start placing them.
          </p>
        </div>
      )}
    </div>
  );
}