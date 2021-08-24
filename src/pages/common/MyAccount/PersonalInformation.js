import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar, TextInput, ToggleButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#20222D',
  },
  userRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 16,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 16,
  },
  userImage: {
    marginRight: 12,
  },
  infoTextContainer: {
    backgroundColor: '#1A1C28',
    paddingBottom: 6,
  },
  infoText: {
    fontSize: 13,
    marginLeft: 20,
    color: 'gray',
    fontWeight: '500',
    paddingTop: 16,
    paddingBottom: 0
  },
});

function InfoText({ text }) {
  return (
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}
function PersonalInformation({ route, navigation }) {
  const avatar = route.params.avatar;
  const address = route.params.address;
  const [firstName, setFirstname] = React.useState(route.params.name.split(' ')[0]);
  const [lastName, setLastname] = React.useState(route.params.name.split(' ')[1]);
  const email = 'user@example.com';
  const [phone, setPhone] = React.useState('+54 3492 414014');
  const [selectedSex, setSelectedSex] = React.useState('h');

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.userRow}>
        <View style={styles.userImage}>
          <Avatar.Image rounded size={90} source={{ uri: avatar }} />
        </View>
        <View>
          <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
            {firstName} {lastName}
          </Text>
          <Text style={{ color: 'white', fontSize: 14 }}>
            {address.city}, {address.country}{' '}
            <MaterialCommunityIcons
              name="map-marker"
              size={14}
              color="#F936CC"
            />
          </Text>
        </View>
      </View>

      <InfoText text="Nombre" />
      <View style={styles.infoTextContainer}>
        <TextInput style={{ paddingLeft: 16, paddingRight: 16}}
          value={firstName}
          onChangeText={firstName => setFirstname(firstName)}
          mode="outlined"
          placeholder="Nombre"
          maxLength={10}
          type="default"
        />
      </View>

      <InfoText text="Apellido" />
      <View style={styles.infoTextContainer}>
        <TextInput style={{ paddingLeft: 16, paddingRight: 16}}
          value={lastName}
          onChangeText={lastName => setLastname(lastName)}
          mode="outlined"
          placeholder="Apellido"
          maxLength={12}
          type="default"
        />
      </View>

      <InfoText text="Correo Electrónico" />
      <View style={styles.infoTextContainer}>
        <TextInput style={{ paddingLeft: 16, paddingRight: 16}}
          value={email}
          editable={false}
          mode="outlined"
          placeholder="Correo Electrónico"
        />
      </View>

      <InfoText text="Teléfono" />
      <View style={styles.infoTextContainer}>
        <TextInput style={{ paddingLeft: 16, paddingRight: 16}}
          value={phone}
          onChangeText={phone => setPhone(phone)}
          mode="outlined"
          placeholder="Teléfono"
          keyboardType="number-pad"
        />
      </View>

      <InfoText text="Sexo" />
      <View style={styles.infoTextContainer}>
        <ToggleButton.Row onValueChange={selectedSex => setSelectedSex(selectedSex)} value={selectedSex} style={{alignSelf: 'center'}}>
          <ToggleButton icon="gender-male" value="h" />
          <ToggleButton icon="gender-female" value="m" />
          <ToggleButton icon="gender-male-female" value="t" />
        </ToggleButton.Row>
      </View>
    </ScrollView>
  );
}

export default PersonalInformation;
