import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import Colours from './Colours';
import * as ImagePicker from "react-native-image-picker";
import { firebase } from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

export default function NewPostForm() {
    const [text, setText] = useState('');
    const [imageUri, setImageUri] = useState('no file');

    const handleCreatePost = async () => {
        if (text.trim() === '' && imageUri === 'no file') {
            return;
        }

        try {
            // Define the post object to be saved in the database
            const newPostObj = {
                community: '',
                content: text,
                displayName: auth().currentUser?.displayName,
                email: auth().currentUser?.email,
                file: imageUri,
                likes: 0,
                timestamp: new Date().getTime(),
                uid: auth().currentUser?.uid
            };

            // Generate a new post ID using the push() method from the Firebase Realtime Database
            const newPostRef = firebase
                .app()
                .database('https://studentsthoughtsfyp-default-rtdb.europe-west1.firebasedatabase.app/')
                .ref('/posts')
                .push();

            const postId = newPostRef.key; // Get the generated post ID

            if (imageUri !== 'no file') {
                // Upload the selected file to Firebase Storage with the post ID as the path
                const storageRef = storage().ref(postId);
                await storageRef.putFile(imageUri);

                // Update the post object with the file path
                const updatedPostObj = {
                    ...newPostObj,
                    file: postId,
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
        } catch (error) {
            // Handle any errors that occurred while saving the message or uploading the file
            console.error('Error saving message:', error);
        }
    }

    const handleImageSelection = () => {
        // Launch the image picker or camera using launchImageLibrary from react-native-image-picker
        ImagePicker.launchImageLibrary(
            {
                title: 'Select Image',
                storageOptions: {
                    skipBackup: true,
                    path: 'images',
                },
            },
            (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    // Set the selected image URI to the state
                    setImageUri(response.assets[0].uri);
                }
            },
        );
    };

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
                <Image style={styles.image} source={{ uri: imageUri }} resizeMode="cover" />
            )}
            <TouchableOpacity style={styles.selectImageBtn} onPress={handleImageSelection}>
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
        aspectRatio: 1,
        marginBottom: 16,
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
