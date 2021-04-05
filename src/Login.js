import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { t } from 'i18n-js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function Login() {
  return (
    <View style={styles.container}>
      <Text>{t('login')}</Text>
    </View>
  );
}

export default Login;
