import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput } from 'react-native';
import Colours from './Colours'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { firebase } from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

function PostCard(props): Promise<JSX.Element> {

    const [postData, setPostData] = useState(null);
    const [postImageURL, setPostImageURL] = useState(null);
    // const date = new Date(postData.timestamp)
    // const hours = String(date.getHours()).padStart(2, '0');
    // const minutes = String(date.getMinutes()).padStart(2, '0');
    // const day = String(date.getDate()).padStart(2, '0');
    // const month = String(date.getMonth() + 1).padStart(2, '0');
    // const year = String(date.getFullYear()).slice(2); // Get the last two digits of the year
    // const formattedDate = `${hours}:${minutes} - ${day}/${month}/${year}`;

    useEffect(() => {
        // Fetch the post data from Firebase using the postID prop
        const reference = firebase
            .app()
            .database('https://studentsthoughtsfyp-default-rtdb.europe-west1.firebasedatabase.app/')
            .ref('/posts/' + props.postID);

        reference.on('value', async (snapshot) => {
            const data = snapshot.val();
            setPostData(data);

            if (data.file !== 'no file') {
                // Fetch the image URL from Firebase Storage
                try {
                    const url = await storage().ref(snapshot.key).getDownloadURL();
                    setPostImageURL(url);
                } catch (error) {
                    // Handle any errors that occur while fetching the image URL
                    console.error('Error fetching image URL:', error);
                }
            }
        });

        // Clean up the listener when the component unmounts
        return () => {
            reference.off();
        };

    }, [props.postID]);

    if (!postData) {
        // Post data is still being fetched, or no data found
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.topSection}>
                <Ionicons name="person-circle" size={50} color={Colours.primary} />
                <View style={styles.nameDate}>
                    <Text style={styles.posterName}>{postData.displayName}</Text>
                    <Text style={styles.postDate}>{'formattedDate'}</Text>
                </View>
            </View>
            <Text style={styles.postText}>{postData.content}</Text>
            {postData.file !== 'no file' && <Image style={styles.mediaPreview} source={{ uri: postImageURL }} resizeMode="contain"/>}
            <View style={styles.bottomSection}>
                <TextInput style={styles.commentInput} />
                <MaterialCommunityIcons name='comment-minus-outline' size={25} color={Colours.primary} />
                <FontAwesome name='heart-o' size={25} color={Colours.primary} />
                <Feather name='send' size={25} color={Colours.primary} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        gap: 10,
        borderBottomWidth: 2,
        width: '100%',
        padding: 10,
        marginBottom: 10,
        borderColor: Colours.secondary
    },
    topSection: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10
    },
    bottomSection: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'flex-end'
    },
    nameDate: {
        display: 'flex',
        justifyContent: 'center'
    },
    profilePic: {
        width: 50,
        height: 50,
        borderWidth: 2,
        borderColor: Colours.primary,
        borderRadius: 25
    },
    posterName: {
        fontWeight: 'bold',
        color: Colours.text
    },
    postDate: {
        fontWeight: '300',
        color: Colours.text
    },
    postText: {
        fontWeight: 'normal',
        color: Colours.text
    },
    mediaPreview: {
        width: '100%',
        aspectRatio: 1,
        minHeight: 100,
        maxHeight: 500,
        borderWidth: 2,
        borderColor: Colours.primary,
        borderRadius: 25,
        backgroundColor: Colours.accent
    },
    commentInput: {
        flex: 1,
        height: 25,
        borderWidth: 2,
        borderColor: Colours.primary,
    }
});

export default PostCard;