import { FontAwesome } from '@expo/vector-icons';
import { t } from 'i18n-js';
import React from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { PinkPrimary } from '../../assets/Colors';
import { themeBlackText } from '../../assets/theme';
import FormTextInput from '../components/FormTextInput';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 65,
  },
  title: {
    fontSize: 42,
    fontFamily: 'MADE-Evolve-Sans-Bold',
    color: 'white',
  },
  searchField: {
    backgroundColor: 'white',
    color: 'red',
  },
  labelText: {
    fontSize: 12,
    color: PinkPrimary,
  },
});

function SearchScreen() {
  const { control } = useForm();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('search')}</Text>
      <FormTextInput
        control={control}
        style={styles.searchField}
        right={
          <TextInput.Icon
            icon={() => <FontAwesome name="search" size={24} color="black" />}
            color="black"
          />
        }
        hideHelperText
        theme={themeBlackText}
      />
      <Text style={styles.labelText}>{t('nameOrDescriptionOfEvent')}</Text>
    </View>
  );
}

export default SearchScreen;
