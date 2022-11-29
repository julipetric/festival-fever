import { useNavigation } from '@react-navigation/native';
import { t } from 'i18n-js';
import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import EventLandingPage from '../../common/EventLandingPage';
import StyledButton from '../../components/StyledButton';

function EventDetails() {
  const navigation = useNavigation();

  const { event, userRole } = useSelector(state => ({
    userRole: state.myStore?.userRole,
    event: state.myStore?.selectedEvent,
  }));

  function navigateToMap() {
    navigation.navigate('FullScreenMapView', {
      hideDoneButton: true,
      defaultMarker: event.location?.coordinates,
    });
  }

  return (
    <EventLandingPage
      event={event}
      category={event.category}
      navigateToMap={navigateToMap}
      corporativoMode
    >
      {userRole?.userTypeId === 2 && (
        <View
          style={{ flexDirection: 'row', paddingTop: 10, flexWrap: 'wrap' }}
        >
          <StyledButton
            label={t('eventInfo')}
            onPress={() => navigation.navigate(t('eventInfo'))}
            testID="eventInfoButton"
          />
          <StyledButton
            label={t('ticketSegments')}
            onPress={() => navigation.navigate(t('ticketSegments'))}
            testID="ticketSegmentsButton"
          />
          <StyledButton
            label={t('products')}
            onPress={() => navigation.navigate(t('products'))}
            testID="productsButton"
          />
          <StyledButton
            label={t('combos')}
            onPress={() => navigation.navigate(t('combos'))}
            testID="combosButton"
          />
        </View>
      )}
    </EventLandingPage>
  );
}

export default EventDetails;
