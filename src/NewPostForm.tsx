import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colours from './Colours';
import * as MediaPicker from "react-native-image-picker";
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';
import VideoPlayer from 'react-native-video-controls';

export default function NewPostForm() {
    const [text, setText] = useState('');
    const [imageUri, setImageUri] = useState('no file');
    const [fileName, setFileName] = useState('');

    const navigation = useNavigation();

    const [isCreatingPost, setIsCreatingPost] = useState(false);

    const handleCreatePost = async () => {
        if (text.trim() === '' && imageUri === 'no file' || isCreatingPost) { return; }
        setIsCreatingPost(true);
        try {
            // Define the post object to be saved in the database
            const newPostObj = {
                community: '',
                content: text,
                displayName: auth().currentUser?.displayName ? auth().currentUser?.displayName : 'Anonymous',
                email: auth().currentUser?.email,
                file: imageUri,
                timestamp: new Date().getTime(),
                uid: auth().currentUser?.uid
            };

            // Generate a new post ID using the push() method from the Firebase Realtime Database
            const newPostRef = database().ref('/posts/' + auth().currentUser.uid).push();

            const postId = newPostRef.key; // Get the generated post ID

            if (imageUri !== 'no file') {
                // Upload the selected file to Firebase Storage with the post ID as the path
                const storageRef = storage().ref(postId);
                await storageRef.putFile(imageUri);

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
            setImageUri('no file');
            navigation.navigate('Home')
        } catch (error) {
            // Handle any errors that occurred while saving the message or uploading the file
            console.error('Error saving message:', error);
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
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('MediaPicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    setFileName(response.assets[0].fileName);
                    setImageUri(response.assets[0].uri);
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
    },[isCreatingPost])

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
            {imageUri !== 'no file' && (
                isImageFile(fileName) ? (
                    <Image style={styles.image} source={{ uri: imageUri }} resizeMode="contain" />
                ) : (
                    <VideoPlayer
                        style={[styles.image, {aspectRatio: undefined}]}
                        source={{ uri: imageUri }}
                        resizeMode="contain"
                        toggleResizeModeOnFullscreen={false}
                        scrubbing={1}
                        disableFullscreen
                        disableVolume
                        disableBack
                    />
                )
            )}
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
    image: {
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
});
