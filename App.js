import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import MenuPane from './components/MenuPane';
import User from './components/User';
import Report from './components/Report';
import Login from './components/Login';
import Admin from './components/Admin';

const App = () => {
  const Stack = createStackNavigator();
  return (
    
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false, gestureEnabled: false }}>
          <Stack.Screen name="Login" component={Login}/>
          <Stack.Screen name="User" component={User} options={{ gestureEnabled: true }} />
          <Stack.Screen name="Report" component={Report} />
          <Stack.Screen name="Admin" component={Admin} options={{ gestureEnabled: true }} />
          <Stack.Screen name="MenuPane" component={MenuPane} options={{ gestureEnabled: false }} />
        </Stack.Navigator>
          
        <Toast />
      </NavigationContainer>
  );

  // return (
  //   <NavigationContainer>
  //     <MenuPane />
  //   </NavigationContainer>
  // );
};

export default App;