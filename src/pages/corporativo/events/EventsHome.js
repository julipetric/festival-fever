import { Ionicons } from '@expo/vector-icons';
import { t } from 'i18n-js';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import StyledButton from '../../components/StyledButton';
import { PagePaddingHorizontal } from '../../../assets/UIConstants';
import EventItem from './EventItem';

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 10,
    width: '100%',
  },
});

function EventsHome() {
  const navigation = useNavigation();

  useFirestoreConnect(() => ['events', 'categories']);
  const { events, categories } = useSelector(state => ({
    events: state.firestore.ordered.events,
    categories: state.firestore.ordered.categories,
  }));

  return events && categories ? (
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
        <EventItem
          event={event}
          category={categories.find(
            category => category.id === event.categoryId
          )}
        />
      ))}
    </ScrollView>
  ) : (
    <ActivityIndicator style={{ flex: 1 }} />
  );
}

export default EventsHome;
