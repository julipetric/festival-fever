import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import { Text } from 'react-native-paper';
import { uniqueId } from 'lodash';
import { PinkPrimary } from '../../assets/Colors';

const styles = StyleSheet.create({
  filterButton: {
    backgroundColor: PinkPrimary,
    paddingVertical: 2,
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
    <View
      style={[styles.filterButton, { opacity: selected ? 1 : 0.3 }]}
      key={text || uniqueId()}
    >
      <TouchableOpacity onPress={onPress}>
        <View style={styles.content}>
          {text && <Text style={{ fontSize: 12 }}>{text}</Text>}
          {element && text && <View style={{ width: 5 }} />}
          {element}
        </View>
      </TouchableOpacity>
    </View>
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
