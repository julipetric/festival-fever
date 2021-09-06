import { t } from 'i18n-js';
import moment from 'moment';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import { PinkPrimary, PurplePill } from '../../../assets/Colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    maxHeight: 150,
  },
  eventName: {
    color: 'black',
    fontSize: 24,
  },
  image: {
    maxHeight: '100%',
    maxWidth: '100%',
  },
  categoryPill: {
    backgroundColor: PurplePill,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 10,
    textTransform: 'uppercase',
  },
  eventDate: {
    color: PinkPrimary,
    opacity: 0.8,
    fontSize: 12,
    fontWeight: 'bold',
  },
  location: {
    color: 'black',
    opacity: 0.6,
    fontSize: 12,
  },
});

function FavouriteEventCard({ event }) {
  return (
    <View style={styles.container}>
      <View style={{ display: 'flex', flex: 7, alignItems: 'flex-start' }}>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>Category</Text>
        </View>
        <Text style={styles.eventDate}>
          {moment(event.dates[0].start).format(`dddd D [${t('of')}] MMMM`)}
        </Text>
        <Text style={styles.eventName}>{event.name}</Text>
        <Text style={styles.location}>{event.location.description}</Text>
      </View>
      <View style={{ flex: 4 }}>
        <Image source={event.image} style={styles.image} resizeMode="cover" />
      </View>
    </View>
  );
}

FavouriteEventCard.propTypes = {
  event: PropTypes.object.isRequired,
};

export default FavouriteEventCard;
