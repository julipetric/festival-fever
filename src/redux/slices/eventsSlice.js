/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    loadingEvents: false,
    events: [],
  },
  reducers: {
    setLoadingEvents: (state, action) => {
      state.loadingEvents = action.payload;
    },
    setEvents: (state, action) => {
      state.events = action.payload;
    },
  },
});

export const { setLoadingEvents, setEvents } = eventsSlice.actions;

export default eventsSlice.reducer;
