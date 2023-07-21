import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

function PostCard(props): JSX.Element {

    const postID = props.postID;

    return (
        <View style={styles.container}>
            <View style={styles.posterDetails}>
                <Image style={styles.profilePic} />
                <View style={styles.nameDate}>
                    <Text>username</Text>
                    <Text>date</Text>
                    <Text>{postID}</Text>
                </View>
            </View>
            <Text>
                This is a post This is a post This is a post This is a post This is a post This is a post 
                This is a post This is a post This is a post This is a post This is a post This is a post 
                This is a post This is a post This is a post This is a post This is a post This is a post 
                This is a post This is a post This is a post This is a post This is a post This is a post
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        gap: 10,
        borderWidth: 2,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        width: '100%',
        padding: 2
    },
    posterDetails: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10
    },
    nameDate: {
        display: 'flex',
        justifyContent: 'center'
    }
    ,
    profilePic: {
        width: 50,
        height: 50,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 25
    }
});

export default PostCard;