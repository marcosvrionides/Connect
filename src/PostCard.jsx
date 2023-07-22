import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

function PostCard(props): JSX.Element {

    const postID = props.postID;
    const hasMedia = props.hasMedia;

    return (
        <View style={styles.container}>
            <View style={styles.topSection}>
                {/* <Image style={styles.profilePic} /> */}
                <Ionicons name="person-circle" size={50} color='black' />
                <View style={styles.nameDate}>
                    <Text style={styles.posterName}>username</Text>
                    <Text style={styles.postDate}>01:05 - 22/07/23</Text>
                </View>
            </View>
            <Text style={styles.postText}>
                This is a post This is a post This is a post This is a post This is a post This is a post
                This is a post This is a post This is a post This is a post
            </Text>
            {hasMedia && <Image style={styles.mediaPreview} />}
            <Text>{postID}</Text>
            <View style={styles.bottomSection}>
                <TextInput style={styles.commentInput} />
                <MaterialCommunityIcons name='comment-minus-outline' size={25} color='black' />
                <FontAwesome name='heart-o' size={25} color='black' />
                <Feather name='send' size={25} color='black' />
            </View>

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
        padding: 10,
        marginBottom: 10,
    },
    topSection: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10
    },
    bottomSection: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'flex-end'
    },
    nameDate: {
        display: 'flex',
        justifyContent: 'center'
    },
    profilePic: {
        width: 50,
        height: 50,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 25
    },
    posterName: {
        fontWeight: 'bold',
        color: 'black'
    },
    postDate: {
        fontWeight: '300',
        color: 'black'
    },
    postText: {
        fontWeight: 'normal',
        color: 'black',
    },
    mediaPreview: {
        width: '100%',
        height: 500,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 25
    },
    commentInput: {
        flex: 1,
        height: 25,
        borderWidth: 2,
        borderColor: 'black',
    }
});

export default PostCard;