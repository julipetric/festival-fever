import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';
import DefaultBackground from './DefaultBackground';
import { setValidSession } from './redux/slices/userSlice';

function Splash({ validSession, setValidSessionConnect }) {
  useEffect(() => {
    setValidSessionConnect(false);
  }, [setValidSessionConnect]);

  return (
    <DefaultBackground>
      {validSession ? (
        <View>
          <Text>Hello world!</Text>
        </View>
      ) : (
        <View>
          <Text>Goodbye world!</Text>
        </View>
      )}
    </DefaultBackground>
  );
}

Splash.propTypes = {
  validSession: PropTypes.bool.isRequired,
  setValidSessionConnect: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  validSession: state.user.validSession,
});

const mapDispatchToProps = {
  setValidSessionConnect: setValidSession,
};

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
