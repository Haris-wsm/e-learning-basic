import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice';
import course from './courseSlice';

export const store = configureStore({
  reducer: { auth, course },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
});
