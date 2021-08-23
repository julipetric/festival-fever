import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { IconButton } from 'react-native-paper';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import moment from 'moment';
import { t } from 'i18n-js';
import { PinkPrimary } from '../../../../../assets/Colors';
import StyledButton from '../../../../components/StyledButton';

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
    padding: 10,
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
  buttonsContainer: {
    alignItems: 'center',
  },
});

function CircleButton({ children }) {
  return <View style={styles.buttonContainer}>{children}</View>;
}

CircleButton.propTypes = {
  children: PropTypes.element.isRequired,
};

function EventCardView({ item }) {
  const event = item;

  return (
    <View key={event.id} style={styles.card}>
      <ImageBackground style={styles.imageContainer} source={item.image}>
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
          <View style={{ display: 'flex' }}>
            {event.dates.length === 1 && (
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.eventDate}>
                  {moment(event.dates[0].start).format(
                    `dddd D [${t('of')}] MMMM`
                  )}
                </Text>
                <Text style={styles.eventTime}>
                  {`${moment(event.dates[0].start).format(`HH:mm`)} - ${moment(
                    event.dates[0].end
                  ).format(`HH:mm`)}`}
                </Text>
              </View>
            )}
            <Text style={styles.eventName}>{event.name}</Text>
            <Text style={styles.eventTime}>{event.location.description}</Text>
            <Text style={styles.eventTime}>{event.location.address}</Text>
          </View>
          <View style={styles.buttonsContainer}>
            <StyledButton mode="contained" label={t('getTickets')} />
            <StyledButton mode="outlined" label={t('moreInformation')} />
          </View>
        </View>
      </View>
    </View>
  );
}

EventCardView.propTypes = {
  item: PropTypes.object.isRequired,
};

export default EventCardView;
