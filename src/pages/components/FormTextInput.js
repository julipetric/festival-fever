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
}) {
  const { field } = useController({ control, defaultValue, name });
  return (
    <TextInput
      label={label}
      error={error}
      onChangeText={field.onChange}
      style={style}
      value={field.value}
      placeholder={placeholder}
    />
  );
}

FormTextInput.defaultProps = {
  placeholder: undefined,
  style: {},
  defaultValue: undefined,
  label: undefined,
  error: false,
};

FormTextInput.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  defaultValue: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.bool,
};
