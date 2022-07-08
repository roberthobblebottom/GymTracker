import { StyleSheet, Text, View } from 'react-native';
import { ExercisesScreen } from './ExercisesScreen';
import { SettingsScreen } from './SettingsScreen';
import { PlanScreen } from './PlanScreen';
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { init } from './dbhandler';

const Tab = createBottomTabNavigator();
export default function App() {
  // resetTables();
  init();
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Plan" component={PlanScreen} />
        <Tab.Screen name="Exercises" component={ExercisesScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
