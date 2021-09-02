import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import { PinkPrimary } from '../../assets/Colors';
import commonStyles from '../../assets/commonStyles';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  counter: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  line: {
    backgroundColor: PinkPrimary,
    flexGrow: 1,
    height: 1,
  },
  eventsCount: {
    paddingHorizontal: 10,
  },
});

function FilterBar({ left, right, text }) {
  return (
    <View style={styles.container}>
      <View style={styles.counter}>
        <View style={styles.line} />
        <Text style={styles.eventsCount}>{text}</Text>
        <View style={styles.line} />
      </View>
      <View style={commonStyles.rowSpaceBetween}>
        {left}
        {right}
      </View>
    </View>
  );
}

FilterBar.defaultProps = {
  left: undefined,
  right: undefined,
};

FilterBar.propTypes = {
  left: PropTypes.element,
  right: PropTypes.element,
  text: PropTypes.string.isRequired,
};

export default FilterBar;
