import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableHighlight, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import { t } from 'i18n-js';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { PinkPrimary, PurplePill } from '../../../assets/Colors';
import { formatEventDateTime } from '../../../utils';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
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
    backgroundColor: 'blue',
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

  const { ticketSegments: allTicketSegments, orders: allOrders } = useSelector(
    state => ({
      ticketSegments: state.firestore.ordered.ticketSegments,
      orders: state.firestore.ordered.orders,
    })
  );

  const eventTicketSegments = allTicketSegments
    ? allTicketSegments.filter(segment => segment.eventId === event.id)
    : undefined;

  const eventSales =
    allOrders && allTicketSegments
      ? allOrders.filter(order =>
          eventTicketSegments
            .map(segment => segment.purchasableId)
            .includes(order.purchasableId)
        ).length
      : undefined;

  const [imageHeight, setImageHeight] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);

  useEffect(() => {
    Image.getSize(event.imageUrl, (width, height) => {
      const ratio = imageWidth / width;
      setImageHeight(height * ratio);
    });
  }, [event, imageWidth]);

  function onEventPress() {
    navigation.navigate(t('eventDetails'), { event });
  }

  return (
    <TouchableHighlight onPress={onEventPress}>
      <View style={styles.container}>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{category.name}</Text>
        </View>
        <Text style={styles.eventDate}>{`${dateString} ${hoursString}`}</Text>
        <Text style={styles.eventName}>{event.name}</Text>
        <Text style={styles.location}>{event.location.description}</Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingTop: 10,
          }}
        >
          <Image
            source={{ uri: event.imageUrl }}
            style={[styles.image, { width: imageWidth, height: imageHeight }]}
            resizeMode="contain"
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
      </View>
    </TouchableHighlight>
  );
}

EventItem.propTypes = {
  event: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
};

export default EventItem;
