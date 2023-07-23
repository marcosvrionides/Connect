import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import Colours from '../Colours';

const OpenChat = ({ route }) => {
    const messageID = route.params.messageID

    const [messages, setMessages] = useState(
        [
            { text: "hello", sender: 'user' },
            { text: "how are you?", sender: 'friend' },
            { text: "I'm good thanks!", sender: 'user' },
            { text: "how are you?", sender: 'user' },
            { text: "I'm doing well too, thank you!", sender: 'friend' },
            { text: "It's been a busy day for me, but I'm glad to chat with you.", sender: 'friend' },
            { text: "What have you been up to?", sender: 'friend' },
            { text: "I had a great weekend with my family. We went hiking and had a picnic.", sender: 'user' },
            { text: "That sounds lovely! I'm glad you had a good time.", sender: 'friend' },
            { text: "I wish I could have joined you on that hike.", sender: 'friend' },
            { text: "Don't worry, we'll plan another outing soon and you can join us!", sender: 'user' },
            { text: "That would be fantastic! Let me know when you have something in mind.", sender: 'friend' },
            { text: "Sure, I'll keep you posted.", sender: 'user' },
            { text: "By the way, did you watch the latest movie that we were excited about?", sender: 'user' },
            { text: "Oh yes, I did! It was amazing. The special effects were mind-blowing.", sender: 'friend' },
            { text: "I thought so too! The plot kept me on the edge of my seat throughout the entire movie.", sender: 'user' },
            { text: "I can't wait for the sequel.It's going to be epic!", sender: 'friend' },
            { text: "Definitely! We should plan to watch it together when it's released.", sender: 'user' },
            { text: "Absolutely! It's always more fun to watch movies with friends.", sender: 'friend' },
            { text: "Hey, have you tried that new restaurant that opened downtown?", sender: 'user' },
            { text: "Not yet, but I've heard great things about it.The food is supposed to be delicious!", sender: 'friend' },
            { text: "We should go there sometime and try it together.", sender: 'friend' },
            { text: "That sounds like a plan! Let's make a reservation for next weekend.", sender: 'user' },
            { text: "Count me in! I can't wait to taste their famous dishes.", sender: 'friend' },
            { text: "It's a date then! I'm already looking forward to it.", sender: 'user' },
            { text: "Me too! Time spent with friends is always the best.", sender: 'friend' }
        ]
    );
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim() === '') {
            return;
        }

        setMessages([...messages, { text: newMessage, sender: 'user' }]);
        setNewMessage('');
    };
    return (
        <View style={styles.container}>
            <Text style={styles.header}>{messageID}</Text>
            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={item.sender === 'user' ? styles.userMessageContainer : styles.botMessageContainer}>
                        <Text style={styles.messageText}>{item.text}</Text>
                    </View>
                )}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type your message..."
                    value={newMessage}
                    onChangeText={(text) => setNewMessage(text)}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default OpenChat

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        backgroundColor: Colours.background,
    },
    header: {
        color: Colours.text,
        fontSize: 32,
        margin: 20,
        textAlign: 'center',
    },
    userMessageContainer: {
        color: Colours.text,
        backgroundColor: Colours.primary,
        padding: 8,
        marginBottom: 8,
        alignSelf: 'flex-end',
        borderRadius: 8,
        borderBottomRightRadius: 0,
    },
    botMessageContainer: {
        color: Colours.text,
        backgroundColor: Colours.secondary,
        padding: 8,
        marginBottom: 8,
        alignSelf: 'flex-start',
        borderRadius: 8,
        borderBottomLeftRadius: 0,
    },
    messageText: {
        color: Colours.text,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 8,
    },
    input: {
        flex: 1,
        marginRight: 8,
        padding: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
    },
    sendButton: {
        backgroundColor: Colours.primary,
        padding: 8,
        borderRadius: 8,
    },
    sendButtonText: {
        color: Colours.text,
        fontWeight: 'bold',
    },
})