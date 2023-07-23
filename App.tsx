import { ScrollView, StyleSheet, StatusBar, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Homescreen from './src/Homescreen';
import Messages from './src/Messages/Messages';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={Homescreen} options={{headerShown: false}} />
        <Stack.Screen name='Messages' component={Messages} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
