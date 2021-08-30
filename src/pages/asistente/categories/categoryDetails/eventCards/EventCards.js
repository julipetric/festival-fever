import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import PropTypes from 'prop-types';
import EventCardView from './EventCardsView';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  carouselContainer: { alignItems: 'center' },
});
function EventCards({ events }) {
  return (
    <Carousel
      horizontal
      data={events}
      renderItem={EventCardView}
      sliderWidth={windowWidth}
      itemWidth={windowWidth * 0.7}
      keyExtractor={event => event.id}
      contentContainerStyle={{ flexGrow: 1 }}
      removeClippedSubviews
      enableMomentum
      contentContainerCustomStyle={styles.carouselContainer}
    />
  );
}

EventCards.propTypes = {
  events: PropTypes.array.isRequired,
};

export default EventCards;
