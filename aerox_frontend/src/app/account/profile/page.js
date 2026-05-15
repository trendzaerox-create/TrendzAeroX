
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadProfile } from "@/features/user/userSlice";
import { logout } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { profile, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(loadProfile());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  if (loading) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <p style={styles.loadingText}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <p style={styles.loadingText}>Profile not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.heading}>My Account</h2>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Profile Information</h3>

          <p style={styles.infoText}>
            <b>Name:</b> {profile.name}
          </p>
          <p style={styles.infoText}>
            <b>Email:</b> {profile.email}
          </p>
          <p style={styles.infoText}>
            <b>Phone:</b> {profile.phone}
          </p>

          <button
            onClick={() => router.push("/account/profile/edit")}
            style={styles.actionBtn}
          >
            Edit Profile
          </button>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Security</h3>

          <button
            onClick={() => router.push("/account/security")}
            style={styles.actionBtn}
          >
            Change Password
          </button>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Orders</h3>

          <button
            onClick={() => router.push("/account/orders")}
            style={styles.actionBtn}
          >
            View Orders
          </button>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Addresses</h3>

          <button
            onClick={() => router.push("/account/profile/addresses")}
            style={styles.actionBtn}
          >
            Manage Addresses
          </button>
        </div>

        <div style={styles.section}>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#000",
    padding: "40px 20px",
  },
  container: {
    maxWidth: 700,
    margin: "0 auto",
    color: "#fff",
  },
  heading: {
    fontSize: "32px",
    fontWeight: 700,
    marginBottom: "24px",
    borderBottom: "1px solid #333",
    paddingBottom: "12px",
  },
  section: {
    borderBottom: "1px solid #333",
    padding: "24px 0",
  },
  sectionTitle: {
    fontSize: "22px",
    marginBottom: "14px",
    color: "#fff",
  },
  infoText: {
    fontSize: "17px",
    color: "#ddd",
    margin: "8px 0",
  },
  actionBtn: {
    marginTop: "12px",
    padding: "10px 16px",
    borderRadius: "10px",
    border: "1px solid #444",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
    fontSize: "15px",
  },
  logoutBtn: {
    marginTop: "10px",
    color: "#fff",
    background: "#d60000",
    border: "1px solid #d60000",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
  },
  loadingText: {
    color: "#fff",
    fontSize: "18px",
  },
};