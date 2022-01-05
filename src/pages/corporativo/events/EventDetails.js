import { useRoute } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

function EventDetails() {
  const route = useRoute();

  const { event } = route.params;

  return (
    <View>
      <Text>{event.name}</Text>
    </View>
  );
}

export default EventDetails;
