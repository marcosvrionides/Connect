import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput } from 'react-native';
import Colours from '../Colours'
import MessageCard from './MessageCard';

function Messages(): JSX.Element {

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Messages</Text>
            <MessageCard />
            <MessageCard />
            <MessageCard />
            <MessageCard />
            <MessageCard />
            <MessageCard />
            <MessageCard />
            <MessageCard />
            <MessageCard />
            <MessageCard />
            <MessageCard />
            <MessageCard />
            <MessageCard />
            <MessageCard />
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