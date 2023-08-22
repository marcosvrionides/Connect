import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import Colours from './Colours'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import VideoPlayer from 'react-native-video-controls';
import { useNavigation } from '@react-navigation/native';

function PostCard(props): Promise<JSX.Element> {

    const onProfile = props.onProfile;

    const loggedInUser = auth().currentUser;

    const [postData, setPostData] = useState(null);
    const [postFileURL, setPostFileURL] = useState(null);
    const [posterProfilePic, setPosterProfilePic] = useState('https://firebasestorage.googleapis.com/v0/b/studentsthoughtsfyp.appspot.com/o/default_profile_picj.jpg?alt=media&token=39c38fa6-5ac7-4e2e-a2eb-0c9157c6194b');
    const [formattedDate, setFormatedDate] = useState(null);
    const [liked, setLiked] = useState(false);

    const [numberOfLikes, setNumberOfLikes] = useState(0);
    const [numberOfComments, setNumberOfComments] = useState(0);

    const postsRreference = database().ref('/posts/' + props.userID + '/' + props.postID);
    const likeReference = database().ref('/likes/' + props.postID + '/' + loggedInUser.uid);

    const [showOptions, setShowOptions] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const toggleOptions = () => {
        setShowOptions(!showOptions);
        Animated.timing(
            fadeAnim,
            {
                toValue: showOptions ? 0 : 1,
                duration: 500,
                useNativeDriver: true,
            }
        ).start();
    };

    useEffect(() => {
        try {
            const date = new Date(postData.timestamp)
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear()).slice(2);
            setFormatedDate(`${hours}:${minutes} - ${day}/${month}/${year}`);
        } catch (error) {
        }
    }, [postData])

    useEffect(() => {
        postsRreference.on('value', async (snapshot) => {
            const data = snapshot.val();
            setPostData(data);

            if (data.file !== 'no file') {
                // Fetch the image URL from Firebase Storage
                try {
                    const url = await storage().ref(snapshot.key).getDownloadURL();
                    setPostFileURL(url);
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

    }, [props]);

    useEffect(() => {
        const likesReference = database().ref('likes/' + props.postID)
        likesReference.on('value', (snapshot) => {
            const likesCount = snapshot.numChildren();
            setNumberOfLikes(likesCount);
            if (snapshot.hasChild(loggedInUser.uid)) {
                setLiked(true);
            } else {
                setLiked(false);
            }
        })
        return () => {
            likesReference.off();
        };
    }, [postData])

    useEffect(() => {
        const commentsReference = database().ref('comments/' + props.postID);

        const handleSnapshot = (snapshot) => {
            let commentsCount = 0;
            snapshot.forEach((childSnapshot) => {
                commentsCount += childSnapshot.numChildren();
            });
            setNumberOfComments(commentsCount);
        };

        commentsReference.on('value', handleSnapshot);

        return () => {
            commentsReference.off('value', handleSnapshot);
        };
    }, [postData])

    useEffect(() => {
        if (postData) {
            const usersRreference = database()
                .ref('/users/' + postData.uid);

            usersRreference.on('value', async (snapshot) => {
                const data = snapshot.val();
                const profilePicURL = data.profilePicture;
                if (snapshot.key === postData.uid) {
                    setPosterProfilePic(profilePicURL);
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


    const handleSetLike = () => {
        if (liked) {
            likeReference.remove()
        } else {
            likeReference.set({
                like: true
            })
        }
    }

    const isImageFile = (filename) => {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
        const extension = filename.substring(filename.lastIndexOf('.')).toLowerCase();
        return imageExtensions.includes(extension);
    };

    const navigation = useNavigation();
    const handleNavigateProfile = () => {
        if (postData.displayName !== 'Anonymous') {
            navigation.navigate('Profile', { uid: postData.uid });
        }
    }

    const handleDeletePost = () => {
        postsRreference.remove();
    }

    const handleOpenPost = () => {
        navigation.navigate('Post', { postID: props.postID, userID: postData.uid })
    }

    const handleNavigateNewCommentForm = () => {
        navigation.navigate('NewComment', { postID: props.postID, userID: postData.uid })
    }

    return (
        <TouchableWithoutFeedback onPress={handleOpenPost}>
            <View style={styles.container}>
                {!onProfile && <View style={styles.topSection}>
                    <TouchableOpacity onPress={handleNavigateProfile}>
                        <Image style={styles.profilePic} source={{ uri: posterProfilePic }} />
                    </TouchableOpacity>
                    <View style={styles.nameDate}>
                        <Text style={styles.posterName} onPress={handleNavigateProfile}>{postData.displayName}</Text>
                        {formattedDate !== null && <Text style={styles.postDate}>{formattedDate}</Text>}
                    </View>
                </View>}
                <Text style={styles.postText}>{postData.content}</Text>
                {postData.file !== 'no file' && (
                    isImageFile(postData.file) ? (
                        <Image
                            style={styles.mediaPreview}
                            source={{ uri: postFileURL }}
                            resizeMode="contain"
                        />
                    ) : (
                        <VideoPlayer
                            style={styles.mediaPreview}
                            source={{ uri: postFileURL }}
                            resizeMode="contain"
                            toggleResizeModeOnFullscreen={false}
                            scrubbing={1}
                            disableFullscreen
                            disableVolume
                            disableBack
                        />
                    )
                )}
                {!props.hideDetails && <View style={styles.bottomSection}>
                    <View>
                        {loggedInUser.uid === postData.uid &&
                            <SimpleLineIcons name='options-vertical' size={25} color={Colours.primary} onPress={toggleOptions} />
                        }
                    </View>
                    <View style={styles.likesComments}>
                        <View style={styles.likeContainer}>
                            <Text style={styles.likeCount}>{numberOfLikes} {numberOfLikes === 1 ? 'Like' : 'Likes'}</Text>
                            {liked ?
                                <FontAwesome name='heart' size={25} color={Colours.primary} onPress={handleSetLike} />
                                :
                                <FontAwesome name='heart-o' size={25} color={Colours.primary} onPress={handleSetLike} />
                            }
                        </View>
                        <View style={styles.likeContainer}>
                            <Text style={styles.likeCount}>{numberOfComments} {numberOfComments === 1 ? 'Comment' : 'Comments'}</Text>
                            <MaterialCommunityIcons name='comment-minus-outline' size={25} color={Colours.primary} onPress={handleNavigateNewCommentForm} />
                        </View>
                    </View>
                </View>}
                {!props.hideDetails && showOptions && (
                    <Animated.View
                        style={[
                            styles.optionsOverlay,
                            postData.file === 'no file' && { flexDirection: 'row' },
                            {
                                opacity: fadeAnim,
                            }
                        ]}
                    >
                        <TouchableOpacity onPress={handleDeletePost}>
                            <Text style={styles.deleteButton}>Delete Post</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.closeButton, postData.file === 'no file' && { flexDirection: 'row' }]} onPress={toggleOptions}>
                            <FontAwesome name='close' size={80} color={'black'} />
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </View>
        </TouchableWithoutFeedback>
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
        borderColor: Colours.secondary,
        backgroundColor: Colours.background
    },
    optionsOverlay: {
        ...StyleSheet.absoluteFillObject, // Cover the entire parent view
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    deleteButton: {
        backgroundColor: 'rgba(255, 0, 0, 0.6)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
        marginBottom: 10,
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    },
    closeButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 5,
    },
    topSection: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10
    },
    bottomSection: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    likesComments: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
    },
    likeContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10
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
        aspectRatio: 3 / 4,
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
    },
    likeCount: {
        color: Colours.primary,
        fontSize: 16,
    }
});

export default PostCard;