/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { useController } from 'react-hook-form';
import { Checkbox, useTheme } from 'react-native-paper';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import theme from '../../assets/theme';

export default function FormCheckbox({
  name,
  control,
  defaultValue,
  label,
  ...props
}) {
  const { field, fieldState } = useController({ control, defaultValue, name });

  const [checked, setChecked] = useState(defaultValue);

  return (
    <View
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
    >
      <Checkbox
        theme={theme}
        label={label}
        error={fieldState.error}
        onPress={() => {
          setChecked(!checked);
          field.onChange();
        }}
        status={checked ? 'checked' : 'unchecked'}
        {...props}
      />
      <Text style={{ color: theme.colors.text }}>{label}</Text>
    </View>
  );
}

FormCheckbox.defaultProps = {
  defaultValue: undefined,
  label: undefined,
};

FormCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  defaultValue: PropTypes.bool,
  label: PropTypes.string,
};
