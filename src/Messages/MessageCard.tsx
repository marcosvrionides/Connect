import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colours from '../Colours';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '@react-native-firebase/database';

function MessageCard(props): JSX.Element {

    const navigation = useNavigation();
    const [username, setUsername] = useState(null);
    const [profilePic, setProfilePic] = useState(null);

    const handleOpenChat = () => {
        navigation.navigate('OpenChat', { username: username, uid: props.secondUserID });
    }

    useEffect(() => {
        const usersRreference = firebase
            .app()
            .database('https://studentsthoughtsfyp-default-rtdb.europe-west1.firebasedatabase.app/')
            .ref('/users/' + props.secondUserID);

        usersRreference.on('value', async (snapshot) => {
            const data = snapshot.val();
            setUsername(data.displayName)
            setProfilePic(data.profilePicture === "" ? 'https://firebasestorage.googleapis.com/v0/b/studentsthoughtsfyp.appspot.com/o/default_profile_picj.jpg?alt=media&token=39c38fa6-5ac7-4e2e-a2eb-0c9157c6194b'
                : data.profilePicture);
        });

        // Clean up the listener when the component unmounts
        return () => {
            usersRreference.off();
        }
    }, [props])

    return (
        <TouchableOpacity style={styles.container} onPress={() => { handleOpenChat() }}>
            <Image
                source={{ uri: profilePic }}
                style={styles.profilePic}
            />
            <View style={styles.messageInfo}>
                <Text style={styles.sender}>{username}</Text>
                <Text style={styles.messagePreview}>Message preview</Text>
            </View>
            <Text style={styles.time}>{props.messageID} - 10:00 AM</Text>
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
        margin: 5,
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
