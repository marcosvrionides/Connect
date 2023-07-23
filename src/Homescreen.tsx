import { ScrollView, StyleSheet, StatusBar, View, Text } from 'react-native';
import Colours from './Colours';
import ActionsButton from './ActionsButton';
import PostCard from './PostCard';

function Homescreen(): JSX.Element {
    return (
        <View style={styles.container}>
            <ScrollView style={styles.posts}>
                <PostCard postID={1} hasMedia={true} />
                <PostCard postID={2} hasMedia={false} />
                <PostCard postID={3} hasMedia={false} />
                <PostCard postID={1} hasMedia={true} />
                <PostCard postID={2} hasMedia={false} />
                <PostCard postID={3} hasMedia={false} />
                <PostCard postID={1} hasMedia={true} />
                <PostCard postID={2} hasMedia={false} />
                <PostCard postID={3} hasMedia={true} />
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
