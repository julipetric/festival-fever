import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Text } from 'react-native-paper';
import EventLandingPage from '../../common/EventLandingPage';

function EventDetails() {
  const route = useRoute();
  const navigation = useNavigation();

  const { event, category } = route.params;

  function navigateToMap() {
    navigation.navigate('FullScreenMapView');
  }

  return (
    <EventLandingPage
      event={event}
      category={category}
      navigateToMap={navigateToMap}
      hideFavoriteButton
    >
      <Text>{event.name}</Text>
    </EventLandingPage>
  );
}

export default EventDetails;
