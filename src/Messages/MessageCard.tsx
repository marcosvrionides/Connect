import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colours from '../Colours';
import { useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

function MessageCard(props): JSX.Element {

    const navigation = useNavigation();
    const [username, setUsername] = useState('Anonymous');
    const [profilePic, setProfilePic] = useState('https://firebasestorage.googleapis.com/v0/b/studentsthoughtsfyp.appspot.com/o/default_profile_picj.jpg?alt=media&token=39c38fa6-5ac7-4e2e-a2eb-0c9157c6194b');

    const handleOpenChat = () => {
        navigation.navigate('OpenChat', { username: username, uid: props.secondUserID });
    }

    useEffect(() => {
        const usersRreference = database()
            .ref('/users/' + props.secondUserID);

        usersRreference.on('value', async (snapshot) => {
            const data = snapshot.val();
            setUsername(data.displayName)
            setProfilePic(data.profilePicture === "" ? 'https://firebasestorage.googleapis.com/v0/b/studentsthoughtsfyp.appspot.com/o/default_profile_picj.jpg?alt=media&token=39c38fa6-5ac7-4e2e-a2eb-0c9157c6194b'
                : data.profilePicture);
        });

        return () => { usersRreference.off(); }
    }, [props])

    const [lastMessage, setLastMessage] = useState(null)

    useEffect(() => {
        const uids = [auth().currentUser.uid, props.secondUserID].sort()
        const chatRef = database().ref("/messages/" + uids[0] + uids[1])
        chatRef.on('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                setLastMessage(childSnapshot.val())
            })
        })
    }, [props])

    return (
        <TouchableOpacity style={[styles.container, lastMessage && lastMessage.fromUid !== auth().currentUser.uid && lastMessage.read === 'sent' && { borderWidth: 2, borderColor: 'yellow' }]} onPress={handleOpenChat}>
            <Image
                source={{ uri: profilePic }}
                style={styles.profilePic}
            />
            <View style={styles.messageInfo}>
                <Text style={styles.sender}>{username}</Text>
                {lastMessage && <Text style={styles.messagePreview}>{lastMessage.message}</Text>}
            </View>
            {lastMessage && <Text style={styles.time}>
                {new Intl.DateTimeFormat('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                }).format(new Date(lastMessage.timestamp))}
            </Text>}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colours.accent,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
    },
    profilePic: {
        height: 60,
        width: 60,
        borderRadius: 30,
        backgroundColor: 'white'
    },
    messageInfo: {
        flex: 1,
        marginLeft: 10,
    },
    sender: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colours.text,
    },
    messagePreview: {
        fontSize: 14,
        color: Colours.text,
    },
    time: {
        fontSize: 12,
        color: Colours.text,
    },
});

export default MessageCard;
