import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { useRoute } from '@react-navigation/native';
import database from '@react-native-firebase/database';

export default function Profile() {

    const route = useRoute();
    const uid = route.params.uid;
    const [userProfile, setUserProfile] = useState(null);

    const userProfileRef = database().ref(`users/${uid}`);

    useEffect(() => {
        userProfileRef.on('value', (snapshot) => {
            setUserProfile(snapshot.val());
        });

        return () => {
            userProfileRef.off();
        };
    }, [uid]);

    console.log(userProfile)

    return (
        <View style={styles.container}>
            {userProfile ? (
                <View>
                    <Text style={styles.title}>{userProfile.displayName}</Text>
                    <Text>{userProfile.about || 'No bio :('}</Text>
                    {/* Add more fields based on your user profile data structure */}
                </View>
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16
    },
});
