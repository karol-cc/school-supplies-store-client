import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:4002/orders";

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { getState }) => {
    const token = getState().user.token;
    const { data } = await axios.get(BASE_URL, {
      headers: authHeaders(token),
    });
    return data;
  }
);

export const fetchGetMyOrders = createAsyncThunk(
  "orders/fetchGetMyOrders",
  async (_, { getState }) => {
    const token = getState().user.token;
    const { data } = await axios.get(`${BASE_URL}/my-orders`, {
      headers: authHeaders(token),
    });
    return data;
  }
);

export const fetchGetActive = createAsyncThunk(
  "orders/fetchGetActive",
  async (_, { getState }) => {
    const token = getState().user.token;
    const { data } = await axios.get(`${BASE_URL}/active`, {
      headers: authHeaders(token),
    });
    return data;
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async ({ id }, { getState }) => {
    const token = getState().user.token;
    const { data } = await axios.get(`${BASE_URL}/id/${id}`, {
      headers: authHeaders(token),
    });
    return data;
  }
);

export const fetchOrderByIdForUser = createAsyncThunk(
  "orders/fetchOrderByIdForUser",
  async ({ id }, { getState }) => {
    const token = getState().user.token;
    const { data } = await axios.get(`${BASE_URL}/user/id/${id}`, {
      headers: authHeaders(token),
    });
    return data;
  }
);

export const fetchCompletedOrderForAdmin = createAsyncThunk(
  "orders/fetchCompletedOrdersByAdmin",
  async ({ user_Id }, { getState }) => {
    const token = getState().user.token;

    const { data } = await axios.get(
      `${BASE_URL}/users/${user_Id}/completed-orders`,
      {
        headers: authHeaders(token),
      }
    );
    return data;
  }
);

export const createOrders = createAsyncThunk(
  "orders/createOrders",
  async ({ newOrder }, { getState }) => {
    const token = getState().user.token;
    const { data } = await axios.post(BASE_URL, newOrder, {
      headers: authHeaders(token),
    });
    return data;
  }
);

export const newItemOrder = createAsyncThunk(
  "orders/newItemOrder",
  async ({ order_id, itemRequest }, { getState }) => {
    const token = getState().user.token;

    const { data } = await axios.post(
      `${BASE_URL}/${order_id}/items`,
      itemRequest,
      { headers: authHeaders(token) }
    );

    return data;
  }
);

export const paymentProcess = createAsyncThunk(
  "orders/paymentProcess",
  async ({ id, newPayment }, { getState }) => {
    const token = getState().user.token;
    const headers = {
      Authorization: `Bearer ${token}`,
      ...(newPayment instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
    };

    const { data } = await axios.post(`${BASE_URL}/pay/${id}`, newPayment, {
      headers,
    });

    return data;
  }
);

export const confirmOrders = createAsyncThunk(
  "orders/confirmOrders",
  async ({ id }, { getState }) => {
    const token = getState().user.token;
    const { data } = await axios.put(`${BASE_URL}/confirm/${id}`, null, {
      headers: authHeaders(token),
    });
    return data;
  }
);

export const updateItemQuantity = createAsyncThunk(
  "orders/updateItemQuantity",
  async ({ order_id, items_id, itemRequest }, { getState }) => {
    const token = getState().user.token;

    const { data } = await axios.put(
      `${BASE_URL}/${order_id}/items/${items_id}`,
      itemRequest,
      { headers: authHeaders(token) }
    );
    return data;
  }
);

export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async ({ id }, { getState }) => {
    const token = getState().user.token;

    await axios.delete(`${BASE_URL}/${id}`, {
      headers: authHeaders(token),
    });
    return id;
  }
);

export const deleteOrderItems = createAsyncThunk(
  "orders/deleteOrderItems",
  async ({ order_id, items_id }, { getState }) => {
    const token = getState().user.token;

    const { data } = await axios.delete(
      `${BASE_URL}/${order_id}/items/${items_id}`,
      { headers: authHeaders(token) }
    );
    return data;
  }
);

const normalizeToArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload == null) return [];
  return [payload];
};

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    items: [],
    order: null,
    payment: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetOrder: (state) => {
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder

      //------GET-------
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.items = [];
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = normalizeToArray(action.payload);
        state.error =
          state.items.length === 0 ? "No se han encontrado pedidos." : null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.error = action.error?.message || "No se han encontrado pedidos.";
      })

      //---Order_Id---
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.items = [];
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.items = normalizeToArray(action.payload);
        state.error =
          state.items.length === 0 ? "No existe un pedido con ese ID." : null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.error = "No existe un pedido con ese ID.";
      })

      //---Order_Id_User---
      .addCase(fetchOrderByIdForUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByIdForUser.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderByIdForUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ||
          "No se encontró ningún id asociado al pedido.";
      })

      //---Completed_orders---
      .addCase(fetchCompletedOrderForAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.items = [];
      })
      .addCase(fetchCompletedOrderForAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.items = normalizeToArray(action.payload);
        state.error =
          state.items.length === 0
            ? "No se encontraron pedidos completados para ese usuario."
            : null;
      })
      .addCase(fetchCompletedOrderForAdmin.rejected, (state) => {
        state.loading = false;
        state.items = [];
        state.error = "No se encontraron pedidos completados para ese usuario.";
      })

      //---My_Orders---
      .addCase(fetchGetMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.items = [];
      })
      .addCase(fetchGetMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = normalizeToArray(action.payload);
        state.error =
          state.items.length === 0 ? "No tienes pedidos creados." : null;
      })
      .addCase(fetchGetMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.error = "No tienes pedidos creados.";
      })

      //---Order_Active---
      .addCase(fetchGetActive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGetActive.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchGetActive.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "No se encontró ninguna pedido del usuario.";
      })

      //-----POST-----
      //---CreateOrder---
      .addCase(createOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createOrders.fulfilled, (state, action) => {
        state.items = [...state.items, action.payload];
        state.loading = false;
      })

      .addCase(createOrders.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "No se ha podido crear un pedido.";
      })

      //---addNewItem---
      .addCase(newItemOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(newItemOrder.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (order) => order.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
        state.loading = false;
      })

      .addCase(newItemOrder.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ||
          "No se ha podido añadir el producto al pedido.";
      })

      //---Payment_Process---
      .addCase(paymentProcess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(paymentProcess.fulfilled, (state, action) => {
        state.payment = action.payload;
        state.loading = false;
      })

      .addCase(paymentProcess.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ||
          "Ha ocurrio un error, vuelva a intentarlo despues.";
      })

      //-----PUT-----
      //---Confirm_Orders---
      .addCase(confirmOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(confirmOrders.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload;
        const index = state.items.findIndex(
          (order) => order.id === updatedOrder.id
        );
        if (index !== -1) {
          state.items[index] = updatedOrder;
        }
        if (state.order?.id === updatedOrder.id) {
          state.order = updatedOrder;
        }
      })

      .addCase(confirmOrders.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "No se ha podido confirmar la orden.";
      })

      //---Order_New_Item---
      .addCase(updateItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        state.order = action.payload;
        state.loading = false;
        const updatedOrder = action.payload;
        const index = state.items.findIndex(
          (order) => order.id === updatedOrder.id
        );
        if (index !== -1) {
          state.items[index] = updatedOrder;
        }
        if (state.order?.id === updatedOrder.id) {
          state.order = updatedOrder;
        }
      })

      .addCase(updateItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ||
          "No se ha podido añadir el producto al pedido.";
      })

      //---DELETE---
      //---Delete_Order---
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        state.items = state.items.filter((order) => order.id !== deletedId);
        if (state.order?.id === deletedId) {
          state.order = null;
        }
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "No se ha podido eliminar el pedido.";
      })

      //---Delete_items---
      .addCase(deleteOrderItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrderItems.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload;
        const index = state.items.findIndex(
          (order) => order.id === updatedOrder.id
        );
        if (index !== -1) {
          state.items[index] = updatedOrder;
        }
        if (state.order?.id === updatedOrder.id) {
          state.order = updatedOrder;
        }
      })
      .addCase(deleteOrderItems.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ||
          "No se ha podido eliminar el producto al pedido.";
      });
  },
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;
