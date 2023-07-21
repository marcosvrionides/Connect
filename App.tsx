import { ScrollView, StyleSheet, StatusBar, View } from 'react-native';
import ActionsButton from './ActionsButton';
import PostCard from './PostCard.jsx';

function App(): JSX.Element {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ActionsButton />
      <ScrollView style={styles.posts}>
        <PostCard postID={123} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 10,
    borderColor: 'green'
  }
});

export default App;
