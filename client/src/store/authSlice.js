import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuth: false,
  user: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { user } = action.payload;
      state.user = user;

      if (user === null) {
        state.isAuth = false;
      } else {
        state.isAuth = true;
      }
    },
    setRegister: (state, action) => {
      if (action.payload) {
        state.user = { ...state.user, ...action.payload };
      } else {
        state.user = null;
      }
    }
  }
});

export const { setAuth, setRegister } = authSlice.actions;

export default authSlice.reducer;
