import { ScrollView, StyleSheet, StatusBar, View, Text, TouchableOpacity } from 'react-native';
import Colours from './Colours';
import ActionsButton from './ActionsButton';
import PostCard from './PostCard';
import { firebase } from '@react-native-firebase/database';
import { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';

function Homescreen(): JSX.Element {

    const handleLogout = () => {
        auth()
            .signOut()
            .then(() => {
                console.log('User logged out successfully!');
            })
            .catch((error) => {
                console.log('Error occurred while logging out:', error);
            });
    };

    const [postIds, setPostIds] = useState<string[]>([]);

    useEffect(() => {
        const reference = firebase
            .app()
            .database('https://studentsthoughtsfyp-default-rtdb.europe-west1.firebasedatabase.app/')
            .ref('/posts')
            .on('value', snapshot => {
                const data = snapshot.val();
                const ids = Object.keys(data);
                setPostIds(ids);
            });
    }, []);

    return (
        <View style={styles.container}>
            <Text style={{ color: 'white' }}>{auth().currentUser.displayName}</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
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
    button: {
        backgroundColor: 'red', // Use your desired color for the logout button
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Homescreen;
