import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { t } from 'i18n-js';
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
  },
  eventName: {
    color: 'black',
    fontSize: 24,
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

function EventListItem({ event, category, hideCategory }) {
  const { dateString, hoursString } = formatEventDateTime(event);

  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  useEffect(() => {
    Image.getSize(event.imageUrl, (width, height) => {
      const ratio = imageWidth / width;
      setImageHeight(height * ratio);
    });
  }, [event, imageWidth]);

  const navigation = useNavigation();
  function navigate() {
    navigation.navigate(t('eventDetails'), { eventId: event.id });
  }

  return (
    <TouchableOpacity style={styles.container} onPress={navigate}>
      <View style={{ display: 'flex', flex: 7, alignItems: 'flex-start' }}>
        {!hideCategory && (
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{category.name}</Text>
          </View>
        )}

        <Text style={styles.eventDate}>{`${dateString} ${hoursString}`}</Text>
        <Text style={styles.eventName}>{event.name}</Text>
        <Text style={styles.location}>{event.location.description}</Text>
      </View>
      <View
        style={{ flex: 4, justifyContent: 'center' }}
        onLayout={e => {
          setImageWidth(e.nativeEvent.layout.width);
        }}
      >
        <Image
          source={event.imageUrl ? { uri: event.imageUrl } : event.image}
          style={{
            height: imageHeight,
            width: imageWidth,
          }}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );
}

EventListItem.defaultProps = {
  category: {},
  hideCategory: false,
};

EventListItem.propTypes = {
  event: PropTypes.object.isRequired,
  category: PropTypes.object,
  hideCategory: PropTypes.bool,
};

export default EventListItem;
