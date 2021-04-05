/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: '',
    password: '',
    validSession: true,
    userTypeId: undefined,
  },
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setValidSession: (state, action) => {
      state.validSession = action.payload;
    },
  },
});

export const { setUsername, setValidSession } = userSlice.actions;

export default userSlice.reducer;
