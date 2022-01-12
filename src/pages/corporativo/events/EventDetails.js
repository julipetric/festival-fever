import { useNavigation, useRoute } from '@react-navigation/native';
import { t } from 'i18n-js';
import { head } from 'lodash';
import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import EventLandingPage from '../../common/EventLandingPage';
import StyledButton from '../../components/StyledButton';

function EventDetails() {
  const route = useRoute();
  const navigation = useNavigation();

  const { eventId } = route.params;

  const { event, category } = useSelector(state => ({
    event: head(state.firestore.ordered.selectedEvent),
    category: head(state.firestore.ordered.selectedEventCategory),
  }));

  useFirestoreConnect(() => {
    const array = [
      {
        collection: 'events',
        doc: eventId,
        storeAs: 'selectedEvent',
      },
    ];
    if (event)
      array.push({
        collection: 'categories',
        doc: event.categoryId,
        storeAs: 'selectedEventCategory',
      });
    return array;
  });

  function navigateToMap() {
    navigation.navigate('FullScreenMapView');
  }

  function navigateToEventInfo() {
    navigation.navigate('EditEventInfo', { event });
  }

  return event && category ? (
    <EventLandingPage
      event={event}
      category={category}
      navigateToMap={navigateToMap}
      corporativoMode
    >
      <View style={{ alignItems: 'flex-start', paddingTop: 10 }}>
        <StyledButton label={t('editInfo')} onPress={navigateToEventInfo} />
      </View>
    </EventLandingPage>
  ) : (
    <ActivityIndicator style={{ paddingTop: 50 }} />
  );
}

export default EventDetails;
