import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colours from './Colours';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DocumentPicker from 'react-native-document-picker';

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
        } finally {
            setIsCreatingPost(false);
        }
    }

    const handleMediaSelection = async () => {
        try {
            const result = await DocumentPicker.pickSingle({
                type: [/*DocumentPicker.types.audio, */DocumentPicker.types.images, DocumentPicker.types.video],
            });
            setFileName(result.name);
            setMediaUri(result.uri);
        } catch (error) {
            if (!DocumentPicker.isCancel(error)) {
                console.log("Error picking file:", error);
            }
        }
    }

    const fileType = (filename) => {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
        const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.3gp', '.wmv', '.mpeg', '.flv']
        const audioExtensions = ['.mp3', '.wav', '.ogg', '.aac', '.m4a'];

        const extension = filename.substring(filename.lastIndexOf('.')).toLowerCase();

        if (imageExtensions.includes(extension)) {
            return 'image'
        } else if (videoExtensions.includes(extension)) {
            return 'video'
        // } else if (audioExtensions.includes(extension)) {
        //     return 'audio'
        } else {
            console.log('error: unsupported file type')
        }
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
                    {fileType(fileName) === 'image' ?
                        <Image style={styles.imageVideo} source={{ uri: mediaUri }} resizeMode="contain" />
                        : fileType(fileName) === 'video' ?
                            <Video
                                style={styles.imageVideo}
                                source={{ uri: mediaUri }}
                                resizeMode={'contain'}
                            />
                            // : fileType(fileName) === 'audio' ?
                            //     <Video
                            //         style={styles.audioPlayer}
                            //         source={{ uri: mediaUri }}
                            //     />
                            //     <Text style={{color: 'white'}}>audio file</Text>
                                : handleRemoveMedia
                    }
                    <TouchableOpacity style={styles.removeMediaBtn} onPress={handleRemoveMedia}>
                        <FontAwesome name={'trash'} size={35} color={Colours.text} />
                    </TouchableOpacity>
                </View>
            );
        }
        return null;
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
            {renderMediaContent()}
            <TouchableOpacity style={styles.selectImageVideoBtn} onPress={handleMediaSelection}>
                <Text style={styles.selectImageVideoText}>Select Image, Video or Audio</Text>
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
    audioPlayer: {
        width: '100%',
        height: 40,
        marginBottom: 10,
        backgroundColor: Colours.accent,
    },
    selectImageVideoBtn: {
        backgroundColor: Colours.secondary,
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    selectImageVideoText: {
        color: Colours.text,
        fontSize: 16,
    },
    createPostBtn: {
        backgroundColor: Colours.primary,
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 10,
        right: 10
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
