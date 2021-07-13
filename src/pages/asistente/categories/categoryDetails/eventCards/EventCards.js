import React from 'react';
import { FlatList } from 'react-native';

import PropTypes from 'prop-types';
import EventCardView from './EventCardsView';

function EventCards({ events }) {
  return (
    <FlatList
      horizontal
      data={events}
      renderItem={EventCardView}
      keyExtractor={event => event.id}
      contentContainerStyle={{ flexGrow: 1 }}
    />
  );
}

EventCards.propTypes = {
  events: PropTypes.array.isRequired,
};

export default EventCards;
