/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { useController } from 'react-hook-form';
import { Checkbox } from 'react-native-paper';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import theme from '../../assets/theme';

export default function FormCheckbox({
  name,
  control,
  defaultValue,
  label,
  disabled,
  ...props
}) {
  const { field, fieldState } = useController({ control, defaultValue, name });

  const [checked, setChecked] = useState(defaultValue);

  return (
    <View
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
    >
      <Checkbox
        testID={name}
        theme={theme}
        label={label}
        error={fieldState.error}
        onPress={() => {
          setChecked(!checked);
          field.onChange(!checked);
        }}
        status={checked ? 'checked' : 'unchecked'}
        disabled={disabled}
        {...props}
      />
      <Text style={{ color: theme.colors.text, opacity: disabled ? 0.5 : 1 }}>
        {label}
      </Text>
    </View>
  );
}

FormCheckbox.defaultProps = {
  defaultValue: undefined,
  label: undefined,
  disabled: false,
};

FormCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  defaultValue: PropTypes.bool,
  label: PropTypes.string,
  disabled: PropTypes.bool,
};
