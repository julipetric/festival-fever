import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import FormTextInput from './FormTextInput';

export default function PasswordFormTextInput({
  name,
  control,
  mode,
  placeholder,
  style,
  defaultValue,
  autoFocus,
  label,
  error,
  defaultShowPassword,
  disabled,
}) {
  const [showPassword, setShowPassword] = useState(!!defaultShowPassword);

  return (
    <FormTextInput
      name={name}
      control={control}
      defaultValue={defaultValue}
      autoCapitalize="none"
      mode={mode}
      label={label}
      error={error}
      style={style}
      placeholder={placeholder}
      autoFocus={autoFocus}
      autoCorrect={false}
      autoCompleteType="password"
      secureTextEntry={!showPassword}
      disabled={disabled}
      right={
        <TextInput.Icon
          icon={({ size, color }) => (
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={size}
              color={color}
              style={{ opacity: disabled ? 0.5 : 1 }}
            />
          )}
          onPress={() => setShowPassword(!showPassword)}
        />
      }
    />
  );
}

PasswordFormTextInput.defaultProps = {
  placeholder: undefined,
  style: {},
  defaultValue: undefined,
  label: undefined,
  error: false,
  mode: 'flat',
  autoFocus: false,
  defaultShowPassword: false,
  disabled: false,
};

PasswordFormTextInput.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  defaultValue: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.bool,
  mode: PropTypes.oneOf(['flat', 'outlined']),
  autoFocus: PropTypes.bool,
  defaultShowPassword: PropTypes.bool,
  disabled: PropTypes.bool,
};
