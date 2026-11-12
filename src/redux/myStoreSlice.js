/* eslint-disable no-param-reassign */
const { createSlice } = require('@reduxjs/toolkit');

const initialState = {
  attendeeRole: undefined,
  userRole: undefined,
  userRoles: undefined,
  selectedEvent: undefined,
  selectedCategory: undefined,
  productClipboard: undefined,
  ticketClipboard: undefined,
};

const myStoreSlice = createSlice({
  name: 'myStore',
  initialState,
  reducers: {
    setAttendeeRole(state, action) {
      state.attendeeRole = action.payload;
    },
    setUserRole(state, action) {
      state.userRole = action.payload;
    },
    setUserRoles(state, action) {
      state.userRoles = action.payload;
    },
    setSelectedEvent(state, action) {
      state.selectedEvent = action.payload;
    },
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    setProductClipboard(state, action) {
      state.productClipboard = action.payload;
    },
    setTicketClipboard(state, action) {
      state.ticketClipboard = action.payload;
    },
  },
});

export const {
  setAttendeeRole,
  setUserRole,
  setSelectedEvent,
  setUserRoles,
  setSelectedCategory,
  setProductClipboard,
  setTicketClipboard,
} = myStoreSlice.actions;
export default myStoreSlice.reducer;
