import { Ionicons } from '@expo/vector-icons';
import { t } from 'i18n-js';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, RefreshControl } from 'react-native';
import { ActivityIndicator, Text, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/core';
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import StyledButton from '../../components/StyledButton';

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 30,
  },
});

function EventsHome() {
  const navigation = useNavigation();
  const firestore = useFirestore();
  const [eventsList, setEventsList] = useState([]);

  useFirestoreConnect('events');

  const events = useSelector(state => state.firestore.data.events);

  useEffect(() => {
    setEventsList(_.toPairs(events).filter(event => event[1] !== null));
  }, [events]);

  const requestingEvents = useSelector(
    state => state.firestore.status.requesting.events
  );

  function onRefresh() {
    firestore.get({ collection: 'events' });
  }

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={requestingEvents} onRefresh={onRefresh} />
      }
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Title>{t('myEvents')}</Title>
        <StyledButton
          icon={({ color }) => (
            <Ionicons name="add-circle" size={26} color={color} />
          )}
          onPress={() => navigation.push(t('addEvent'))}
        >
          {t('addEvent')}
        </StyledButton>
      </View>
      {!requestingEvents &&
        eventsList &&
        eventsList.map(event => {
          return <Text key={event[0]}>{JSON.stringify(event[1])}</Text>;
        })}
    </ScrollView>
  );
}

export default EventsHome;
