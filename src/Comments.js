import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import Colours from './Colours'
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Comments() {
    const route = useRoute();
    const postID = route.params.postID;
    const loggedInUser = auth().currentUser;
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [updateComments, setUpdateComments] = useState(false);

    useEffect(() => {
        setComments([])
        const commentsRef = database().ref('/comments/' + postID);
        commentsRef.on('value', (snapshot) => {
            snapshot.forEach((user) => {
                const uid = user.key;
                user.forEach((comment) => {
                    const commentData = comment.val();
                    commentData.uid = uid;
                    setComments((comments) => [...comments, commentData]);
                });
            })
        });
        return () => {
            commentsRef.off('value');
        }
    }, [postID, updateComments]);

    const handleCommentSubmit = () => {
        if (newComment.trim() === '') return;
        const userID = loggedInUser.uid;
        if (!userID) return;

        const newCommentRef = database().ref('/comments/' + postID + '/' + userID).push();
        newCommentRef.set({
            text: newComment,
            timestamp: Date.now(),
            displayName: loggedInUser.displayName
        });
        setNewComment('');
        setUpdateComments(!updateComments);
    };

    const navigation = useNavigation();
    const handleNavigateProfile = (uid) => {
        navigation.navigate('Profile', { uid: uid });
    }

    comments.sort((a, b) => a.timestamp - b.timestamp);

    return (
        <View style={styles.container}>
            <FlatList
                data={comments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.commentContainer}>
                        <Text style={styles.commentText} onPress={() => handleNavigateProfile(item.uid)}>
                            {item.displayName + ': '}
                        </Text>
                        <Text style={styles.commentText}>{item.text}</Text>
                    </View>
                )}
            />
            <TextInput
                style={styles.input}
                placeholder="Write a comment..."
                placeholderTextColor={Colours.text}
                value={newComment}
                onChangeText={(text) => setNewComment(text)}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleCommentSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: Colours.background
    },
    commentContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    commentText: {
        fontSize: 16,
        color: Colours.text,
        marginBottom: 10
    },
    input: {
        borderWidth: 5,
        borderColor: Colours.primary,
        color: Colours.text,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 8,
    },
    submitButton: {
        width: '100%',
        backgroundColor: Colours.accent,
        alignItems: 'center',
        borderRadius: 8
    },
    submitButtonText: {
        color: Colours.text,
        padding: 10,
        fontSize: 18
    }
});
