

// "use client";

// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import cartApi from "./cartApi";
// import {
//   addGuestCartItem,
//   buildMergePayloadFromGuestCart,
//   clearGuestCart,
//   getGuestCart,
//   saveGuestCart
// } from "./cartUtils";
// import { getToken, removeToken } from "@/lib/tokenStorage";

// function hasToken() {
//   if (typeof window === "undefined") return false;
//   return !!getToken();
// }

// function buildGuestCartResponse() {
//   const guestItems = getGuestCart();
//   let subtotal = 0;
//   let totalItems = 0;

//   const items = guestItems.map((item, index) => {
//     const lineTotal = Number(item.unitPrice) * item.quantity;
//     subtotal += lineTotal;
//     totalItems += item.quantity;

//     return {
//       itemId: `guest-${index}`,
//       productId: item.productId,
//       title: item.title,
//       quantity: item.quantity,
//       unitPrice: item.unitPrice,
//       lineTotal,
//       images: item.image ? [item.image] : [],
//       stock: 999
//     };
//   });

//   return {
//     cartId: null,
//     items,
//     subtotal,
//     totalItems
//   };
// }

// export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, thunkAPI) => {
//   try {
//     if (!hasToken()) {
//       return buildGuestCartResponse();
//     }

//     return await cartApi.getCart();
//   } catch (err) {
//     if (err?.response?.status === 401) {
//       removeToken();
//       return buildGuestCartResponse();
//     }

//     return thunkAPI.rejectWithValue(err.response?.data || { message: err.message });
//   }
// });

// export const addToCart = createAsyncThunk("cart/addToCart", async ({ product, quantity = 1 }, thunkAPI) => {
//   try {
//     if (!hasToken()) {
//       addGuestCartItem(product, quantity);
//       return buildGuestCartResponse();
//     }

//     return await cartApi.addToCart({
//       productId: product.id,
//       quantity
//     });
//   } catch (err) {
//     if (err?.response?.status === 401) {
//       removeToken();
//       addGuestCartItem(product, quantity);
//       return buildGuestCartResponse();
//     }

//     return thunkAPI.rejectWithValue(err.response?.data || { message: err.message });
//   }
// });

// export const updateCartItem = createAsyncThunk("cart/updateCartItem", async ({ itemId, quantity }, thunkAPI) => {
//   try {
//     if (!hasToken()) {
//       const guest = getGuestCart();
//       const index = Number(String(itemId).replace("guest-", ""));
//       if (guest[index]) {
//         guest[index].quantity = quantity;
//       }
//       saveGuestCart(guest);
//       return buildGuestCartResponse();
//     }

//     return await cartApi.updateCartItem(itemId, { quantity });
//   } catch (err) {
//     if (err?.response?.status === 401) {
//       removeToken();
//       return buildGuestCartResponse();
//     }

//     return thunkAPI.rejectWithValue(err.response?.data || { message: err.message });
//   }
// });

// export const removeCartItem = createAsyncThunk("cart/removeCartItem", async (itemId, thunkAPI) => {
//   try {
//     if (!hasToken()) {
//       const guest = getGuestCart();
//       const index = Number(String(itemId).replace("guest-", ""));
//       const filtered = guest.filter((_, i) => i !== index);
//       saveGuestCart(filtered);
//       return buildGuestCartResponse();
//     }

//     return await cartApi.removeCartItem(itemId);
//   } catch (err) {
//     if (err?.response?.status === 401) {
//       removeToken();
//       return buildGuestCartResponse();
//     }

//     return thunkAPI.rejectWithValue(err.response?.data || { message: err.message });
//   }
// });

// export const clearCart = createAsyncThunk("cart/clearCart", async (_, thunkAPI) => {
//   try {
//     if (!hasToken()) {
//       clearGuestCart();
//       return buildGuestCartResponse();
//     }

//     return await cartApi.clearCart();
//   } catch (err) {
//     if (err?.response?.status === 401) {
//       removeToken();
//       clearGuestCart();
//       return buildGuestCartResponse();
//     }

//     return thunkAPI.rejectWithValue(err.response?.data || { message: err.message });
//   }
// });

// export const mergeGuestCartAfterLogin = createAsyncThunk("cart/mergeGuestCartAfterLogin", async (_, thunkAPI) => {
//   try {
//     if (!hasToken()) {
//       return buildGuestCartResponse();
//     }

//     const guestItems = getGuestCart();

//     if (!guestItems.length) {
//       return await cartApi.getCart();
//     }

//     const payload = buildMergePayloadFromGuestCart();
//     const merged = await cartApi.mergeCart(payload);
//     clearGuestCart();
//     return merged;
//   } catch (err) {
//     if (err?.response?.status === 401) {
//       removeToken();
//       return buildGuestCartResponse();
//     }

//     return thunkAPI.rejectWithValue(err.response?.data || { message: err.message });
//   }
// });

// const initialState = {
//   cartId: null,
//   items: [],
//   subtotal: 0,
//   totalItems: 0,
//   drawerOpen: false,
//   loading: false,
//   error: null
// };

// function applyCartState(state, action) {
//   state.cartId = action.payload.cartId;
//   state.items = action.payload.items || [];
//   state.subtotal = action.payload.subtotal || 0;
//   state.totalItems = action.payload.totalItems || 0;
//   state.loading = false;
//   state.error = null;
// }

// function applyErrorState(state, action, fallback) {
//   state.loading = false;
//   state.error = action.payload?.message || action.payload?.error || fallback;
// }

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     openCartDrawer(state) {
//       state.drawerOpen = true;
//     },
//     closeCartDrawer(state) {
//       state.drawerOpen = false;
//     },
//     toggleCartDrawer(state) {
//       state.drawerOpen = !state.drawerOpen;
//     },
//     clearCartError(state) {
//       state.error = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCart.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchCart.fulfilled, applyCartState)
//       .addCase(fetchCart.rejected, (state, action) => {
//         applyErrorState(state, action, "Failed to load cart");
//       })

//       .addCase(addToCart.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(addToCart.fulfilled, applyCartState)
//       .addCase(addToCart.rejected, (state, action) => {
//         applyErrorState(state, action, "Failed to add item to cart");
//       })

//       .addCase(updateCartItem.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateCartItem.fulfilled, applyCartState)
//       .addCase(updateCartItem.rejected, (state, action) => {
//         applyErrorState(state, action, "Failed to update cart item");
//       })

//       .addCase(removeCartItem.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(removeCartItem.fulfilled, applyCartState)
//       .addCase(removeCartItem.rejected, (state, action) => {
//         applyErrorState(state, action, "Failed to remove cart item");
//       })

//       .addCase(clearCart.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(clearCart.fulfilled, applyCartState)
//       .addCase(clearCart.rejected, (state, action) => {
//         applyErrorState(state, action, "Failed to clear cart");
//       })

//       .addCase(mergeGuestCartAfterLogin.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(mergeGuestCartAfterLogin.fulfilled, applyCartState)
//       .addCase(mergeGuestCartAfterLogin.rejected, (state, action) => {
//         applyErrorState(state, action, "Failed to merge guest cart");
//       });
//   }
// });

// export const { openCartDrawer, closeCartDrawer, toggleCartDrawer, clearCartError } = cartSlice.actions;
// export default cartSlice.reducer;



















// "use client";

// import {
//   createAsyncThunk,
//   createSlice,
// } from "@reduxjs/toolkit";

// import cartApi from "./cartApi";

// import {
//   addGuestCartItem,
//   buildMergePayloadFromGuestCart,
//   clearGuestCart,
//   getGuestCart,
//   saveGuestCart,
// } from "./cartUtils";

// import {
//   getToken,
//   removeToken,
// } from "@/lib/tokenStorage";

// /* =========================================
//    TOKEN CHECK
// ========================================= */

// function hasValidToken() {
//   if (typeof window === "undefined") {
//     return false;
//   }

//   const token = getToken();

//   if (
//     !token ||
//     token === "undefined" ||
//     token === "null"
//   ) {
//     return false;
//   }

//   return true;
// }

// /* =========================================
//    GUEST CART BUILDER
// ========================================= */

// function buildGuestCartResponse() {
//   const guestItems = getGuestCart();

//   let subtotal = 0;

//   let totalItems = 0;

//   const items = guestItems.map(
//     (item, index) => {
//       const lineTotal =
//         Number(item.unitPrice) *
//         item.quantity;

//       subtotal += lineTotal;

//       totalItems += item.quantity;

//       return {
//         itemId: `guest-${index}`,
//         productId: item.productId,
//         title: item.title,
//         quantity: item.quantity,
//         unitPrice: item.unitPrice,
//         lineTotal,
//         images: item.image
//           ? [item.image]
//           : [],
//         stock: 999,
//       };
//     }
//   );

//   return {
//     cartId: null,
//     items,
//     subtotal,
//     totalItems,
//     isGuest: true,
//   };
// }

// /* =========================================
//    FETCH CART
// ========================================= */

// export const fetchCart =
//   createAsyncThunk(
//     "cart/fetchCart",
//     async (_, thunkAPI) => {
//       try {
//         if (!hasValidToken()) {
//           return buildGuestCartResponse();
//         }

//         return await cartApi.getCart();
//       } catch (err) {
//         removeToken();

//         return buildGuestCartResponse();
//       }
//     }
//   );

// /* =========================================
//    ADD TO CART
// ========================================= */

// export const addToCart =
//   createAsyncThunk(
//     "cart/addToCart",
//     async (
//       { product, quantity = 1 },
//       thunkAPI
//     ) => {
//       try {
//         if (!hasValidToken()) {
//           addGuestCartItem(
//             product,
//             quantity
//           );

//           return buildGuestCartResponse();
//         }

//         return await cartApi.addToCart({
//           productId: product.id,
//           quantity,
//         });
//       } catch (err) {
//         removeToken();

//         addGuestCartItem(
//           product,
//           quantity
//         );

//         return buildGuestCartResponse();
//       }
//     }
//   );

// /* =========================================
//    UPDATE CART ITEM
// ========================================= */

// export const updateCartItem =
//   createAsyncThunk(
//     "cart/updateCartItem",
//     async (
//       { itemId, quantity },
//       thunkAPI
//     ) => {
//       try {
//         if (!hasValidToken()) {
//           const guest =
//             getGuestCart();

//           const index = Number(
//             String(itemId).replace(
//               "guest-",
//               ""
//             )
//           );

//           if (guest[index]) {
//             guest[index].quantity =
//               quantity;
//           }

//           saveGuestCart(guest);

//           return buildGuestCartResponse();
//         }

//         return await cartApi.updateCartItem(
//           itemId,
//           {
//             quantity,
//           }
//         );
//       } catch (err) {
//         removeToken();

//         return buildGuestCartResponse();
//       }
//     }
//   );

// /* =========================================
//    REMOVE CART ITEM
// ========================================= */

// export const removeCartItem =
//   createAsyncThunk(
//     "cart/removeCartItem",
//     async (itemId, thunkAPI) => {
//       try {
//         if (!hasValidToken()) {
//           const guest =
//             getGuestCart();

//           const index = Number(
//             String(itemId).replace(
//               "guest-",
//               ""
//             )
//           );

//           const filtered =
//             guest.filter(
//               (_, i) => i !== index
//             );

//           saveGuestCart(filtered);

//           return buildGuestCartResponse();
//         }

//         return await cartApi.removeCartItem(
//           itemId
//         );
//       } catch (err) {
//         removeToken();

//         return buildGuestCartResponse();
//       }
//     }
//   );

// /* =========================================
//    CLEAR CART
// ========================================= */

// export const clearCart =
//   createAsyncThunk(
//     "cart/clearCart",
//     async (_, thunkAPI) => {
//       try {
//         if (!hasValidToken()) {
//           clearGuestCart();

//           return buildGuestCartResponse();
//         }

//         return await cartApi.clearCart();
//       } catch (err) {
//         removeToken();

//         clearGuestCart();

//         return buildGuestCartResponse();
//       }
//     }
//   );

// /* =========================================
//    MERGE GUEST CART AFTER LOGIN
// ========================================= */

// export const mergeGuestCartAfterLogin =
//   createAsyncThunk(
//     "cart/mergeGuestCartAfterLogin",
//     async (_, thunkAPI) => {
//       try {
//         if (!hasValidToken()) {
//           return buildGuestCartResponse();
//         }

//         const guestItems =
//           getGuestCart();

//         if (!guestItems.length) {
//           return await cartApi.getCart();
//         }

//         const payload =
//           buildMergePayloadFromGuestCart();

//         const merged =
//           await cartApi.mergeCart(
//             payload
//           );

//         clearGuestCart();

//         return merged;
//       } catch (err) {
//         removeToken();

//         return buildGuestCartResponse();
//       }
//     }
//   );

// /* =========================================
//    INITIAL STATE
// ========================================= */

// const initialState = {
//   cartId: null,
//   items: [],
//   subtotal: 0,
//   totalItems: 0,
//   drawerOpen: false,
//   loading: false,
//   error: null,
// };

// /* =========================================
//    HELPERS
// ========================================= */

// function applyCartState(
//   state,
//   action
// ) {
//   state.cartId =
//     action.payload.cartId;

//   state.items =
//     action.payload.items || [];

//   state.subtotal =
//     action.payload.subtotal || 0;

//   state.totalItems =
//     action.payload.totalItems || 0;

//   state.loading = false;

//   state.error = null;
// }

// function applyPendingState(
//   state
// ) {
//   state.loading = true;

//   state.error = null;
// }

// function applyErrorState(
//   state,
//   action,
//   fallback
// ) {
//   state.loading = false;

//   state.error =
//     action.payload?.message ||
//     fallback;
// }

// /* =========================================
//    SLICE
// ========================================= */

// const cartSlice = createSlice({
//   name: "cart",

//   initialState,

//   reducers: {
//     openCartDrawer(state) {
//       state.drawerOpen = true;
//     },

//     closeCartDrawer(state) {
//       state.drawerOpen = false;
//     },

//     toggleCartDrawer(state) {
//       state.drawerOpen =
//         !state.drawerOpen;
//     },

//     clearCartError(state) {
//       state.error = null;
//     },
//   },

//   extraReducers: (builder) => {
//     builder

//       /* ===============================
//          FULFILLED
//       ============================== */

//       .addCase(
//         fetchCart.fulfilled,
//         applyCartState
//       )

//       .addCase(
//         addToCart.fulfilled,
//         applyCartState
//       )

//       .addCase(
//         updateCartItem.fulfilled,
//         applyCartState
//       )

//       .addCase(
//         removeCartItem.fulfilled,
//         applyCartState
//       )

//       .addCase(
//         clearCart.fulfilled,
//         applyCartState
//       )

//       .addCase(
//         mergeGuestCartAfterLogin.fulfilled,
//         applyCartState
//       )

//       /* ===============================
//          PENDING
//       ============================== */

//       .addCase(
//         fetchCart.pending,
//         applyPendingState
//       )

//       .addCase(
//         addToCart.pending,
//         applyPendingState
//       )

//       .addCase(
//         updateCartItem.pending,
//         applyPendingState
//       )

//       .addCase(
//         removeCartItem.pending,
//         applyPendingState
//       )

//       .addCase(
//         clearCart.pending,
//         applyPendingState
//       )

//       .addCase(
//         mergeGuestCartAfterLogin.pending,
//         applyPendingState
//       )

//       /* ===============================
//          REJECTED
//       ============================== */

//       .addCase(
//         fetchCart.rejected,
//         (state, action) => {
//           applyErrorState(
//             state,
//             action,
//             "Fetch cart failed"
//           );
//         }
//       )

//       .addCase(
//         addToCart.rejected,
//         (state, action) => {
//           applyErrorState(
//             state,
//             action,
//             "Add to cart failed"
//           );
//         }
//       )

//       .addCase(
//         updateCartItem.rejected,
//         (state, action) => {
//           applyErrorState(
//             state,
//             action,
//             "Update cart failed"
//           );
//         }
//       )

//       .addCase(
//         removeCartItem.rejected,
//         (state, action) => {
//           applyErrorState(
//             state,
//             action,
//             "Remove cart item failed"
//           );
//         }
//       )

//       .addCase(
//         clearCart.rejected,
//         (state, action) => {
//           applyErrorState(
//             state,
//             action,
//             "Clear cart failed"
//           );
//         }
//       )

//       .addCase(
//         mergeGuestCartAfterLogin.rejected,
//         (
//           state,
//           action
//         ) => {
//           applyErrorState(
//             state,
//             action,
//             "Merge cart failed"
//           );
//         }
//       );
//   },
// });

// export const {
//   openCartDrawer,
//   closeCartDrawer,
//   toggleCartDrawer,
//   clearCartError,
// } = cartSlice.actions;

// export default cartSlice.reducer;

























// src/features/cart/cartSlice.js

"use client";

import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import cartApi from "./cartApi";

import {
  addGuestCartItem,
  buildMergePayloadFromGuestCart,
  clearGuestCart,
  getGuestCart,
  saveGuestCart,
} from "./cartUtils";

import {
  getToken,
  removeToken,
} from "@/lib/tokenStorage";

/* =========================================
   TOKEN CHECK
========================================= */

function hasValidToken() {
  if (typeof window === "undefined") {
    return false;
  }

  const token = getToken();

  if (
    !token ||
    token === "undefined" ||
    token === "null"
  ) {
    return false;
  }

  return true;
}

/* =========================================
   GUEST CART RESPONSE
========================================= */

function buildGuestCartResponse() {
  const guestItems = getGuestCart();

  let subtotal = 0;
  let totalItems = 0;

  const items = guestItems.map(
    (item, index) => {
      const unitPrice = Number(
        item.unitPrice || 0
      );

      const quantity = Number(
        item.quantity || 1
      );

      const lineTotal =
        unitPrice * quantity;

      subtotal += lineTotal;

      totalItems += quantity;

      return {
        itemId: `guest-${index}`,
        productId: item.productId,
        title: item.title || "",
        quantity,
        unitPrice,
        lineTotal,
        images: item.image
          ? [item.image]
          : [],
        stock: 999,
      };
    }
  );

  return {
    cartId: null,
    items,
    subtotal,
    totalItems,
    isGuest: true,
  };
}

/* =========================================
   FETCH CART
========================================= */

export const fetchCart =
  createAsyncThunk(
    "cart/fetchCart",
    async (_, thunkAPI) => {
      try {
        if (
          thunkAPI.signal.aborted
        ) {
          return;
        }

        if (!hasValidToken()) {
          return buildGuestCartResponse();
        }

        return await cartApi.getCart();
      } catch (err) {
        if (
          err?.response?.status === 401
        ) {
          removeToken();

          return buildGuestCartResponse();
        }

        return thunkAPI.rejectWithValue(
          err?.response?.data || {
            message:
              err.message,
          }
        );
      }
    }
  );

/* =========================================
   ADD TO CART
========================================= */

export const addToCart =
  createAsyncThunk(
    "cart/addToCart",
    async (
      { product, quantity = 1 },
      thunkAPI
    ) => {
      try {
        if (
          thunkAPI.signal.aborted
        ) {
          return;
        }

        quantity = Math.max(
          1,
          quantity
        );

        if (!hasValidToken()) {
          addGuestCartItem(
            product,
            quantity
          );

          return buildGuestCartResponse();
        }

        return await cartApi.addToCart({
          productId:
            product.id,
          quantity,
        });
      } catch (err) {
        if (
          err?.response?.status === 401
        ) {
          removeToken();

          addGuestCartItem(
            product,
            quantity
          );

          return buildGuestCartResponse();
        }

        return thunkAPI.rejectWithValue(
          err?.response?.data || {
            message:
              err.message,
          }
        );
      }
    }
  );

/* =========================================
   UPDATE CART ITEM
========================================= */

export const updateCartItem =
  createAsyncThunk(
    "cart/updateCartItem",
    async (
      { itemId, quantity },
      thunkAPI
    ) => {
      try {
        if (
          thunkAPI.signal.aborted
        ) {
          return;
        }

        quantity = Math.max(
          1,
          quantity
        );

        if (!hasValidToken()) {
          const guest =
            getGuestCart();

          const index = Number(
            String(itemId).replace(
              "guest-",
              ""
            )
          );

          if (guest[index]) {
            guest[index].quantity =
              quantity;
          }

          saveGuestCart(
            guest
          );

          return buildGuestCartResponse();
        }

        return await cartApi.updateCartItem(
          itemId,
          {
            quantity,
          }
        );
      } catch (err) {
        if (
          err?.response?.status === 401
        ) {
          removeToken();

          return buildGuestCartResponse();
        }

        return thunkAPI.rejectWithValue(
          err?.response?.data || {
            message:
              err.message,
          }
        );
      }
    }
  );

/* =========================================
   REMOVE CART ITEM
========================================= */

export const removeCartItem =
  createAsyncThunk(
    "cart/removeCartItem",
    async (
      itemId,
      thunkAPI
    ) => {
      try {
        if (
          thunkAPI.signal.aborted
        ) {
          return;
        }

        if (!hasValidToken()) {
          const guest =
            getGuestCart();

          const index = Number(
            String(itemId).replace(
              "guest-",
              ""
            )
          );

          const filtered =
            guest.filter(
              (_, i) =>
                i !== index
            );

          saveGuestCart(
            filtered
          );

          return buildGuestCartResponse();
        }

        return await cartApi.removeCartItem(
          itemId
        );
      } catch (err) {
        if (
          err?.response?.status === 401
        ) {
          removeToken();

          return buildGuestCartResponse();
        }

        return thunkAPI.rejectWithValue(
          err?.response?.data || {
            message:
              err.message,
          }
        );
      }
    }
  );

/* =========================================
   CLEAR CART
========================================= */

export const clearCart =
  createAsyncThunk(
    "cart/clearCart",
    async (_, thunkAPI) => {
      try {
        if (
          thunkAPI.signal.aborted
        ) {
          return;
        }

        if (!hasValidToken()) {
          clearGuestCart();

          return buildGuestCartResponse();
        }

        return await cartApi.clearCart();
      } catch (err) {
        if (
          err?.response?.status === 401
        ) {
          removeToken();

          clearGuestCart();

          return buildGuestCartResponse();
        }

        return thunkAPI.rejectWithValue(
          err?.response?.data || {
            message:
              err.message,
          }
        );
      }
    }
  );

/* =========================================
   MERGE GUEST CART
========================================= */

export const mergeGuestCartAfterLogin =
  createAsyncThunk(
    "cart/mergeGuestCartAfterLogin",
    async (_, thunkAPI) => {
      try {
        if (
          thunkAPI.signal.aborted
        ) {
          return;
        }

        if (!hasValidToken()) {
          return buildGuestCartResponse();
        }

        const guestItems =
          getGuestCart();

        if (
          !guestItems.length
        ) {
          return await cartApi.getCart();
        }

        const payload =
          buildMergePayloadFromGuestCart();

        const merged =
          await cartApi.mergeCart(
            payload
          );

        clearGuestCart();

        return merged;
      } catch (err) {
        if (
          err?.response?.status === 401
        ) {
          removeToken();

          return buildGuestCartResponse();
        }

        return thunkAPI.rejectWithValue(
          err?.response?.data || {
            message:
              err.message,
          }
        );
      }
    }
  );

/* =========================================
   INITIAL STATE
========================================= */

const initialState = {
  cartId: null,
  items: [],
  subtotal: 0,
  totalItems: 0,
  drawerOpen: false,
  loading: false,
  initialized: false,
  error: null,
};

/* =========================================
   HELPERS
========================================= */

function applyCartState(
  state,
  action
) {
  const payload =
    action.payload || {};

  state.cartId =
    payload.cartId || null;

  state.items =
    payload.items || [];

  state.subtotal =
    payload.subtotal || 0;

  state.totalItems =
    payload.totalItems || 0;

  state.loading = false;

  state.initialized = true;

  state.error = null;
}

function applyPendingState(
  state
) {
  state.loading = true;

  state.error = null;
}

function applyErrorState(
  state,
  action,
  fallback
) {
  state.loading = false;

  state.initialized = true;

  state.error =
    action.payload?.message ||
    action.payload?.error ||
    fallback;
}

/* =========================================
   SLICE
========================================= */

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    openCartDrawer(
      state
    ) {
      state.drawerOpen = true;
    },

    closeCartDrawer(
      state
    ) {
      state.drawerOpen = false;
    },

    toggleCartDrawer(
      state
    ) {
      state.drawerOpen =
        !state.drawerOpen;
    },

    clearCartError(
      state
    ) {
      state.error = null;
    },
  },

  extraReducers: (
    builder
  ) => {
    builder

      /* ===============================
         FETCH CART
      ============================== */

      .addCase(
        fetchCart.pending,
        applyPendingState
      )

      .addCase(
        fetchCart.fulfilled,
        applyCartState
      )

      .addCase(
        fetchCart.rejected,
        (
          state,
          action
        ) => {
          applyErrorState(
            state,
            action,
            "Fetch cart failed"
          );
        }
      )

      /* ===============================
         ADD TO CART
      ============================== */

      .addCase(
        addToCart.pending,
        applyPendingState
      )

      .addCase(
        addToCart.fulfilled,
        applyCartState
      )

      .addCase(
        addToCart.rejected,
        (
          state,
          action
        ) => {
          applyErrorState(
            state,
            action,
            "Add to cart failed"
          );
        }
      )

      /* ===============================
         UPDATE CART
      ============================== */

      .addCase(
        updateCartItem.pending,
        applyPendingState
      )

      .addCase(
        updateCartItem.fulfilled,
        applyCartState
      )

      .addCase(
        updateCartItem.rejected,
        (
          state,
          action
        ) => {
          applyErrorState(
            state,
            action,
            "Update cart failed"
          );
        }
      )

      /* ===============================
         REMOVE CART ITEM
      ============================== */

      .addCase(
        removeCartItem.pending,
        applyPendingState
      )

      .addCase(
        removeCartItem.fulfilled,
        applyCartState
      )

      .addCase(
        removeCartItem.rejected,
        (
          state,
          action
        ) => {
          applyErrorState(
            state,
            action,
            "Remove cart item failed"
          );
        }
      )

      /* ===============================
         CLEAR CART
      ============================== */

      .addCase(
        clearCart.pending,
        applyPendingState
      )

      .addCase(
        clearCart.fulfilled,
        applyCartState
      )

      .addCase(
        clearCart.rejected,
        (
          state,
          action
        ) => {
          applyErrorState(
            state,
            action,
            "Clear cart failed"
          );
        }
      )

      /* ===============================
         MERGE GUEST CART
      ============================== */

      .addCase(
        mergeGuestCartAfterLogin.pending,
        applyPendingState
      )

      .addCase(
        mergeGuestCartAfterLogin.fulfilled,
        applyCartState
      )

      .addCase(
        mergeGuestCartAfterLogin.rejected,
        (
          state,
          action
        ) => {
          applyErrorState(
            state,
            action,
            "Merge cart failed"
          );
        }
      );
  },
});

export const {
  openCartDrawer,
  closeCartDrawer,
  toggleCartDrawer,
  clearCartError,
} = cartSlice.actions;

export default cartSlice.reducer;