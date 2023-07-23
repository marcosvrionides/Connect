import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colours from '../Colours';
import { useNavigation } from '@react-navigation/native';

function MessageCard(props): JSX.Element {

    const navigation = useNavigation();

    const handleOpenChat = () => {
        navigation.navigate('OpenChat', { messageID: props.messageID });
    }

    return (
        <TouchableOpacity style={styles.container} onPress={() => { handleOpenChat('messageID') }}>
            <Image
                source={{ uri: 'https://example.com/profile-image.jpg' }} // Replace with the actual profile picture URL
                style={styles.profilePic}
            />
            <View style={styles.messageInfo}>
                <Text style={styles.sender}>Sender Username</Text>
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
        marginBottom: 5
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
        color: Colours.primary,
    },
    messagePreview: {
        fontSize: 14,
        color: Colours.primary,
    },
    time: {
        fontSize: 12,
        color: Colours.primary,
    },
});

export default MessageCard;
