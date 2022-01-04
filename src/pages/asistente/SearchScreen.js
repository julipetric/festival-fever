import { FontAwesome } from '@expo/vector-icons';
import { t } from 'i18n-js';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FlatList, StyleSheet, View } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { BackgroundGray, PinkPrimary } from '../../assets/Colors';
import { themeBlackText } from '../../assets/theme';
import EventListItem from '../components/EventListItem';
import FormTextInput from '../components/FormTextInput';

const styles = StyleSheet.create({
  searchContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 65,
  },
  listContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    backgroundColor: BackgroundGray,
  },
  title: {
    fontSize: 42,
    fontFamily: 'MADE-Evolve-Sans-Bold',
    color: 'white',
  },
  searchField: {
    backgroundColor: 'white',
    color: 'red',
  },
  labelText: {
    fontSize: 12,
    color: PinkPrimary,
  },
  scrollView: { width: '100%', marginTop: 8 },
});

function SearchScreen() {
  const { control, getValues } = useForm();

  useFirestoreConnect('events');

  const { events, categories } = useSelector(state => ({
    events: state.firestore.ordered.events,
    categories: state.firestore.ordered.categories,
  }));

  const [filteredEvents, setFilteredEvents] = useState();

  function search() {
    setFilteredEvents(
      events.filter(event =>
        event.name.toLowerCase().includes(getValues().search.toLowerCase())
      )
    );
  }

  useEffect(() => setFilteredEvents(), []);

  return filteredEvents ? (
    <View style={styles.listContainer}>
      <FlatList
        data={filteredEvents}
        renderItem={({ item }) => (
          <EventListItem
            event={item}
            category={categories.find(
              category => category.id === item.categoryId
            )}
          />
        )}
        style={styles.scrollView}
      />
    </View>
  ) : (
    <View style={styles.searchContainer}>
      <Text style={styles.title}>{t('search')}</Text>
      <FormTextInput
        control={control}
        style={styles.searchField}
        name="search"
        right={
          <TextInput.Icon
            icon={() => <FontAwesome name="search" size={24} color="black" />}
            color="black"
            onPress={search}
          />
        }
        hideHelperText
        theme={themeBlackText}
      />
      <Text style={styles.labelText}>{t('nameOrDescriptionOfEvent')}</Text>
    </View>
  );
}

export default SearchScreen;
