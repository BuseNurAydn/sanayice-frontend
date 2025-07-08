// redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // { id, name, email, roles, ... }
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    updateDocuments: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, documents: action.payload };
      }
    },
    logout: (state) => {  //çıkış yapınca kullanıcı bilgisi sıfırlandı
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logout, updateDocuments } = authSlice.actions;
export default authSlice.reducer;
