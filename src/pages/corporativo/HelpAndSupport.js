import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Menu } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { t } from 'i18n-js';
import FormTextInput from '../components/FormTextInput';
import StyledButton from '../components/StyledButton';

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingVertical: 10 },
  inputArea: { flex: 1 },
});

function HelpAndSupport() {
  const [menuVisible, setMenuVisible] = useState(false);

  const { control } = useForm();

  return (
    <View style={styles.container}>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <>
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <FormTextInput
                name="subject"
                control={control}
                label={t('subject')}
                editable={false}
              />
            </TouchableOpacity>
          </>
        }
      >
        <Menu.Item title={t('help')} />
        <Menu.Item title={t('salesReportAndWithdrawal')} />
      </Menu>
      <FormTextInput
        style={styles.inputArea}
        multiline
        control={control}
        name="message"
        placeholder={t('typeYourMessageHere')}
      />
      <StyledButton label={t('submit')} mode="contained" />
    </View>
  );
}

export default HelpAndSupport;
