import React, { useCallback } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { t } from 'i18n-js';
import { useSelector } from 'react-redux';
import { remove } from 'lodash';
import { useFirebase } from 'react-redux-firebase';
import EventCardView from './EventCardView';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  carouselContainer: { alignItems: 'center' },
});
function EventCards({ events }) {
  const navigation = useNavigation();
  const firebase = useFirebase();
  function navigate(event) {
    navigation.navigate(t('eventDetails'), { eventId: event.id });
  }

  const { profile } = useSelector(state => ({
    profile: state.firebase.profile,
  }));

  const { favorites } = profile;

  const onFavAdded = useCallback(
    async event => {
      const newFavorites = (favorites && [...favorites]) || [];
      if (newFavorites.includes(event.id))
        remove(newFavorites, e => e === event.id);
      else newFavorites.push(event.id);
      await firebase.updateProfile({ favorites: newFavorites });
    },
    [favorites, firebase]
  );

  return (
    <Carousel
      horizontal
      data={events}
      renderItem={({ item }) => (
        <EventCardView
          item={item}
          navigate={navigate}
          onFavAdded={() => onFavAdded(item)}
          isFavorite={favorites?.includes(item.id)}
        />
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
};

export default EventCards;
