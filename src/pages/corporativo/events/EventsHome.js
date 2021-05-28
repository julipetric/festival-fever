import { Ionicons } from '@expo/vector-icons';
import { t } from 'i18n-js';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Title } from 'react-native-paper';
import PropTypes from 'prop-types';
import { StackNavigationProp } from '@react-navigation/stack';
import StyledButton from '../../components/StyledButton';

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 30,
  },
});

function EventsHome({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Title>{t('myEvents')}</Title>
        <StyledButton
          icon={({ color }) => (
            <Ionicons name="add-circle" size={26} color={color} />
          )}
          onPress={() => navigation.push(t('addEvent'))}
        >
          {t('addEvent')}
        </StyledButton>
      </View>
    </ScrollView>
  );
}

EventsHome.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default EventsHome;
