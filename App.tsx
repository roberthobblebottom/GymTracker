import { StyleSheet, Text, View } from 'react-native';
import { ExercisesScreen } from './ExercisesScreen';
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import "reflect-metadata";
import { connect,AppDataSource } from './dbHandler';
import { Exercise } from "./entities/Exercise";


function PlanScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Plan Screen</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings Screen</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();
export default function App() {
  connect();

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
