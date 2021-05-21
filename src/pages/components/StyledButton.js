/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    paddingHorizontal: 20,
  },
});

export default function StyledButton({
  children,
  mode,
  style,
  onPress,
  disabled,
  ...props
}) {
  return (
    <View style={styles.container}>
      <Button
        {...props}
        mode={mode}
        style={[styles.button, style]}
        onPress={onPress}
        disabled={disabled}
      >
        {children}
      </Button>
    </View>
  );
}

StyledButton.defaultProps = {
  mode: 'text',
  style: {},
  onPress: () => {},
  disabled: false,
};

StyledButton.propTypes = {
  children: PropTypes.any.isRequired,
  mode: PropTypes.oneOf(['text', 'outlined', 'contained']),
  style: PropTypes.object,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
};
