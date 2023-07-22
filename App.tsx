import { ScrollView, StyleSheet, StatusBar, View } from 'react-native';
import ActionsButton from './src/ActionsButton';
import PostCard from './src/PostCard.jsx';

function App(): JSX.Element {
  return (
    <View style={styles.container}>
      <ActionsButton />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  posts: {
    display: 'flex',
    flexDirection: 'column',
  },
});

export default App;
