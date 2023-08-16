import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, FlatList, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import Colours from '../Colours'
import MessageCard from './MessageCard';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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

    const [showSearchBar, setShowSearchBar] = useState(false)

    const handleCloseSearch = () => {
        setShowSearchBar(false);
        setSearchInput('')
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <FlatList
                ListHeaderComponent={
                    !showSearchBar ?
                        <View style={styles.listHeader}>
                            <Text style={styles.title}>
                                Messages
                            </Text>
                            <TouchableOpacity onPress={() => setShowSearchBar(true)}>
                                <FontAwesome name={'plus'} size={35} color={Colours.text} />
                            </TouchableOpacity>
                        </View>
                        :
                        <>
                            <View style={styles.listHeader}>
                                <TouchableOpacity onPress={handleCloseSearch}>
                                    <FontAwesome name={'arrow-left'} size={35} color={Colours.text} />
                                </TouchableOpacity>
                                <TextInput
                                    style={[styles.title, { textAlign: 'right' }]}
                                    placeholder='Search user...'
                                    placeholderTextColor={Colours.text}
                                    onChangeText={(input) => setSearchInput(input)}
                                />
                            </View>
                            {searchInput.length > 0 &&
                                <View style={styles.searchedUsersContainer}>
                                    <Text style={[styles.title, { marginTop: 0, marginBottom: 10 }]}>Search:</Text>
                                    <FlatList
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
                        </>
                }
                data={chats}
                renderItem={({ item }) =>
                    <>
                        {!showSearchBar &&
                            <View style={{ marginBottom: 10 }}>
                                <MessageCard key={item} secondUserID={item} />
                            </View>
                        }
                    </>
                }
                keyExtractor={(item) => item}
            />
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colours.background,
        height: '100%',
        padding: 10,
    },
    listHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        lineHeight: 32,
    },
    title: {
        color: Colours.text,
        fontSize: 32,
        marginTop: 20,
        marginBottom: 30,
        padding: 0,
    },
    userSearch: {
        marginTop: 20,
        marginBottom: 30,
        marginLeft: 10,
        borderRadius: 10,
        fontSize: 32,
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
    }
});

export default Messages;