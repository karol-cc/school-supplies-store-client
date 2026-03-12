import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "http://localhost:4002/payments";

export const fetchPayments = createAsyncThunk(
  "payments/fetchPayments",
  async (_, { getState }) => {
    const token = getState().user.token;
    const { data } = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return data;
  }
);

export const fetchPaymentById = createAsyncThunk(
  "payments/fetchPaymentById",
  async (paymentId, { getState }) => {
    const token = getState().user.token;
    const id = paymentId?.id ?? paymentId;
    const { data } = await axios.get(`${URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  }
);

export const fetchPaymentsGreaterThan = createAsyncThunk(
  "payments/fetchPaymentsGreaterThan",
  async (amount, { getState }) => {
    const token = getState().user.token;
    const { data } = await axios.get(`${URL}/amountGreaterThan/${amount}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  }
);

export const fetchPaymentsByDateRange = createAsyncThunk(
  "payments/fetchPaymentsByDateRange",
  async ({ startDate, endDate }, { getState }) => {
    const token = getState().user.token;
    const { data } = await axios.get(
      `${URL}/date-range/${startDate}/${endDate}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  }
);

export const fetchPaymentsByOrderId = createAsyncThunk(
  "payments/fetchPaymentsByOrderId",
  async (orderId, { getState }) => {
    const token = getState().user.token;
    const { data } = await axios.get(`${URL}/order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return data;
  }
);

export const fetchPaymentsByStatus = createAsyncThunk(
  "payments/fetchPaymentsByStatus",
  async (status, { getState }) => {
    const token = getState().user.token;
    const { data } = await axios.get(`${URL}/status/${status}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  }
);

const normalizeToArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload == null) return [];
  return [payload];
};

const paymentSlice = createSlice({
  name: "payments",
  initialState: {
    items: [],
    payment: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // todos
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.items = [];
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = normalizeToArray(action.payload);
        state.error =
          state.items.length === 0 ? "No se encontraron pagos." : null;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        const err = action.error?.message || "";
        state.error = err.includes("403")
          ? "Acceso denegado: solo el admin puede ver los pagos."
          : err || "Error al obtener los pagos.";
      })

      // por pago id
      .addCase(fetchPaymentById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.items = [];
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.items = normalizeToArray(action.payload);
        state.error =
          state.items.length === 0
            ? "No se encontró el pago solicitado."
            : null;
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.error =
          `No se encontró ningún pago con ese ID.` ||
          action.error?.message ||
          "Error al obtener el pago.";
      })

      // monto mayor a
      .addCase(fetchPaymentsGreaterThan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.items = [];
      })
      .addCase(fetchPaymentsGreaterThan.fulfilled, (state, action) => {
        state.loading = false;
        state.items = normalizeToArray(action.payload);
        state.error =
          state.items.length === 0
            ? "No se encontraron pagos para ese monto."
            : null;
      })
      .addCase(fetchPaymentsGreaterThan.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.error =
          "No se encontraron pagos para ese monto" ||
          action.error?.message ||
          "Error al obtener pagos.";
      })

      // rango de fechas
      .addCase(fetchPaymentsByDateRange.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.items = [];
      })
      .addCase(fetchPaymentsByDateRange.fulfilled, (state, action) => {
        state.loading = false;
        state.items = normalizeToArray(action.payload);
        state.error =
          state.items.length === 0
            ? "No se encontraron pagos en ese rango de fechas."
            : null;
      })
      .addCase(fetchPaymentsByDateRange.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.error =
          "No se encontraron pagos en ese rango de fechas." ||
          action.error?.message;
      })
      // por oder id
      .addCase(fetchPaymentsByOrderId.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.items = [];
      })
      .addCase(fetchPaymentsByOrderId.fulfilled, (state, action) => {
        state.loading = false;
        state.items = normalizeToArray(action.payload);
        state.error =
          state.items.length === 0
            ? "No se encontraron pagos para esa orden."
            : null;
      })
      .addCase(fetchPaymentsByOrderId.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.error =
          `No se encontró ningún pago asociado a la orden.` ||
          action.error?.message;
      })

      // por estado
      .addCase(fetchPaymentsByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.items = [];
      })
      .addCase(fetchPaymentsByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.items = normalizeToArray(action.payload);
        state.error =
          state.items.length === 0
            ? "No se encontraron pagos con ese estado."
            : null;
      })
      .addCase(fetchPaymentsByStatus.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.error =
          `No se encontraron pagos con ese estado.` || action.error?.message;
      });
  },
});

export default paymentSlice.reducer;
