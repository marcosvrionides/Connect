import { ScrollView, StyleSheet, StatusBar, View, Text, TouchableOpacity, FlatList } from 'react-native';
import Colours from './Colours';
import ActionsButton from './ActionsButton';
import PostCard from './PostCard';
import { firebase } from '@react-native-firebase/database';
import { useEffect, useState } from 'react';

function Homescreen(): JSX.Element {

    const [postIds_timestamps, setPostIds_timestamps] = useState([])

    useEffect(() => {
        const reference = firebase
            .app()
            .database('https://studentsthoughtsfyp-default-rtdb.europe-west1.firebasedatabase.app/')
            .ref('/posts')
            .on('value', snapshot => {
                const timestampsData = [];
                snapshot.forEach(childSnapshot => {
                    timestampsData.push({
                        ID: childSnapshot.key,
                        timestamp: childSnapshot.val().timestamp,
                    });
                });
                // Sort the array by the timestamp property
                timestampsData.sort((a, b) => b.timestamp - a.timestamp);
                setPostIds_timestamps(timestampsData);
            });
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.posts}
                data={postIds_timestamps}
                renderItem={({ item }) => <PostCard key={item.ID} postID={item.ID} />}
                keyExtractor={(item) => item.ID}
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
});

export default Homescreen;
