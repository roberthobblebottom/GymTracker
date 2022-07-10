import { StyleSheet, } from 'react-native';
import { ExercisesScreen } from './screens/ExercisesScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { PlanScreen } from './screens/PlanScreen';
import 'react-native-gesture-handler';
import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { init, db, resetTables } from './dbhandler';
import { Alert } from 'react-native';
import { Exercise } from './types';
import Toast from 'react-native-simple-toast';
const Tab = createBottomTabNavigator();
const dummy: Exercise[] = [{ name: "fetch new exercises", description: "", imageJson: "" }]
export const handleResetDBContext = React.createContext(() => { });
export const ExerciseScreenContext = React.createContext(
  { exercises: dummy, deleteFunc: (exercise: Exercise) => { } }
);
export default function App() {
  const [exercises, setExercises] = useState(dummy);
  console.log("In App Function");
  if (exercises[0].name == "fetch new exercises")
    db.transaction(t => t.executeSql(
      "SELECT * from exercise",
      undefined,
      (_, r) => setExercises(r.rows._array)
    ));
  init();

  const handleResetDB = () => {
    resetTables();
    setExercises(dummy);
  }

  const handleExerciseCRUDPress = (exercise: Exercise) => { 
    Alert.alert(
      exercise.name,
      exercise.description + "\n" + exercise.imageJson,
      [{ text: "Delete", onPress: () => deleteConfirmation(exercise) }],
      { cancelable: true }
    );
    let deleteConfirmation = (exercise: Exercise) => {
      Alert.alert(
        "Confirmation",
        "Are you sure you want to delete this exercise?",
        [{ text: "Yes", onPress: () => deleteOperation(exercise) },
        { text: "No" }],
        { cancelable: true }
      )
    };
    let deleteOperation = (exercise: Exercise) => {
      db.transaction(t => t.executeSql("DELETE FROM exercise where name= ?", [exercise.name],
        () => {
          let deletedName = exercise.name;
          let newExercises: Exercise[] = exercises.splice(exercises.indexOf(exercise), 1);
          //correct way of removing element from a array for me. Not using delete keyword which leaves a undefined space
          Toast.show("The exercise " + deletedName + " has been deleted");
          setExercises([...exercises]);
        },
        (_, err) => {
          console.log(err);
          return true;
        }
      ))
    }
  }

  return (
    <NavigationContainer>
      <handleResetDBContext.Provider value={handleResetDB}>
        <ExerciseScreenContext.Provider value={{ exercises: exercises, deleteFunc: handleExerciseCRUDPress }}>
          <Tab.Navigator >
            <Tab.Screen name="Plan" component={PlanScreen} />
            <Tab.Screen name="Exercises" component={ExercisesScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
          </Tab.Navigator>
        </ExerciseScreenContext.Provider>
      </handleResetDBContext.Provider>
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
