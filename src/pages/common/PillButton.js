import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import { Text } from 'react-native-paper';
import { PinkPrimary } from '../../assets/Colors';

const styles = StyleSheet.create({
  filterButton: {
    backgroundColor: PinkPrimary,
    paddingVertical: 3,
    paddingHorizontal: 9,
    marginHorizontal: 3,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

function PillButton({ text, selected, onPress, element }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.filterButton, { opacity: selected ? 1 : 0.3 }]}
    >
      <View style={styles.content}>
        {text && <Text style={{ marginRight: 5 }}>{text}</Text>}
        {element}
      </View>
    </TouchableOpacity>
  );
}

PillButton.defaultProps = {
  text: undefined,
  selected: false,
  onPress: () => {},
  element: undefined,
};

PillButton.propTypes = {
  text: PropTypes.string,
  selected: PropTypes.bool,
  onPress: PropTypes.func,
  element: PropTypes.element,
};

export default PillButton;
