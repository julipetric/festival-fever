import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { t } from 'i18n-js';
import EventCardView from './EventCardsView';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  carouselContainer: { alignItems: 'center' },
});
function EventCards({ events, category }) {
  const navigation = useNavigation();
  function navigate(event) {
    navigation.navigate(t('eventDetails'), { event, category });
  }

  return (
    <Carousel
      horizontal
      data={events}
      renderItem={({ item }) => (
        <EventCardView item={item} navigate={navigate} />
      )}
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
  category: PropTypes.object.isRequired,
};

export default EventCards;
