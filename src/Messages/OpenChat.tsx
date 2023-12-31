import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Colours from '../Colours';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const OpenChat = ({ route }) => {

    const username = route.params.username
    const loggedInUserUid = auth().currentUser.uid
    const secondUID = route.params.uid
    const uids = [loggedInUserUid, secondUID].sort()
    const chatRef = "/messages/" + uids[0] + uids[1]

    const [messages, setMessages] = useState([]);
    const [updateMessages, setUpdateMessages] = useState(false);

    const flatListRef = useRef(null);

    useEffect(() => {
        const messagesReference = database().ref(chatRef);

        messagesReference.on('value', async (snapshot) => {
            setMessages([])
            snapshot.forEach((childSnapshot) => {
                if (childSnapshot.val().fromUid !== loggedInUserUid && childSnapshot.val().read !== 'read') {
                    childSnapshot.ref.update({ read: 'read' })
                    setUpdateMessages(true)
                }
                setMessages((oldMessages) => [...oldMessages, childSnapshot.val()])
            })
        });

        return () => {
            setUpdateMessages(false)
            messagesReference.off();
        }
    }, [updateMessages])

    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = async () => {

        if (newMessage.trim() === '') { return; }

        const newMessageRef = database().ref(chatRef).push();

        const newMessageObj = {
            fromDisplayName: auth().currentUser.displayName,
            fromUid: loggedInUserUid,
            message: newMessage,
            read: "sent",
            timestamp: new Date().getTime(),
            to: secondUID
        };

        newMessageRef
            .set(newMessageObj)
            .catch((error) => {
                console.error('Error saving message:', error);
            });

        setNewMessage('');
        setUpdateMessages(true);
    };

    const isSameDay = (date1, date2) => {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return d1.toDateString() === d2.toDateString();
    };

    useEffect(() => {
        for (i in messages) {
            if (i > 0) {
                const previousMessageDate = new Date(messages[i - 1].timestamp)
                const messageDate = new Date(messages[i].timestamp)
                const sameDay = isSameDay(messageDate, previousMessageDate);
                messages[i].sameDayAsPrevious = sameDay;
            }
        }
    }, [messages])

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{username}</Text>
            <FlatList
                ref={flatListRef}
                data={[...messages].reverse()}
                keyExtractor={(item, index) => index.toString()}
                inverted={true}
                renderItem={({ item, index }) => (
                    <View>
                        {item.sameDayAsPrevious ? null :
                            <Text style={styles.daySeparator}>
                                {new Date(item.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                            </Text>}
                        <View style={item.fromUid === loggedInUserUid ? styles.userMessageContainer : styles.botMessageContainer}>
                            <Text style={styles.messageText}>{item.message}</Text>
                            <View style={styles.time_ReadReceipt}>
                                <Text style={styles.timestampText}>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                                {item.fromUid === loggedInUserUid && (
                                    <Text style={styles.readReceiptText}>{item.read === 'sent' ? 'Sent' : 'Read'}</Text>
                                )}
                            </View>
                        </View>
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
        minWidth: '40%'
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
    timestampText: {
        color: Colours.text,
        fontSize: 12,
        alignSelf: 'flex-end',
    },
    readReceiptText: {
        color: Colours.text,
        fontSize: 12,
        alignSelf: 'flex-end',
    },
    time_ReadReceipt: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    daySeparator: {
        color: Colours.text,
        fontSize: 14,
        alignSelf: 'center',
        paddingVertical: 8,
    },
    downArrow: {
        backgroundColor: Colours.accent,
        position: 'absolute',
        bottom: 90,
        right: 20,
        borderRadius: 17.5,
        padding: 2.5,
    }
})