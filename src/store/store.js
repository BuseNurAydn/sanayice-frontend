import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import favoritesReducer from './favoritesSlice';
import buyNowReducer from './buyNowSlice';
import notificationReducer from './notificationSlice';

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    auth: authReducer,
    cart: cartReducer,  //sepete ekleme için
    buyNow: buyNowReducer,
    notifications: notificationReducer, //bildirim
  }
});
