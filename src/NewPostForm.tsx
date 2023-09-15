import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colours from './Colours';
import * as MediaPicker from "react-native-image-picker";
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function NewPostForm() {
    const [text, setText] = useState('');
    const [mediaUri, setMediaUri] = useState('no file');
    const [fileName, setFileName] = useState('');

    const navigation = useNavigation();

    const [isCreatingPost, setIsCreatingPost] = useState(false);

    const handleCreatePost = async () => {
        if (text.trim() === '' && mediaUri === 'no file' || isCreatingPost) { return; }
        setIsCreatingPost(true);
        try {
            // Define the post object to be saved in the database
            const newPostObj = {
                community: '',
                content: text,
                displayName: auth().currentUser?.displayName ? auth().currentUser?.displayName : 'Anonymous',
                email: auth().currentUser?.email,
                file: mediaUri,
                timestamp: new Date().getTime(),
                uid: auth().currentUser?.uid
            };

            // Generate a new post ID using the push() method from the Firebase Realtime Database
            const newPostRef = database().ref('/posts/' + auth().currentUser.uid).push();

            const postId = newPostRef.key; // Get the generated post ID

            if (mediaUri !== 'no file') {
                // Upload the selected file to Firebase Storage with the post ID as the path
                const storageRef = storage().ref(postId);
                await storageRef.putFile(mediaUri);

                // Update the post object with the file path
                const updatedPostObj = {
                    ...newPostObj,
                    file: fileName,
                };

                // Save the updated post object to the database
                await newPostRef.set(updatedPostObj);
            } else {
                // Save the post object to the database without the file path
                await newPostRef.set(newPostObj);
            }

            // Clear the new message input field after sending
            setText('');
            setMediaUri('no file');
            navigation.navigate('Home')
        } catch (error) {
            // Handle any errors that occurred while saving the message or uploading the file
            console.error('Error saving message:', error);
            database().ref('/errorLogs/').push(error)
            
        } finally {
            setIsCreatingPost(false);
        }
    }

    const handleFileSelection = () => {
        // Launch the image picker or camera using launchImageLibrary from react-native-image-picker
        MediaPicker.launchImageLibrary(
            {
                mediaType: 'mixed',
            },
            (response) => {
                if (!response.didCancel && !response.error && !response.customButton) {
                    setFileName(response.assets[0].fileName);
                    setMediaUri(response.assets[0].uri);
                }
            },
        );
    };

    const isImageFile = (filename) => {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
        const extension = filename.substring(filename.lastIndexOf('.')).toLowerCase();
        return imageExtensions.includes(extension);
    };

    useEffect(() => {
        if (isCreatingPost) {
            ToastAndroid.show(
                'Posting...',
                ToastAndroid.LONG,
            )
        }
    }, [isCreatingPost])

    const handleRemoveMedia = () => {
        setFileName('');
        setMediaUri('no file')
    }

    const renderMediaContent = () => {
        if (mediaUri !== 'no file') {
            return (
                <View style={styles.mediaContainer}>
                    {isImageFile(fileName) ? (
                        <Image style={styles.imageVideo} source={{ uri: mediaUri }} resizeMode="contain" />
                    ) : (
                        <Video
                            style={styles.imageVideo}
                            source={{ uri: mediaUri }}
                            resizeMode={'contain'}
                        />
                    )}
                    <TouchableOpacity style={styles.removeMediaBtn} onPress={handleRemoveMedia}>
                        <FontAwesome name={'trash'} size={35} color={Colours.text} />
                    </TouchableOpacity>
                </View>
            );
        }
        return null;
    };

    console.log(mediaUri)

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Enter your post text"
                placeholderTextColor={Colours.text}
                multiline
                value={text}
                onChangeText={setText}
            />
            {renderMediaContent()}
            <TouchableOpacity style={styles.selectImageBtn} onPress={handleFileSelection}>
                <Text style={styles.selectImageText}>Select Image or Video</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.createPostBtn} onPress={handleCreatePost}>
                <Text style={styles.createPostText}>Create Post</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: Colours.background,
        minHeight: '100%'
    },
    input: {
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colours.accent,
        color: Colours.text,
    },
    imageVideo: {
        width: '100%',
        aspectRatio: 3 / 4,
        borderWidth: 2,
        borderColor: Colours.primary,
        borderRadius: 25,
        backgroundColor: Colours.accent,
        marginBottom: 10
    },
    selectImageBtn: {
        backgroundColor: Colours.secondary,
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    selectImageText: {
        color: Colours.text,
        fontSize: 16,
    },
    createPostBtn: {
        backgroundColor: Colours.primary,
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    createPostText: {
        color: Colours.text,
        fontSize: 16,
    },
    mediaContainer: {
        position: 'relative',
    },
    removeMediaBtn: {
        position: 'absolute',
        bottom: 20,
        right: 10,
        backgroundColor: Colours.accent,
        padding: 5,
        borderRadius: 17.5,
        borderWidth: 3,
        borderColor: Colours.background,
    },
});
