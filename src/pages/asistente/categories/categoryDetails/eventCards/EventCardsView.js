import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { IconButton } from 'react-native-paper';
import { FontAwesome5, Feather } from '@expo/vector-icons';

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 4,
    display: 'flex',
    height: '80%',
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
        <Text>{event.name}</Text>
      </View>
    </View>
  );
}

EventCardView.propTypes = {
  item: PropTypes.object.isRequired,
};

export default EventCardView;
