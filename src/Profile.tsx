import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { useRoute } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import Colours from './Colours'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as MediaPicker from "react-native-image-picker";
import storage from '@react-native-firebase/storage';
import PostCard from './PostCard';

export default function Profile() {

    const loggedInUser = auth().currentUser

    const [editMode, setEditMode] = useState(false);
    const [newProfilePicUri, setNewProfilePiceUri] = useState("");
    const [newAbout, setNewAbout] = useState('');

    const route = useRoute();
    const uid = route.params.uid;
    const [userProfile, setUserProfile] = useState(null);

    const userProfileRef = database().ref(`users/${uid}`);

    useEffect(() => {
        userProfileRef.on('value', (snapshot) => {
            setUserProfile(snapshot.val());
            setNewAbout(snapshot.val().about !== undefined ? snapshot.val().about : 'no bio :(')
        });

        return () => {
            userProfileRef.off();
        };
    }, [uid, editMode]);


    const toggleEditMode = async () => {
        if (editMode) {
            if (newProfilePicUri) {
                try {
                    // Upload the new profile picture to Firebase Storage
                    const storageRef = storage().ref(loggedInUser.uid + '/' + 'profilePicture');
                    const uploadTask = storageRef.putFile(newProfilePicUri);

                    // Monitor the upload task to get the download URL
                    uploadTask.on(
                        "state_changed",
                        // progress tracking (optional)
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log(`Upload is ${progress}% done`);
                        },
                        // error handling (optional)
                        (error) => {
                            console.error("Error uploading profile picture:", error);
                        },
                        // success - get the download URL and update the user profile
                        () => {
                            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                                // Save the download URL to the user profile
                                userProfileRef.update({
                                    about: newAbout,
                                    profilePicture: downloadURL, // assuming the field to store profile picture URL is "profilePictureUrl"
                                })
                                    .then(() => {
                                        console.log("User profile updated successfully!");
                                    })
                                    .catch((error) => {
                                        console.error("Error updating user profile:", error);
                                    });
                            });
                        }
                    );
                } catch (error) {
                    console.error("Error uploading profile picture:", error);
                }
            } else {
                userProfileRef.update({
                    about: newAbout,
                })
                ToastAndroid.show('Changes saved', ToastAndroid.SHORT)
            }

        }
        setEditMode(!editMode);
    }

    const handleChangeProfilePic = () => {
        MediaPicker.launchImageLibrary(
            { mediaType: 'photo' },
            (response) => {
                if (!response.didCancel || !response.error || !response.customButton) {
                    setNewProfilePiceUri(response.assets[0].uri);
                }
            },
        );
    }

    const [charsLeft, setCharsLeft] = useState(300);
    const handleSaveAbout = (text) => {
        const remainingChars = 300 - text.length;
        if (remainingChars >= 0) {
            setCharsLeft(remainingChars);
            setNewAbout(text);
        }
    };

    const discardEdits = () => {
        setNewProfilePiceUri('')
        setEditMode(!editMode);
        ToastAndroid.show('Edits discarded', ToastAndroid.SHORT)
    }

    const userPostsRef = database().ref('/posts/' + uid)
    const [userPosts, setUserPosts] = useState([])
    useEffect(() => {
        setUserPosts([])
        userPostsRef.on('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                setUserPosts((userPosts) => [...userPosts, { postID: childSnapshot.key, timestamp: childSnapshot.val().timestamp }])
            })
        })
    }, [])

    userPosts.sort((a, b) => b.timestamp - a.timestamp)

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps='always'>
            {userProfile ? (
                <View>
                    {loggedInUser.uid === uid &&
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'flex-end' }}>
                            {editMode &&
                                <TouchableOpacity style={styles.discardButton} onPress={discardEdits}>
                                    <Text style={styles.discardButtonText}>Discard</Text>
                                </TouchableOpacity>}
                            <TouchableOpacity style={styles.editButton} onPress={toggleEditMode}>
                                <Text style={styles.editButtonText}>{editMode ? 'Save' : 'Edit'}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={styles.profilePicContainer}>
                            <Image
                                style={styles.profilePic}
                                source={{
                                    uri: newProfilePicUri !== ''
                                        ? newProfilePicUri
                                        : (userProfile.profilePicture !== undefined
                                            ? userProfile.profilePicture
                                            : 'https://firebasestorage.googleapis.com/v0/b/studentsthoughtsfyp.appspot.com/o/default_profile_picj.jpg?alt=media&token=39c38fa6-5ac7-4e2e-a2eb-0c9157c6194b')
                                }}

                            />
                            {editMode &&
                                <FontAwesome
                                    name={'pencil'}
                                    size={35}
                                    style={styles.editProfilePicButton}
                                    onPress={handleChangeProfilePic}
                                />
                            }
                        </View>
                        <Text style={styles.displayName}>{userProfile.displayName}</Text>
                    </View>
                    <View style={styles.aboutContainer}>
                        {editMode ?
                            <>
                                <TextInput
                                    onChangeText={handleSaveAbout}
                                    style={styles.about}
                                    value={newAbout}
                                />
                                <Text style={{ color: Colours.text }}>{charsLeft}/300 Characters left</Text>
                            </>
                            : <Text style={styles.about}>{userProfile.about || 'No bio :('}</Text>}
                    </View>
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: 'bold',
                            color: Colours.text,
                            textAlign: 'center',
                            marginTop: 20
                        }}>
                        Posts
                    </Text>
                    <View style={{ flex: 1, padding: 16 }}>
                        <FlatList
                            data={userPosts}
                            renderItem={({ item }) => (
                                <View style={{ flex: 1, width: '33.33%', aspectRatio: 0.75, paddingHorizontal: 8 }}>
                                    <PostCard userID={uid} postID={item.postID} onProfile={true} hideDetails={true}/>
                                </View>
                            )}
                            keyExtractor={(item) => item}
                            numColumns={3}
                            contentContainerStyle={{ justifyContent: 'space-between' }}
                        />
                    </View>


                </View>
            ) : (
                <Text>Loading...</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colours.background,
        flex: 1,
        padding: 10,

    },
    profilePicContainer: {
        width: 120,
    },
    profilePic: {
        width: 100,
        height: 100,
        borderWidth: 5,
        borderColor: Colours.primary,
        borderRadius: 50
    },
    displayName: {
        color: Colours.text,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16
    },
    aboutContainer: {
        borderRadius: 10,
        borderWidth: 5,
        borderColor: Colours.primary,
        marginTop: 10,
        height: 150,
        padding: 10
    },
    about: {
        color: Colours.text,
    },
    editAboutButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        color: Colours.text
    },
    editButton: {
        backgroundColor: Colours.accent,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5
    },
    editButtonText: {
        color: Colours.text,
        fontSize: 18,
        fontWeight: '500'
    },
    discardButton: {
        backgroundColor: 'red',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5
    },
    discardButtonText: {
        color: Colours.background,
        fontSize: 18,
        fontWeight: '500'
    },
    editProfilePicButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        color: Colours.text
    },
});
