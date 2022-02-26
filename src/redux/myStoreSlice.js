/* eslint-disable no-param-reassign */
const { createSlice } = require('@reduxjs/toolkit');

const myStoreSlice = createSlice({
  name: 'myStore',
  initialState: {
    userRole: undefined,
    selectedEvent: undefined,
  },
  reducers: {
    setUserRole(state, action) {
      state.userRole = action.payload;
    },
    setSelectedEvent(state, action) {
      state.selectedEvent = action.payload;
    },
  },
});

export const { setUserRole, setSelectedEvent } = myStoreSlice.actions;
export default myStoreSlice.reducer;
