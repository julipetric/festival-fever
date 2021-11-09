import { Ionicons } from '@expo/vector-icons';
import { t } from 'i18n-js';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import StyledButton from '../../components/StyledButton';
import EventListItem from '../../components/EventListItem';
import { PagePaddingHorizontal } from '../../../assets/UIConstants';

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 10,
    width: '100%',
  },
});

function EventsHome() {
  const navigation = useNavigation();

  useFirestoreConnect(() => [{ collection: 'events' }]);
  const { events } = useSelector(state => ({
    events: state.firestore.ordered.events,
  }));

  return events ? (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: PagePaddingHorizontal,
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
      {(events || []).map(event => (
        <EventListItem event={event} />
      ))}
    </ScrollView>
  ) : (
    <ActivityIndicator style={{ flex: 1 }} />
  );
}

export default EventsHome;
