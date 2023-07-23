import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput } from 'react-native';
import Colours from './Colours'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

function Messages(): JSX.Element {

    return (
        <View style={styles.container}>
            <Text>Hello messages</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        
    },
});

export default Messages;