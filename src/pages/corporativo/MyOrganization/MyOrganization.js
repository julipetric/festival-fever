import { Ionicons } from '@expo/vector-icons';
import { t } from 'i18n-js';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Searchbar, Text, Title } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useFirebase, useFirestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import {
  ListItemBorderRadius,
  PagePaddingHorizontal,
} from '../../../assets/UIConstants';
import StyledButton from '../../components/StyledButton';
import UserRoleModal from './UserRoleModal';
import AddOrganizationUser from './AddOrganizationUser';

const styles = StyleSheet.create({
  contentContainer: {
    width: '100%',
    paddingHorizontal: PagePaddingHorizontal,
    paddingTop: 10,
  },
  userItemContainer: {
    padding: 10,
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: ListItemBorderRadius,
    display: 'flex',
    flex: 1,
  },
});

function ListHeader({ userTypeId, setUsers, allUsers, setAddUserVisible }) {
  const [search, setSearch] = useState();
  const onSearchChange = useCallback(
    text => {
      setSearch(text);
      if (text)
        setUsers(
          [...allUsers].filter(
            user =>
              user.name?.toLowerCase().includes(text.toLowerCase()) ||
              user.lastName?.toLowerCase().includes(text.toLowerCase()) ||
              user.email?.toLowerCase().includes(text.toLowerCase())
          )
        );
      else setUsers(allUsers);
    },
    [allUsers, setUsers]
  );

  return (
    <View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 5,
        }}
      >
        <Title>{t('myOrganization')}</Title>
        {userTypeId === 2 && (
          <StyledButton
            icon={({ color }) => (
              <Ionicons name="add-circle" size={26} color={color} />
            )}
            onPress={() => {
              setAddUserVisible(true);
            }}
          >
            {t('addUser')}
          </StyledButton>
        )}
      </View>
      <Searchbar
        placeholder={`${t('searchUser')}...`}
        onChangeText={onSearchChange}
        value={search}
        style={{ marginBottom: 15 }}
      />
    </View>
  );
}

ListHeader.propTypes = {
  userTypeId: PropTypes.number.isRequired,
  setUsers: PropTypes.func.isRequired,
  allUsers: PropTypes.array.isRequired,
  setAddUserVisible: PropTypes.func.isRequired,
};

function UserItem({ item: user, setSelectedUser, disabled, currentRoles }) {
  return (
    <TouchableOpacity
      style={[styles.userItemContainer, { opacity: disabled ? 0.5 : 1 }]}
      onPress={() => setSelectedUser(user)}
      disabled={disabled}
      key={user.id}
    >
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        <Text
          style={{
            color: 'black',
            flexShrink: 1,
          }}
        >
          {user.name} {user.lastName}
        </Text>
        <Text
          style={{
            color: 'black',
            opacity: 0.6,
            paddingLeft: 5,
          }}
        >
          {user.email}
        </Text>
      </View>
      {currentRoles.map(role => (
        <Text style={{ color: 'black', opacity: 0.7 }} key={role.id}>
          {role.name}
        </Text>
      ))}
    </TouchableOpacity>
  );
}

UserItem.defaultProps = {
  disabled: false,
};

UserItem.propTypes = {
  item: PropTypes.object.isRequired,
  setSelectedUser: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  currentRoles: PropTypes.array.isRequired,
};

function MyOrganization() {
  const firebase = useFirebase();
  const { organizationRoles, organizationUsers, status } = useSelector(
    state => ({
      organizationRoles: state.firestore.ordered.organizationRoles,
      organizationUsers: state.firestore.ordered.organizationUsers,
      status: state.firestore.status,
    })
  );

  const { userRole } = useSelector(state => ({
    userRole: state.myStore?.userRole,
  }));

  const currentUserId = firebase.auth()?.currentUser?.uid;

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [addUserVisible, setAddUserVisible] = useState(false);

  useEffect(() => {
    if (status?.requested?.organizationUsers) {
      setUsers([...organizationUsers]);
    }
  }, [organizationUsers, status.requested.organizationUsers]);

  useFirestoreConnect(() => {
    const array = [
      {
        collection: 'roles',
        where: ['organizationId', '==', userRole.organizationId],
        storeAs: 'organizationRoles',
      },
    ];
    if (organizationRoles)
      array.push({
        collection: 'users',
        where: [
          'roles',
          'array-contains-any',
          organizationRoles.map(e => e.id),
        ],
        storeAs: 'organizationUsers',
      });
    return array;
  });

  return organizationRoles && organizationUsers ? (
    <>
      <FlatList
        contentContainerStyle={styles.contentContainer}
        data={orderBy(
          users,
          ['name', 'lastName', 'email'],
          ['asc', 'asc', 'asc']
        )}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <ListHeader
            userTypeId={userRole?.userTypeId}
            setUsers={setUsers}
            allUsers={organizationUsers}
            setAddUserVisible={setAddUserVisible}
          />
        }
        renderItem={({ item }) => (
          <UserItem
            item={item}
            setSelectedUser={setSelectedUser}
            disabled={currentUserId === item.id}
            currentRoles={organizationRoles.filter(role =>
              item.roles.some(e => e === role.id)
            )}
          />
        )}
      />
      <UserRoleModal user={selectedUser} setSelectedUser={setSelectedUser} />
      <AddOrganizationUser
        visible={addUserVisible}
        setVisible={setAddUserVisible}
      />
    </>
  ) : (
    <ActivityIndicator style={{ flex: 1 }} />
  );
}

export default MyOrganization;
