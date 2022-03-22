import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableHighlight, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import { t } from 'i18n-js';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { PinkPrimary, PurplePill } from '../../../assets/Colors';
import { formatEventDateTime } from '../../../utils';
import { ListItemBorderRadius } from '../../../assets/UIConstants';
import { setSelectedEvent } from '../../../redux/myStoreSlice';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: ListItemBorderRadius,
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  eventName: {
    color: 'black',
    fontSize: 24,
  },
  image: {
    flex: 4,
    alignItems: 'flex-start',
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

function EventItem({ event, category }) {
  const { dateString, hoursString } = formatEventDateTime(event);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { purchasables, ticketSegments } = useSelector(state => ({
    purchasables: state.firestore.ordered.ticketSegmentsPurchasables,
    ticketSegments: state.firestore.ordered.eventsTicketSegments,
  }));

  let eventSales;
  if (purchasables) eventSales = 0;
  purchasables
    .filter(e =>
      ticketSegments
        .filter(segment => segment.eventId === event.id)
        .map(segment => segment.purchasableId)
        .includes(e.id)
    )
    .forEach(purchasable => {
      eventSales += purchasable.sold;
    });

  const [imageHeight, setImageHeight] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);

  useEffect(() => {
    if (event.imageUrl) {
      Image.getSize(event.imageUrl, (width, height) => {
        const ratio = imageWidth / width;
        setImageHeight(height * ratio);
      });
    }
  }, [event, imageWidth]);

  function onEventPress() {
    dispatch(setSelectedEvent({ ...event, category }));
    navigation.navigate(t('eventDetails'));
  }

  return (
    <TouchableHighlight onPress={onEventPress}>
      <View style={styles.container}>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{category?.name}</Text>
        </View>
        <Text style={styles.eventDate}>{`${dateString} ${hoursString}`}</Text>
        <Text style={styles.eventName}>{event?.name}</Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'space-between',
          }}
        >
          <Text style={[styles.location, { flex: 1 }]}>
            {event.location.description}
          </Text>
          {!event.imageUrl && (
            <View
              style={{
                flexDirection: 'row',
                display: 'flex',
                alignItems: 'center',
                flex: 0,
              }}
            >
              <Text style={styles.location}>{t('ticketsSold')}: </Text>
              {eventSales !== undefined ? (
                <Text style={[styles.location, { opacity: 1 }]}>
                  {eventSales}
                </Text>
              ) : (
                <ActivityIndicator
                  color={PinkPrimary}
                  size={14}
                  style={{ paddingLeft: 10 }}
                />
              )}
            </View>
          )}
        </View>
        {event.imageUrl && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              paddingTop: 10,
            }}
          >
            <Image
              source={{ uri: event.imageUrl }}
              style={[styles.image, { width: imageWidth, height: imageHeight }]}
              resizeMode="contain"
              resizeMethod="scale"
              onLayout={e => {
                setImageWidth(e.nativeEvent.layout.width);
              }}
            />
            <View
              style={{
                flex: 6,
                paddingLeft: 10,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <Text style={styles.location}>{t('ticketsSold')}: </Text>
                {eventSales !== undefined ? (
                  <Text style={[styles.location, { opacity: 1 }]}>
                    {eventSales}
                  </Text>
                ) : (
                  <ActivityIndicator
                    color={PinkPrimary}
                    size={14}
                    style={{ paddingLeft: 10 }}
                  />
                )}
              </View>
            </View>
          </View>
        )}
      </View>
    </TouchableHighlight>
  );
}

EventItem.propTypes = {
  event: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
};

export default EventItem;
