import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput } from 'react-native';
import Colours from './Colours'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { firebase } from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

function PostCard(props): Promise<JSX.Element> {

    const [postData, setPostData] = useState(null);
    const [postImageURL, setPostImageURL] = useState(null);
    const [posterProfilePic, setPosterProfilePic] = useState(null);
    const [formattedDate, setFormatedDate] = useState(null)

    useEffect(() => {
        const date = new Date(postData.timestamp)
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(2);
        setFormatedDate(`${hours}:${minutes} - ${day}/${month}/${year}`);
    }, [postData])

    useEffect(() => {
        // Fetch the post data from Firebase using the postID prop
        const postsRreference = firebase
            .app()
            .database('https://studentsthoughtsfyp-default-rtdb.europe-west1.firebasedatabase.app/')
            .ref('/posts/' + props.postID);

        postsRreference.on('value', async (snapshot) => {
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
            postsRreference.off();
        };


    }, [props.postID]);

    useEffect(() => {
        if (postData) {
            const usersRreference = firebase
                .app()
                .database('https://studentsthoughtsfyp-default-rtdb.europe-west1.firebasedatabase.app/')
                .ref('/users/' + postData.uid);

            usersRreference.on('value', async (snapshot) => {
                const data = snapshot.val();
                const profilePicURL = data.profilePicture;
                if (snapshot.key === postData.uid) {
                    setPosterProfilePic(profilePicURL === "" ? 'https://firebasestorage.googleapis.com/v0/b/studentsthoughtsfyp.appspot.com/o/default_profile_picj.jpg?alt=media&token=39c38fa6-5ac7-4e2e-a2eb-0c9157c6194b' : profilePicURL);
                }
            });

            // Clean up the listener when the component unmounts
            return () => {
                usersRreference.off();
            };
        }
    }, [postData])

    if (!postData) {
        // Post data is still being fetched, or no data found
        return null;
    }

    console.log(posterProfilePic)
    return (
        <View style={styles.container}>
            <View style={styles.topSection}>
                <Image style={styles.profilePic} source={{ uri: posterProfilePic }} />
                <View style={styles.nameDate}>
                    <Text style={styles.posterName}>{postData.displayName}</Text>
                    {formattedDate !== null && <Text style={styles.postDate}>{formattedDate}</Text>}
                </View>
            </View>
            <Text style={styles.postText}>{postData.content}</Text>
            {postData.file !== 'no file' && <Image style={styles.mediaPreview} source={{ uri: postImageURL }} resizeMode="contain" />}
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