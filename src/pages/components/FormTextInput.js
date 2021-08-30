/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useController } from 'react-hook-form';
import { HelperText, TextInput } from 'react-native-paper';
import PropTypes from 'prop-types';
import { BackgroundGray } from '../../assets/Colors';

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
  multiline,
  keyboardType,
  disabled,
  editable,
  valueGetter,
  left,
  maxLength,
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
        style={{ backgroundColor: BackgroundGray, ...style }}
        value={valueGetter ? valueGetter(field.value) : field.value}
        left={left}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoCorrect={autoCorrect}
        autoCompleteType={autoCompleteType}
        right={right}
        multiline={multiline}
        keyboardType={keyboardType}
        disabled={disabled}
        editable={editable}
        maxLength={maxLength}
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
  multiline: false,
  keyboardType: undefined,
  disabled: false,
  editable: true,
  valueGetter: undefined,
  left: undefined,
  maxLength: undefined,
};

FormTextInput.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  defaultValue: PropTypes.string,
  label: PropTypes.string,
  mode: PropTypes.oneOf(['flat', 'outlined']),
  autoCapitalize: PropTypes.oneOf(['characters', 'words', 'sentences', 'none']),
  autoFocus: PropTypes.bool,
  autoCorrect: PropTypes.bool,
  autoCompleteType: PropTypes.string,
  right: PropTypes.element,
  hideHelperText: PropTypes.bool,
  helperTextType: PropTypes.oneOf(['error', 'info']),
  multiline: PropTypes.bool,
  maxLength: PropTypes.number,
  keyboardType: PropTypes.string,
  disabled: PropTypes.bool,
  editable: PropTypes.bool,
  valueGetter: PropTypes.func,
  left: PropTypes.element,
};
