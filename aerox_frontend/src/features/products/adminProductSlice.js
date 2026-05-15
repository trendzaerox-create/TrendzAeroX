

import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/apiClient";

export const createProduct = createAsyncThunk(
  "admin/createProduct",
  async (productData, { rejectWithValue }) => {
    try {

      const res = await api.post(
        "/api/admin/products",
        productData
      );

      return res.data;

    } catch (err) {

      return rejectWithValue(err.response?.data || "Create failed");

    }
  }
);


export const updateProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ id, data }, { rejectWithValue }) => {

    try {

      const res = await api.put(
        `/api/admin/products/${id}`,
        data
      );

      return res.data;

    } catch (err) {

      return rejectWithValue(err.response?.data || "Update failed");

    }

  }
);


export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (id, { rejectWithValue }) => {

    try {

      await api.delete(`/api/admin/products/${id}`);

      return id;

    } catch (err) {

      return rejectWithValue(err.response?.data || "Delete failed");

    }

  }
);