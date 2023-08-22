import { StyleSheet, ScrollView, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { useRoute } from '@react-navigation/native';
import PostCard from './PostCard';
import Comments from './Comments';
import Colours from './Colours';

export default function Post() {
  const route = useRoute();
  const postID = route.params.postID;
  const userID = route.params.userID;

  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 3000)
  }

  return (
    <ScrollView style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }>
      <PostCard userID={userID} postID={postID} />
      <Comments postID={postID} refresh={refreshing} />
    </ScrollView >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.background
  }
})