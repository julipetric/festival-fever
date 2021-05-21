/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useController } from 'react-hook-form';
import { HelperText, TextInput } from 'react-native-paper';
import PropTypes from 'prop-types';

export default function FormTextInput({
  name,
  control,
  placeholder,
  style,
  defaultValue,
  label,
  mode,
  autoCapitalize,
  autoCompleteType,
  autoFocus,
  autoCorrect,
  right,
  hideHelperText,
  helperTextType,
  ...props
}) {
  const { field, fieldState } = useController({ control, defaultValue, name });

  return (
    <>
      <TextInput
        autoCapitalize={autoCapitalize}
        mode={mode}
        label={label}
        error={fieldState.error}
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
      {!hideHelperText && (
        <HelperText visible={fieldState.error} type={helperTextType}>
          {fieldState.error && fieldState.error.message}
        </HelperText>
      )}
    </>
  );
}

FormTextInput.defaultProps = {
  placeholder: undefined,
  style: {},
  defaultValue: undefined,
  label: undefined,
  mode: 'flat',
  autoCapitalize: 'sentences',
  autoFocus: false,
  autoCorrect: false,
  autoCompleteType: undefined,
  right: undefined,
  hideHelperText: false,
  helperTextType: 'error',
};

FormTextInput.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  defaultValue: PropTypes.string,
  label: PropTypes.string,
  mode: PropTypes.oneOf(['flat', 'outlined']),
  autoCapitalize: PropTypes.string,
  autoFocus: PropTypes.bool,
  autoCorrect: PropTypes.bool,
  autoCompleteType: PropTypes.string,
  right: PropTypes.element,
  hideHelperText: PropTypes.bool,
  helperTextType: PropTypes.oneOf(['error', 'info']),
};
