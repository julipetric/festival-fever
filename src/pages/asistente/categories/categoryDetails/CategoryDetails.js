import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';
import { useFirestoreConnect } from 'react-redux-firebase';
import { t } from 'i18n-js';
import moment from 'moment';
import CategoryDetailsHeader from './CategoryDetailsHeader';
import { BackgroundGray } from '../../../../assets/Colors';
import EventCards from './eventCards/EventCards';
import PillButton from '../../../common/PillButton';
import commonStyles from '../../../../assets/commonStyles';
import FilterBar from '../../../components/FilterBar';
import EventsList from './EventsList';
import { setSelectedCategory } from '../../../../redux/myStoreSlice';

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
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [cardsMode, setCardsMode] = useState(true);
  const [listMode, setListMode] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const { events, category, status } = useSelector(state => ({
    events: state.firestore.ordered.categoryEvents,
    category: state.myStore.selectedCategory,
    status: state.firestore.status,
  }));

  useFirestoreConnect(() => {
    const where = [];
    if (category?.id) where.push(['categoryId', '==', category?.id]);
    switch (selectedFilter) {
      case 'all':
        break;
      case 'today': {
        where.push([
          'startDate',
          '<=',
          moment()
            .add(1, 'day')
            .hours(0)
            .minutes(0)
            .seconds(0)
            .milliseconds(0)
            .unix(),
        ]);
        where.push([
          'startDate',
          '>=',
          moment().hours(0).minutes(0).seconds(0).milliseconds(0).unix(),
        ]);
        break;
      }
      case 'thisWeek': {
        where.push([
          'startDate',
          '<=',
          moment().day(0).hours(0).minutes(0).seconds(0).milliseconds(0).unix(),
        ]);
        where.push([
          'startDate',
          '>=',
          moment().day(7).hours(0).minutes(0).seconds(0).milliseconds(0).unix(),
        ]);
        break;
      }
      default:
        break;
    }
    if (category)
      return [
        {
          collection: 'events',
          where: where?.length ? where : undefined,
          storeAs: 'categoryEvents',
        },
      ];
    return [];
  });

  const filters = [
    { text: t('all'), id: 'all' },
    // { text: t('mostPopular'), id: 'filter' },
    // { text: t('nearby'), id: 'filter' },
    { text: t('today'), id: 'today' },
    { text: t('thisWeek'), id: 'thisWeek' },
  ];

  useEffect(() => {
    navigation.addListener('beforeRemove', () => {
      dispatch(setSelectedCategory(undefined));
    });
  }, [dispatch, navigation]);

  const isFilterSelected = useCallback(
    id => id === selectedFilter,
    [selectedFilter]
  );

  return (
    <View style={styles.container}>
      {category ? (
        <>
          <CategoryDetailsHeader
            name={category.name}
            image={{ uri: category.imageUrl }}
          />
          <FilterBar
            left={
              <ScrollView style={styles.filtersScroll} horizontal>
                {filters.map(filter => (
                  <PillButton
                    selected={isFilterSelected(filter.id)}
                    text={filter.text}
                    onPress={() => setSelectedFilter(filter.id)}
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
              events?.length === 1
                ? `${events?.length} ${t('event')}`
                : `${events?.length} ${t('events')}`
            }
          />
          {events &&
          !(
            status.requesting.categoryEvents || !status.requested.categoryEvents
          ) ? (
            <>
              {cardsMode ? (
                <EventCards events={events.map(e => ({ ...e, category }))} />
              ) : (
                <EventsList events={events.map(e => ({ ...e, category }))} />
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
