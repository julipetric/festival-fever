import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 100,
    margin: 0,
    padding: 0,
    marginLeft: 7,
  },
});

function HeaderButton({ children }) {
  return <View style={styles.buttonContainer}>{children}</View>;
}

HeaderButton.propTypes = {
  children: PropTypes.element.isRequired,
};

export default HeaderButton;
