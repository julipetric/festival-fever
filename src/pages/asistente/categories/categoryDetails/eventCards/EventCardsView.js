import React from 'react';
import { Text, View } from 'react-native';

import PropTypes from 'prop-types';

function EventCardView({ item }) {
  const event = item;

  return (
    <View key={event.id}>
      <Text>{event.name}</Text>
    </View>
  );
}

EventCardView.propTypes = {
  item: PropTypes.object.isRequired,
};

export default EventCardView;
