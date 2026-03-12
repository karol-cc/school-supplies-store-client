import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:4002/users";
const URL_auth = "http://localhost:4002/api/v1/auth";

const decodeToken = (token) => {
  const payloadBase64 = token.split(".")[1];
  const decodedPayload = JSON.parse(atob(payloadBase64));

  return {
    name: decodedPayload.name,
    email: decodedPayload.sub,
    roles: decodedPayload.roles || [],
    role: decodedPayload.role,
    firstName: decodedPayload.firstName || null,
    lastName: decodedPayload.lastName || null,
    address: decodedPayload.address || null,
    cellphone: decodedPayload.cellphone || null,
  };
};

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials) => {
    const { data } = await axios.post(`${URL_auth}/authenticate`, credentials);
    const token = data.access_token;
    const user = decodeToken(token);
    return { token, user };
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (newUser) => {
    const { data } = await axios.post(`${URL_auth}/register`, newUser);
    const token = data.access_token;
    const user = decodeToken(token);
    return { token, user };
  }
);

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { getState }) => {
    const token = getState().user.token;
    const { data } = await axios.get(BASE_URL, { headers: authHeaders(token) });
    return data;
  }
);

export const fetchGetUsersMe = createAsyncThunk(
  "users/fetchGetUsersMe",
  async (_, { getState }) => {
    const token = getState().user.token;
    const { data } = await axios.get(`${BASE_URL}/me`, {
      headers: authHeaders(token),
    });
    return data;
  }
);

export const fetchUserId = createAsyncThunk(
  "users/fetchUserId",
  async ({ id }, { getState }) => {
    const token = getState().user.token;
    const { data } = await axios.get(`${BASE_URL}/${id}`, {
      headers: authHeaders(token),
    });
    return data;
  }
);

export const fetchUserEmail = createAsyncThunk(
  "users/fetchUserEmail",
  async ({ email }, { getState }) => {
    const token = getState().user.token;
    const { data } = await axios.get(`${BASE_URL}/email/${email}`, {
      headers: authHeaders(token),
    });
    return data;
  }
);

const normalizeToArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload == null) return [];
  return [payload];
};

const userSlice = createSlice({
  name: "user",

  initialState: {
    items: [],
    user: null,
    token: null,
    loading: false,
    error: null,
    isLoggingOut: false,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.items = [];
      state.isLoggingOut = true;
    },
    resetLogoutFlag: (state) => {
      state.isLoggingOut = false;
    },
  },

  extraReducers: (builder) => {
    builder
      //login
      .addCase(loginUser.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //obtener usuarios
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.items = [];
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = normalizeToArray(action.payload);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.error = action.error?.message || "Error al obtener usuarios.";
      })
      //User me
      .addCase(fetchGetUsersMe.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchGetUsersMe.fulfilled, (state, action) => {
        const backend = Array.isArray(action.payload)
          ? action.payload[0]
          : action.payload;

        if (!backend) return;

        state.user = {
          ...(state.user || {}),
          ...backend,
          roles: state.user?.roles || backend.roles || [],
        };
      })
      .addCase(fetchGetUsersMe.rejected, (state, action) => {
        state.error =
          action.error.message || "No se pudo obtener los datos del usuario.";
      })
      //user id
      .addCase(fetchUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.items = normalizeToArray(action.payload);
      })
      .addCase(fetchUserId.rejected, (state, action) => {
        state.items = [];
        state.loading = false;
        state.error =
          "No se pudo encontrar un usuario con ese ID." ||
          action.error?.message;
      })
      //user email
      .addCase(fetchUserEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.items = normalizeToArray(action.payload);
      })
      .addCase(fetchUserEmail.rejected, (state, action) => {
        state.items = [];
        state.loading = false;
        state.error =
          "No se pudo encontrar un usuario con ese email." ||
          action.error?.message;
      });
  },
});

export const { logout, resetLogoutFlag } = userSlice.actions;
export default userSlice.reducer;
