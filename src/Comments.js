import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import database from '@react-native-firebase/database';
import Colours from './Colours'
import { useNavigation } from '@react-navigation/native';

export default function Comments(props) {
    const postID = props.postID;
    const [comments, setComments] = useState([]);

    useEffect(() => {
        setComments([])
        const commentsRef = database().ref('/comments/' + postID);
        commentsRef.once('value', (snapshot) => {
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
    }, [postID, props.refresh]);

    const navigation = useNavigation();
    const handleNavigateProfile = (uid) => {
        navigation.navigate('Profile', { uid: uid });
    }

    comments.sort((a, b) => b.timestamp - a.timestamp);

    return (
        <View style={styles.container}>
            {comments.map((item) => (
                <View style={styles.commentContainer} key={item.id}>
                    <Text style={styles.commentText} onPress={() => handleNavigateProfile(item.uid)}>
                        {item.displayName + ': '}
                    </Text>
                    <Text style={styles.commentText}>{item.text}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: Colours.background,
        flex: 1
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
});
