import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, FlatList, TextInput, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import Colours from '../Colours'
import MessageCard from './MessageCard';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

function Messages(): JSX.Element {

    const current_uid = auth().currentUser.uid
    const [chats, setChats] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [searchedUsers, setSearchedUsers] = useState([]);

    useEffect(() => {
        if (searchInput.trim() === '') {
            return;
        }
        const usersRef = database().ref('/users');
        const userListener = usersRef.on('value', (snapshot) => {
            const matchedUsers = [];
            snapshot.forEach((userSnapshot) => {
                const user = userSnapshot.val();
                if (user.displayName.toLowerCase().includes(searchInput.toLowerCase())) {
                    matchedUsers.push({ displayName: user.displayName, uid: userSnapshot.key, profilePic: user.profilePicture });
                }
            });
            setSearchedUsers(matchedUsers);
        });

        // Clean up the listener when the component unmounts
        return () => {
            usersRef.off('value', userListener);
        };
    }, [searchInput]);

    useEffect(() => {
        const messagesRreference = database()
            .ref('/messages/');

        messagesRreference.on('value', async (snapshot) => {
            const updatedChats = [];

            snapshot.forEach((childSnapshot) => {
                const halfIndex = Math.floor(childSnapshot.key.length / 2);

                const firstHalf = childSnapshot.key.substring(0, halfIndex);
                const secondHalf = childSnapshot.key.substring(halfIndex);
                if (current_uid === firstHalf) {
                    updatedChats.push(secondHalf);
                } else if (current_uid === secondHalf) {
                    updatedChats.push(firstHalf);
                }
            })

            setChats(updatedChats);
        });
    }, [current_uid]);

    return (
        <View style={styles.container}>
            <FlatList
                ListHeaderComponent={<Text style={styles.header}>Messages</Text>}
                data={chats}
                renderItem={({ item }) =>
                    <View style={{ marginBottom: 10 }}>
                        <MessageCard key={item} secondUserID={item} />
                    </View>
                }
                keyExtractor={(item) => item}
            />
            {searchInput.length > 0 &&
                <View style={styles.searchedUsersContainer}>
                    <FlatList
                        style={styles.searchedUsersList}
                        data={searchedUsers}
                        renderItem={({ item, index }) => (
                            <>
                                <MessageCard key={item.uid} secondUserID={item.uid} />
                                {index < searchedUsers.length - 1 && <View style={styles.hr} />}
                            </>
                        )}
                        keyExtractor={(item) => item.uid}
                    />
                </View>
            }
            <TextInput
                style={styles.userSearch}
                placeholder='Search...'
                placeholderTextColor={Colours.text}
                onChangeText={(input) => setSearchInput(input)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colours.background,
        height: '100%',
        padding: 10,
    },
    header: {
        color: Colours.text,
        fontSize: 32,
        marginTop: 20,
        marginBottom: 30,
        textAlign: 'center',
    },
    userSearch: {
        width: '100%',
        backgroundColor: Colours.primary,
        borderRadius: 10,
        fontSize: 20,
        color: Colours.text
    },
    searchedUsersContainer: {
        width: '100%',
        maxHeight: '90%',
        backgroundColor: Colours.background,
        marginBottom: 10,
        borderRadius: 10,
        padding: 10,
        borderWidth: 5,
        borderColor: Colours.primary
    },
    hr: {
        borderColor: Colours.primary,
        borderWidth: 1,
        width: '95%',
        marginVertical: 10,
        alignSelf: 'center'
    },
});

export default Messages;