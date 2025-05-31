import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // her item: { id, name, price, quantity, image }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
    },
    incrementQuantity(state, action) {
      const id = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity += 1;
      }
    },
    changeQuantity(state, action) {
      const { id, delta } = action.payload;
      const product = state.items.find(item => item.id === id);
      if (product) {
        product.quantity += delta;
        if (product.quantity < 1) {
          state.items = state.items.filter(item => item.id !== id);
        }
      }
    },
    decrementQuantity(state, action) {
      const id = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else if (item && item.quantity === 1) {
        // Adet 1 ise ürün tamamen silinir
        state.items = state.items.filter(item => item.id !== id);
      }
    },
    removeFromCart(state, action) {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
    },
    clearCart(state) {
      state.items = [];
    }
  }
});

export const { addToCart, incrementQuantity, changeQuantity, decrementQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;


