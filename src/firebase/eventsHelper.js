/* eslint-disable import/prefer-default-export */

import { setEvents, setLoadingEvents } from '../redux/slices/eventsSlice';
import { getReferenceCollection } from './utils';

export async function getEvents(eventsCollection, dispatch) {
  const eventsList = await getReferenceCollection(eventsCollection);
  dispatch(setEvents(eventsList));
  dispatch(setLoadingEvents(false));
}
