import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Homescreen from './src/Homescreen';
import Messages from './src/Messages/Messages';
import OpenChat from './src/Messages/OpenChat';
import auth from '@react-native-firebase/auth';
import { useEffect, useState } from 'react';
import Login from './src/Login';
import Settings from './src/Settings';
import NewPostForm from './src/NewPostForm';
import Profile from './src/Profile';
import Comments from './src/Comments';
import { GAMBannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import Post from './src/Post';
import NewCommentForm from './src/NewCommentForm';
// import ThemeSelector from './src/ThemeSelector';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {

  const [showAds, setShowAds] = useState(true);

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <Login />
    );
  }

  const onAdFailedToLoad = (error) => {
    console.log('error loading ad', error.message);
    setShowAds(false);
  }

  return (
    <>
      {showAds &&
        <GAMBannerAd
          unitId={'ca-app-pub-7497957931538271/8908530578'}
          sizes={[BannerAdSize.ANCHORED_ADAPTIVE_BANNER]}
          onAdFailedToLoad={onAdFailedToLoad}
        />}
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='Home' component={Homescreen} options={{ headerShown: false }} />
          <Stack.Screen name='Messages' component={Messages} options={{ headerShown: false }} />
          <Stack.Screen name='OpenChat' component={OpenChat} options={{ headerShown: false }} />
          <Stack.Screen name='Settings' component={Settings} options={{ headerShown: false }} />
          <Stack.Screen name='NewPostForm' component={NewPostForm} options={{ headerShown: false }} />
          <Stack.Screen name='Profile' component={Profile} options={{ headerShown: false }} />
          <Stack.Screen name='Comments' component={Comments} options={{ headerShown: false }} />
          <Stack.Screen name='Post' component={Post} options={{ headerShown: false }} />
          <Stack.Screen name='NewComment' component={NewCommentForm} options={{ headerShown: false }} />
          {/* <Stack.Screen name='ThemeSelector' component={ThemeSelector} options={{ headerShown: false }} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );

}

export default App;
