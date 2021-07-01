import React from 'react';
import { FlatList } from 'react-native';
import CategoryItem from './CategoryItem';
import TheatreBackground from '../../../assets/categoriesBackgrounds/theatre.png';
import BeerBackground from '../../../assets/categoriesBackgrounds/beer.png';
import ConcertBackground from '../../../assets/categoriesBackgrounds/concert.png';
import PartyBackground from '../../../assets/categoriesBackgrounds/party.png';

const items = [
  { name: 'dummyItem', id: '1', image: TheatreBackground },
  { name: 'dummyItem', id: '2', image: BeerBackground },
  { name: 'dummyItem', id: '3', image: ConcertBackground },
  { name: 'dummyItem', id: '4', image: PartyBackground },
  { name: 'dummyItem', id: '5', image: TheatreBackground },
  { name: 'dummyItem', id: '6', image: BeerBackground },
  { name: 'dummyItem', id: '7', image: ConcertBackground },
  { name: 'dummyItem', id: '8', image: PartyBackground },
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
