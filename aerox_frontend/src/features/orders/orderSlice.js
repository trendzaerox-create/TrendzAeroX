





"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchAdminOrdersApi,
  fetchMyOrderByIdApi,
  fetchMyOrdersApi,
  placeOrderApi,
  updateAdminOrderStatusApi,
} from "./orderApi";

export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (payload, thunkAPI) => {
    try {
      return await placeOrderApi(payload);
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e?.response?.data?.message || "Failed to place order"
      );
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
  async (_, thunkAPI) => {
    try {
      return await fetchMyOrdersApi();
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e?.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

export const fetchMyOrderById = createAsyncThunk(
  "orders/fetchMyOrderById",
  async (id, thunkAPI) => {
    try {
      return await fetchMyOrderByIdApi(id);
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e?.response?.data?.message || "Failed to fetch order details"
      );
    }
  }
);

export const fetchAdminOrders = createAsyncThunk(
  "orders/fetchAdminOrders",
  async (_, thunkAPI) => {
    try {
      return await fetchAdminOrdersApi();
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e?.response?.data?.message || "Failed to fetch admin orders"
      );
    }
  }
);

export const updateAdminOrderStatus = createAsyncThunk(
  "orders/updateAdminOrderStatus",
  async (payload, thunkAPI) => {
    try {
      return await updateAdminOrderStatusApi(payload);
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e?.response?.data?.message || "Failed to update order"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    selectedOrder: null,
    adminOrders: [],
    placedOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearPlacedOrder(state) {
      state.placedOrder = null;
    },
    clearSelectedOrder(state) {
      state.selectedOrder = null;
    },
    clearOrderError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.placedOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMyOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedOrder = null;
      })
      .addCase(fetchMyOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchMyOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.adminOrders = action.payload;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateAdminOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.adminOrders = state.adminOrders.map((o) =>
          o.id === action.payload.id ? action.payload : o
        );
      })
      .addCase(updateAdminOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearPlacedOrder,
  clearSelectedOrder,
  clearOrderError,
} = orderSlice.actions;

export default orderSlice.reducer;














