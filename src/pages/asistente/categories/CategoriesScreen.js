import React from 'react';
import { FlatList } from 'react-native';
import { uniqueId, sample } from 'lodash';
import CategoryItem from './CategoryItem';
import TheatreBackground from '../../../assets/categoriesBackgrounds/theatre.png';
import BeerBackground from '../../../assets/categoriesBackgrounds/beer.png';
import ConcertBackground from '../../../assets/categoriesBackgrounds/concert.png';
import PartyBackground from '../../../assets/categoriesBackgrounds/party.png';
import { demoEvents } from '../../../mocks/eventsDemoData';

const dummyEventList = [];

for (let i = 0; i < 10; i += 1) {
  dummyEventList.push({ ...sample(demoEvents), id: uniqueId() });
}

const items = [
  {
    name: 'dummyItem',
    id: '1',
    image: TheatreBackground,
    events: dummyEventList,
  },
  { name: 'dummyItem', id: '2', image: BeerBackground, events: dummyEventList },
  {
    name: 'dummyItem',
    id: '3',
    image: ConcertBackground,
    events: dummyEventList,
  },
  {
    name: 'dummyItem',
    id: '4',
    image: PartyBackground,
    events: dummyEventList,
  },
  {
    name: 'dummyItem',
    id: '5',
    image: TheatreBackground,
    events: dummyEventList,
  },
  {
    name: 'dummyItem',
    id: '6',
    image: BeerBackground,
    events: dummyEventList,
  },
  {
    name: 'dummyItem',
    id: '7',
    image: ConcertBackground,
    events: dummyEventList,
  },
  {
    name: 'dummyItem',
    id: '8',
    image: PartyBackground,
    events: dummyEventList,
  },
];

function CategoriesScreen() {
  return (
    <FlatList
      data={items}
      renderItem={({ item }) => <CategoryItem category={item} />}
    />
  );
}

export default CategoriesScreen;
