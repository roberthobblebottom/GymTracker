import { StyleSheet, Text, View } from 'react-native';
import { ExercisesScreen } from './screens/ExercisesScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { PlanScreen } from './screens/PlanScreen';
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { init, db } from './dbhandler';
const Tab = createBottomTabNavigator();
const p = new Promise((resolve, _) =>
  db.transaction(
    t => t.executeSql("SELECT * FROM exercise", [],
      (_, results) => resolve(results.rows._array)
    )
  )
);
export const exercisesContext = React.createContext(null);
export default function App() {
  init();
  // resetTables();   
  return (
    <NavigationContainer>
      <exercisesContext.Provider value={p }>
        <Tab.Navigator >
          <Tab.Screen name="Plan" component={PlanScreen} />
          <Tab.Screen name="Exercises" component={ExercisesScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </exercisesContext.Provider>
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
