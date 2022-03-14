import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Title } from 'react-native-paper';
import PropTypes from 'prop-types';
import { LinearGradient } from 'expo-linear-gradient';
import {
  TabActions,
  useNavigation,
  useNavigationState,
} from '@react-navigation/native';
import { t } from 'i18n-js';
import { GradientEnd, GradientStart } from '../../assets/Colors';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  buttonContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 100,
    margin: 0,
    padding: 0,
    marginLeft: 7,
  },
});

function HeaderButton({ children }) {
  return <View style={styles.buttonContainer}>{children}</View>;
}

HeaderButton.propTypes = {
  children: PropTypes.element.isRequired,
};

export default function FestivalFeverHeader({ corporativo }) {
  const navigation = useNavigation();

  const tabIndex = useNavigationState(
    state =>
      state.routes &&
      state.routes[0] &&
      state.routes[0].state &&
      state.routes[0].state.index
  );

  return (
    <LinearGradient
      style={styles.container}
      colors={[GradientStart, GradientEnd]}
      end={[0, 1]}
      start={[1, 0]}
    >
      <Title style={{ fontFamily: 'MADE-Evolve-Sans-Bold', fontSize: 30 }}>
        festival fever{corporativo ? ' corporativo' : ''}
      </Title>
      <View style={styles.buttonsContainer}>
        <HeaderButton>
          <IconButton
            icon={() => <FontAwesome5 name="search" size={17} color="white" />}
            onPress={() => {
              if (tabIndex !== 0)
                navigation.dispatch(TabActions.jumpTo(t('categories')));
              navigation.navigate(t('search'));
            }}
            style={{ margin: 1 }}
          />
        </HeaderButton>
        <HeaderButton>
          <IconButton
            icon={() => <Ionicons name="person" size={17} color="white" />}
            onPress={() => navigation.navigate(t('myAccount'))}
            style={{ margin: 1 }}
          />
        </HeaderButton>
      </View>
    </LinearGradient>
  );
}

FestivalFeverHeader.defaultProps = {
  corporativo: false,
};
FestivalFeverHeader.propTypes = {
  corporativo: PropTypes.bool,
};
