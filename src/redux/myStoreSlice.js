/* eslint-disable no-param-reassign */
const { createSlice } = require('@reduxjs/toolkit');

const myStoreSlice = createSlice({
  name: 'myStore',
  initialState: {
    attendeeRole: undefined,
    userRole: undefined,
    userRoles: undefined,
    selectedEvent: undefined,
    selectedCategory: undefined,
    productClipboard: undefined,
    ticketClipboard: undefined,
  },
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
    reset(state) {
      const tempVars = { attendeeRole: state.attendeeRole };
      state = myStoreSlice.initialState;
      state = { ...state, ...tempVars };
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
  reset,
} = myStoreSlice.actions;
export default myStoreSlice.reducer;
