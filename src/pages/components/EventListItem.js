import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import { PinkPrimary, PurplePill } from '../../assets/Colors';
import { formatEventDateTime } from '../../utils';

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

function EventListItem({ event, hideCategory }) {
  const { dateString, hoursString } = formatEventDateTime(event);

  console.log(event.imageUrl);

  return (
    <View style={styles.container}>
      <View style={{ display: 'flex', flex: 7, alignItems: 'flex-start' }}>
        {!hideCategory && (
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>Category</Text>
          </View>
        )}

        <Text style={styles.eventDate}>{`${dateString} ${hoursString}`}</Text>
        <Text style={styles.eventName}>{event.name}</Text>
        <Text style={styles.location}>{event.location.description}</Text>
      </View>
      <View style={{ flex: 4 }}>
        <Image
          source={event.imageUrl ? { uri: event.imageUrl } : event.image}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    </View>
  );
}

EventListItem.defaultProps = {
  hideCategory: false,
};

EventListItem.propTypes = {
  event: PropTypes.object.isRequired,
  hideCategory: PropTypes.bool,
};

export default EventListItem;
