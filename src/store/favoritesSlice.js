import { createSlice } from "@reduxjs/toolkit";
import { fetchFavorites, addToFavorites, removeFavorites } from "../services/favoritesService"; 

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearFavorites(state) {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Favorileri Getir
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Favori Ekle
      .addCase(addToFavorites.fulfilled, (state, action) => {
        const newFavorite = action.payload;
        const exists = state.items.find(item => item.productId === newFavorite.productId);
        if (!exists) {
          state.items.push(newFavorite);
        }
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Favori Sil
      .addCase(removeFavorites.fulfilled, (state, action) => {
        const removedId = action.payload;
        state.items = state.items.filter(item => item.productId !== removedId);
      })
      .addCase(removeFavorites.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});
export const { clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;

