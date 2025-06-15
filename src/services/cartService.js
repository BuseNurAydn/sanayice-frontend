import { createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = '/api/cart'

const getToken = () => localStorage.getItem("token");

//GET CART
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, thunkAPI) => {
    try {
      const token = getToken(); 
      const response = await fetch(API_BASE, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return thunkAPI.rejectWithValue("Sepet verisi alınamadı");
      }

      const data = await response.json(); // sepetteki ürünler
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk: sepete ürün ekleme
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }, thunkAPI) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return thunkAPI.rejectWithValue(errorData);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

// Ürünü sepetten sil
export const removeCart = createAsyncThunk(
  'cart/removeFromCart',
  async (cartItemId, thunkAPI) => {  // sepet tablosundaki id
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/items/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        return thunkAPI.rejectWithValue("Ürün silinemedi");
      }

      return cartItemId;  // reducer'da bu id ile listeden sil
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
//Sepeti silme
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, thunkAPI) => {
    try {
      const token = getToken();
      const response = await fetch(API_BASE, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        return thunkAPI.rejectWithValue("Sepet temizlenemedi");
      }

      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

//PUT
export const changeQuantity = createAsyncThunk(
  "cart/changeQuantity",
  async ({ itemId, quantity }, thunkAPI) => {
    try {
      const token = getToken(); 

      const response = await fetch(`${API_BASE}/items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        return thunkAPI.rejectWithValue("Adet güncellenemedi");
      }

      // Güncellemeden sonra sepeti yeniden çek
      thunkAPI.dispatch(fetchCart());

      return { itemId, quantity };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


