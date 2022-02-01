import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';
import { useFirestoreConnect } from 'react-redux-firebase';
import { t } from 'i18n-js';
import { head } from 'lodash';
import CategoryDetailsHeader from './CategoryDetailsHeader';
import { BackgroundGray } from '../../../../assets/Colors';
import EventCards from './eventCards/EventCards';
import PillButton from '../../../common/PillButton';
import commonStyles from '../../../../assets/commonStyles';
import FilterBar from '../../../components/FilterBar';
import EventsList from './EventsList';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    backgroundColor: BackgroundGray,
  },
  filtersScroll: {
    flexDirection: 'row',
    flexGrow: 1,
    marginRight: 5,
    paddingBottom: 7,
  },
});

function CategoryDetails() {
  const route = useRoute();
  const { categoryId } = route.params;

  const [cardsMode, setCardsMode] = useState(true);
  const [listMode, setListMode] = useState(false);

  useFirestoreConnect([
    {
      collection: 'events',
      where: ['categoryId', '==', categoryId],
      storeAs: 'categoryEvents',
    },
    {
      collection: 'categories',
      doc: categoryId,
      storeAs: 'selectedCategory',
    },
  ]);

  const { events, category } = useSelector(state => ({
    events: state.firestore.ordered.categoryEvents,
    category: head(state.firestore.ordered.selectedCategory),
  }));

  const filters = [
    { text: t('all'), id: 'filter', selected: true },
    { text: t('mostPopular'), id: 'filter' },
    { text: t('nearby'), id: 'filter' },
    { text: t('today'), id: 'filter', selected: true },
    { text: t('thisWeek'), id: 'filter' },
  ];

  return (
    <View style={styles.container}>
      {category ? (
        <>
          <CategoryDetailsHeader
            name={category.name}
            image={{ uri: category.imageUrl }}
          />
          {events ? (
            <>
              <FilterBar
                left={
                  <ScrollView style={styles.filtersScroll} horizontal>
                    {filters.map(filter => (
                      <PillButton
                        selected={filter.selected}
                        text={filter.text}
                      />
                    ))}
                  </ScrollView>
                }
                right={
                  <View
                    style={[commonStyles.rowSpaceBetween, { paddingBottom: 7 }]}
                  >
                    <PillButton
                      selected={cardsMode}
                      element={
                        <MaterialCommunityIcons
                          name="view-carousel"
                          size={22}
                          color="white"
                        />
                      }
                      onPress={() => {
                        setListMode(false);
                        setCardsMode(true);
                      }}
                    />
                    <PillButton
                      selected={listMode}
                      element={
                        <FontAwesome5 name="th-list" size={16} color="white" />
                      }
                      onPress={() => {
                        setCardsMode(false);
                        setListMode(true);
                      }}
                    />
                  </View>
                }
                text={
                  events.length === 1
                    ? `${events.length} ${t('event')}`
                    : `${events.length} ${t('events')}`
                }
              />
              {cardsMode ? (
                <EventCards events={events} />
              ) : (
                <EventsList events={events} />
              )}
            </>
          ) : (
            <ActivityIndicator size="large" style={{ paddingTop: 30 }} />
          )}
        </>
      ) : (
        <ActivityIndicator size="large" style={{ paddingTop: 30 }} />
      )}
    </View>
  );
}

export default CategoryDetails;
