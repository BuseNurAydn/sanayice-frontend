import { createSlice } from '@reduxjs/toolkit';
import { addToCart, fetchCart, removeCart, clearCart,changeQuantity } from '../services/cartService';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], // [{ productId, name, price, quantity }]
    status: 'idle',
    error: null,
  },
  reducers: {
    clear(state) {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items; // backend'den gelen ürünlerle doldur
        const itemsArray = Array.isArray(action.payload)
          ? action.payload
          : action.payload.items || [];

        state.items = itemsArray.sort((a, b) => a.id - b.id);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';

        const incoming = action.payload;
        const existingItem = state.items.find(item => item.productId === incoming.productId);

        if (existingItem) {
          existingItem.quantity = incoming.quantity;
        } else {
          state.items.push({ ...incoming });
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Sepete eklenirken hata oluştu';
      })
      .addCase(removeCart.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter(item => item.id !== id);

      })
      .addCase(changeQuantity.pending, (state) => {
       state.status = 'loading';
      })
      .addCase(changeQuantity.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(changeQuantity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Adet güncelleme hatası";
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      })
  },
});
export const { clear } = cartSlice.actions;
export default cartSlice.reducer;