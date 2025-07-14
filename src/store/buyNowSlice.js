import { createSlice } from '@reduxjs/toolkit';

const buyNowSlice = createSlice({
  name: 'buyNow',
  initialState: null,
  reducers: {
    setBuyNowItem: (state, action) => action.payload,
    clearBuyNowItem: () => null
  }
});

export const { setBuyNowItem, clearBuyNowItem } = buyNowSlice.actions;
export default buyNowSlice.reducer;
