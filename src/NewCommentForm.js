import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import database from '@react-native-firebase/database'
import { useRoute } from '@react-navigation/native';
import Colours from './Colours'
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import auth from '@react-native-firebase/auth'
import { useNavigation } from '@react-navigation/native';

export default function NewCommentForm() {
    const navigation = useNavigation();

    const route = useRoute();
    const postID = route.params.postID;
    const userID = auth().currentUser.uid;

    const [comment, setComment] = useState('');

    const handleCommentSubmit = () => {
        if (comment.trim() === '' || !userID) return;

        const commentRef = database().ref('comments/' + postID + '/' + userID).push();
        commentRef.set({
            text: comment,
            timestamp: Date.now(),
            displayName: auth().currentUser.displayName
        });

        navigation.goBack()
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Comment</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your comment"
                    placeholderTextColor={Colours.text}
                    value={comment}
                    multiline={true}
                    textAlignVertical='top'
                    onChangeText={(text) => {
                        if (text.length <= 300) { // Adjust the character limit as needed
                            setComment(text);
                        }
                    }}
                />
                <Text style={styles.charsLeft}>{comment.length}/300 characters left</Text>
                <TouchableOpacity style={styles.submitButton} onPress={handleCommentSubmit}>
                    <FontAwesome name={'arrow-right'} size={25} color={Colours.primary} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,

        backgroundColor: Colours.background,
    },
    title: {
        marginVertical: 5,

        fontSize: 24,
        color: Colours.text
    },
    inputContainer: {
        marginVertical: 5,

        position: 'relative',
        justifyContent: 'center'
    },
    input: {
        height: 200,

        borderWidth: 3,
        borderColor: Colours.secondary,
        color: Colours.text,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    submitButton: {
        padding: 5,

        position: 'absolute',
        right: 10,
        bottom: 10,
    },
    submitButtonText: {
        color: Colours.text
    },
    charsLeft: {
        color: Colours.text,

        position: 'absolute',
        left: 10,
        bottom: 10,
    }
})