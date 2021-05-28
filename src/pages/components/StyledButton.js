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
  icon,
  ...props
}) {
  return (
    <View style={styles.container}>
      <Button
        {...props}
        mode={mode}
        style={[styles.button, icon ? { paddingHorizontal: 5 } : {}, style]}
        onPress={onPress}
        disabled={disabled}
        icon={icon}
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
  icon: undefined,
};

StyledButton.propTypes = {
  children: PropTypes.any.isRequired,
  mode: PropTypes.oneOf(['text', 'outlined', 'contained']),
  style: PropTypes.object,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  icon: PropTypes.func,
};
