import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ToggleButton } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { t } from 'i18n-js';
import { useSelector } from 'react-redux';
import UserRegisterSchema from '../../../schemas/UserRegisterSchema';
import StyledButton from '../../components/StyledButton';
import FormTextInput from '../../components/FormTextInput';

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#1A1C28',
  },
  userRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 16,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 16,
    backgroundColor: '#20222D',
  },
  userImage: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 13,
    marginLeft: 5,
    color: 'gray',
    fontWeight: '500',
    paddingTop: 8,
    paddingBottom: 2,
  },
});

function PersonalInformation() {
  const [selectedGenre, setSelectedGenre] = React.useState('h');

  const { profile } = useSelector(state => ({
    profile: state.firebase.profile,
  }));

  const { control, handleSubmit, formState } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: UserRegisterSchema,
    defaultValues: profile,
  });

  function onSubmit(values) {
    console.log(values.name);
  }

  return (
    <ScrollView style={styles.scroll}>
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 10,
        }}
      >
        <FormTextInput
          label={t('name')}
          name="name"
          placeholder={t('name')}
          control={control}
          style={{ backgroundColor: '#1A1C28' }}
          mode="outlined"
        />
        <FormTextInput
          label={t('lastName')}
          name="lastName"
          placeholder="Apellido"
          control={control}
          style={{ backgroundColor: '#1A1C28' }}
          mode="outlined"
        />
        <FormTextInput
          label={t('email')}
          name="email"
          disabled
          defaultValue="ajosdwoajd@aowidfma.com"
          control={control}
          style={{ backgroundColor: '#1A1C28' }}
          mode="outlined"
        />
        <Text style={styles.infoText}>{t('genre')}</Text>
        <View style={{}}>
          <ToggleButton.Row
            onValueChange={value => setSelectedGenre(value)}
            value={selectedGenre}
            style={{ alignSelf: 'center', marginVertical: 4 }}
          >
            <ToggleButton icon="gender-male" value="h" />
            <ToggleButton icon="gender-female" value="m" />
            <ToggleButton icon="gender-male-female" value="t" />
          </ToggleButton.Row>
        </View>
        <StyledButton
          label={t('save')}
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          disabled={!formState.isValid}
          style={{ marginTop: 14 }}
        />
      </View>
    </ScrollView>
  );
}

export default PersonalInformation;
