import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { IconButton } from 'react-native-paper';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import { PinkPrimary } from '../../../../../assets/Colors';
import { formatEventDateTime } from '../../../../../utils';

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 4,
    display: 'flex',
    height: '95%',
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 1,
    maxHeight: '50%',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  contentContainer: {
    display: 'flex',
    flex: 1,
    maxHeight: '50%',
  },
  circleIcon: { backgroundColor: 'rgba(0,0,0,0.3)', padding: 3 },
  eventName: {
    fontSize: 24,
  },
  eventDate: {
    fontSize: 14,
    color: PinkPrimary,
    opacity: 0.8,
    paddingRight: 10,
  },
  eventTime: {
    opacity: 0.6,
    fontSize: 14,
  },
  dataContainer: {
    padding: 10,
    flex: 4,
  },
  mapContainer: {
    flex: 6,
  },
});

function CircleButton({ children }) {
  return <View style={styles.buttonContainer}>{children}</View>;
}

CircleButton.propTypes = {
  children: PropTypes.element.isRequired,
};

function EventCardView({ item, navigate }) {
  const event = item;

  const { dateString, hoursString } = formatEventDateTime(event);

  return (
    <TouchableOpacity
      key={event.id}
      style={styles.card}
      onPress={() => navigate(event)}
    >
      <ImageBackground
        style={styles.imageContainer}
        source={{ uri: event.imageUrl }}
      >
        <IconButton
          icon={() => <FontAwesome5 name="share-alt" size={17} color="white" />}
          style={styles.circleIcon}
          size={25}
        />
        <IconButton
          icon={() => <Feather name="star" size={17} color="white" />}
          style={styles.circleIcon}
          size={25}
        />
      </ImageBackground>
      <View style={styles.contentContainer}>
        <View
          style={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}
        >
          <View style={styles.dataContainer}>
            {event.dates.length === 1 && (
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.eventDate}>{dateString}</Text>
                <Text style={styles.eventTime}>{hoursString}</Text>
              </View>
            )}
            <Text style={styles.eventName}>{event.name}</Text>
            <Text style={styles.eventTime}>{event.location.description}</Text>
            <Text style={styles.eventTime}>{event.location.address}</Text>
          </View>
          <MapView style={styles.mapContainer} scrollEnabled={false} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

EventCardView.propTypes = {
  item: PropTypes.object.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default EventCardView;
