import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { t } from 'i18n-js';
import { Title } from 'react-native-paper';
import EventListItem from '../../../components/EventListItem';
import { BackgroundGray } from '../../../../assets/Colors';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    width: '100%',
    backgroundColor: BackgroundGray,
  },
  scrollView: { width: '100%', marginTop: 8 },
});

function EventsList({ events }) {
  const navigation = useNavigation();
  function navigate(event) {
    navigation.navigate(t('eventDetails'), { eventId: event.id });
  }

  return (
    <View style={styles.container}>
      {events?.length > 0 ? (
        <FlatList
          testID="eventListView"
          data={events}
          renderItem={({ item }) => (
            <EventListItem event={item} navigate={navigate} hideCategory />
          )}
          style={styles.scrollView}
        />
      ) : (
        <Title>{t('noEvents')}</Title>
      )}
    </View>
  );
}

EventsList.propTypes = {
  events: PropTypes.array.isRequired,
};

export default EventsList;
