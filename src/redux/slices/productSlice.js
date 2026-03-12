import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "http://localhost:4002/products";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const { data } = await axios.get(URL);
    return data;
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id) => {
    const { data } = await axios.get(`${URL}/${id}`);
    return data;
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (categoryName) => {
    const { data } = await axios.get(`${URL}/categoryName/${categoryName}`);
    return data;
  }
);

export const fetchProductsByName = createAsyncThunk(
  "products/fetchProductsByName",
  async (name) => {
    const { data } = await axios.get(`${URL}/name/${name}`);
    return data;
  }
);

export const fetchProductsByPrice = createAsyncThunk(
  "products/fetchProductsByPrice",
  async ({ priceMin, priceMax }) => {
    const { data } = await axios.get(`${URL}/price/${priceMin}/${priceMax}`);
    return data;
  }
);

export const fetchProductsBySeller = createAsyncThunk(
  "products/fetchProductsBySeller",
  async ({ sellerName }) => {
    const { data } = await axios.get(`${URL}/seller/${sellerName}`);
    return data;
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (updatedProduct, { getState }) => {
    const token = getState().user.token;
    const { id, name, description, stock, price, images } = updatedProduct;

    const { data } = await axios.patch(
      `${URL}/${id}`,
      { name, description, stock, price, images },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  }
);

export const updatePromotion = createAsyncThunk(
  "products/updatePromotion",
  async ({ id, promotion }, { getState }) => {
    const token = getState().user.token;

    const { data } = await axios.put(
      `${URL}/${id}/discount?discountPercentage=${promotion}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (newProduct, { getState }) => {
    const token = getState().user.token;

    const { data } = await axios.post(URL, newProduct, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return data;
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async ({ id }, { getState }) => {
    const token = getState().user.token;

    await axios.delete(`${URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return id;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    product: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // fetchProductById 
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // fetchProductsByCategory 
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // fetchProductsByName 
      .addCase(fetchProductsByName.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsByName.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductsByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // fetchProductsByPrice 
      .addCase(fetchProductsByPrice.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsByPrice.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductsByPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // fetchProductsBySeller
      .addCase(fetchProductsBySeller.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsBySeller.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductsBySeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // createProduct 
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // updateProduct 
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        state.loading = false;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // updatePromotion 
      .addCase(updatePromotion.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePromotion.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        state.loading = false;
      })
      .addCase(updatePromotion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // deleteProduct 
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
