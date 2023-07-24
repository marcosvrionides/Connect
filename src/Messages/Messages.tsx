import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import Colours from '../Colours'
import MessageCard from './MessageCard';
import { firebase } from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth'
import { ReactNativeFirebase } from '@react-native-firebase/app';

function Messages(): JSX.Element {

    const current_uid = auth().currentUser.uid
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const messagesRreference = firebase
            .app()
            .database('https://studentsthoughtsfyp-default-rtdb.europe-west1.firebasedatabase.app/')
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
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Messages</Text>
            {chats.map((chat, index) => (
                <MessageCard key={index} secondUserID={chat} />
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colours.background,
        height: '100%',
    },
    header: {
        color: Colours.text,
        fontSize: 32,
        margin: 20,
        textAlign: 'center',
    },
});

export default Messages;