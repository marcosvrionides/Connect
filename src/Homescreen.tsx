import { StyleSheet, View, FlatList, PermissionsAndroid, Button } from 'react-native';
import Colours from './Colours';
import ActionsButton from './ActionsButton';
import PostCard from './PostCard';
import database from '@react-native-firebase/database';
import { useEffect, useState } from 'react';

function Homescreen(): JSX.Element {

    // const requestSendNotificationPermission = async () => {
    //     try {
    //         const granted = await PermissionsAndroid.request(
    //             PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    //             {
    //                 title: 'TEST',
    //                 message: 'permissions.locationPermissionMessage',
    //                 buttonNegative: 'Cancel',
    //                 buttonPositive: 'OK',
    //             }
    //         )
    //     } catch (err) {
    //         console.log(err.message)
    //     }
    // }

    // useEffect(() => {
    //     requestSendNotificationPermission();
    // }, [])

    const [postIds_timestamps, setPostIds_timestamps] = useState([])

    useEffect(() => {
        const reference = database().ref('/posts');
        reference.on('value', (snapshot) => {
            if (snapshot.exists()) {
                const timestampsData = [];
                snapshot.forEach((user) => {
                    user.forEach((post) => {
                        timestampsData.push({
                            userID: user.key,
                            postID: post.key,
                            timestamp: post.val().timestamp,
                        });
                    });
                });
                // Sort the array by the timestamp property
                timestampsData.sort((a, b) => b.timestamp - a.timestamp);
                setPostIds_timestamps(timestampsData);
            } else {
                // Handle case when there is no data or snapshot doesn't exist
                setPostIds_timestamps([]);
            }
        });

        // Cleanup the event listener when the component unmounts
        return () => reference.off('value');
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.posts}
                data={postIds_timestamps}
                renderItem={({ item }) => <PostCard key={item.ID} userID={item.userID} postID={item.postID} />}
                keyExtractor={(item) => item.postID}
            />
            <ActionsButton />
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: Colours.background,
    },
    posts: {
        display: 'flex',
        flexDirection: 'column',
    },
    requestSendNotificationPermissionButton: {
        width: '100%',
        height: 50,
        backgroundColor: 'red'
    }
});

export default Homescreen;
