import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput } from 'react-native';
import Colours from '../Colours'
import MessageCard from './MessageCard';

function Messages(): JSX.Element {

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Messages</Text>
            <MessageCard messageID={1} />
            <MessageCard messageID={2} />
            <MessageCard messageID={3} />
            <MessageCard messageID={4} />
            <MessageCard messageID={5} />
            <MessageCard messageID={6} />
            <MessageCard messageID={7} />
            <MessageCard messageID={8} />
            <MessageCard messageID={9} />
            <MessageCard messageID={0} />
            <MessageCard messageID={10} />
            <MessageCard messageID={11} />
            <MessageCard messageID={12} />
            <MessageCard messageID={13} />
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