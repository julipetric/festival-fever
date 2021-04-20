/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useController } from 'react-hook-form';
import { TextInput } from 'react-native-paper';
import PropTypes from 'prop-types';

export default function FormTextInput({
  name,
  control,
  placeholder,
  style,
  defaultValue,
  label,
  error,
  mode,
  autoCapitalize,
  autoCompleteType,
  autoFocus,
  autoCorrect,
  right,
  ...props
}) {
  const { field } = useController({ control, defaultValue, name });
  return (
    <TextInput
      autoCapitalize={autoCapitalize}
      mode={mode}
      label={label}
      error={error}
      onChangeText={field.onChange}
      style={style}
      value={field.value}
      placeholder={placeholder}
      autoFocus={autoFocus}
      autoCorrect={autoCorrect}
      autoCompleteType={autoCompleteType}
      right={right}
      {...props}
    />
  );
}

FormTextInput.defaultProps = {
  placeholder: undefined,
  style: {},
  defaultValue: undefined,
  label: undefined,
  error: false,
  mode: 'flat',
  autoCapitalize: 'sentences',
  autoFocus: false,
  autoCorrect: false,
  autoCompleteType: undefined,
  right: undefined,
};

FormTextInput.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  defaultValue: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.bool,
  mode: PropTypes.oneOf(['flat', 'outlined']),
  autoCapitalize: PropTypes.string,
  autoFocus: PropTypes.bool,
  autoCorrect: PropTypes.bool,
  autoCompleteType: PropTypes.string,
  right: PropTypes.element,
};
