import { ScrollView, StyleSheet, StatusBar, View, Text, TouchableOpacity } from 'react-native';
import Colours from './Colours';
import ActionsButton from './ActionsButton';
import PostCard from './PostCard';
import { firebase } from '@react-native-firebase/database';
import { useEffect, useState } from 'react';

function Homescreen(): JSX.Element {

    const [postIds, setPostIds] = useState<string[]>([]);

    useEffect(() => {
        const reference = firebase
            .app()
            .database('https://studentsthoughtsfyp-default-rtdb.europe-west1.firebasedatabase.app/')
            .ref('/posts')
            .on('value', snapshot => {
                console.log(snapshot)
                const data = snapshot.val();
                const ids = Object.keys(data);
                setPostIds(ids);
            });
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.posts}>
                {postIds.map(id => (
                    <PostCard key={id} postID={id} />
                ))}
            </ScrollView>
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
