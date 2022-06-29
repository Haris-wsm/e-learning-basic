import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  course: null
};

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    createCourse: (state, action) => {
      if (action.payload) {
        state.course = { ...state.course, ...action.payload };
      } else {
        state.course = null;
      }
    }
  }
});

export const { createCourse } = courseSlice.actions;
export default courseSlice.reducer;
