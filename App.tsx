import { Modal, StyleSheet, View, Text, Button, Pressable, TouchableOpacity } from 'react-native';
import { ExercisesScreen } from './screens/ExercisesScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { PlanScreen } from './screens/PlanScreen';
import 'react-native-gesture-handler';
import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { init, db, resetTables } from './dbhandler';
import { Alert, LogBox, TextInput } from 'react-native';
import { Exercise } from './types';
import Toast from 'react-native-simple-toast';
import Layout from './constants/Layout';
import Colors from './constants/Colors';
LogBox.ignoreLogs(['Require cycle:']);
const Tab = createBottomTabNavigator();
const dummy: Exercise[] = [{ name: "fetch new exercises", description: "", imagesJson: "" }]
export const handleResetDBContext = React.createContext(() => { });
export const ExerciseScreenContext = React.createContext(
  { exercises: dummy, deleteFunc: (exercise: Exercise) => { } }
);
export default function App() {
  const [exercises, setExercises] = useState(dummy);
  const [isEditModalVisible, setEditModalVisibility] = useState(false);
  const [selectedExerciseName,setSelectedExerciseName] =useState("");
  const [selectedExerciseDescription,setSelectedExerciseDescription] = useState("");
  const [selectedExerciseImageJson,setSelectedExerciseImageJson] = useState("");
  const [oldExerciseName,setOldExerciseName]=useState("");
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
      exercise.description + "\n" + exercise.imagesJson,
      [{ text: "Delete", onPress: () => deleteConfirmation(exercise) },
      {
        text: "Edit", onPress: () => {
          setEditModalVisibility(true);
          // setSelectedExercise(exercise);
          console.log(oldExerciseName);
          setSelectedExerciseName( exercise.name);
          setOldExerciseName(exercise.name);
          setSelectedExerciseDescription(exercise.description);
          console.log(oldExerciseName);
        }
      },
      { text: "Cancel" }],
      { cancelable: true }
    );
    let deleteConfirmation = (exercise: Exercise) => {
      Alert.alert(
        "Confirmation",
        "Are you sure you want to delete this exercise?",
        [{ text: "Yes", onPress: () => deleteOperation(exercise) },
        { text: "No", onPress: () => handleExerciseCRUDPress(exercise) }],//warning, recursive
        { cancelable: true }
      )
    };
    let deleteOperation = (exercise: Exercise) => {
      db.transaction(t => t.executeSql("DELETE FROM exercise where name= ?", [exercise.name],
        () => {
          let deletedName = exercise.name;
          exercises.splice(exercises.indexOf(exercise), 1);
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

  const updateExercise = () => {
    db.transaction(t => t.executeSql("UPDATE exercise SET name = ?, description = ?,imagesJson=? where name = ?",
      [selectedExerciseName, selectedExerciseDescription, selectedExerciseImageJson, oldExerciseName],
      (_, result) => {
        let e:Exercise = {name:selectedExerciseName,description:selectedExerciseDescription,imagesJson:selectedExerciseImageJson}
        let es:Exercise[] = exercises;
        es.forEach((e1,i) =>{
          if(e1.name ==oldExerciseName) {
            es.splice(i,1,e);
            return;
          }
        })
        setExercises([...es]);
      },
      (_, err) => {
        console.log(err)
        return true;
      }))

  }
  return (
    <NavigationContainer >
      <Modal visible={isEditModalVisible} animationType="fade" transparent={true} >
        <TouchableOpacity style={{ flex: 1 }} onPressIn={() => setEditModalVisibility(false)} >
          <TouchableOpacity style={styles.innerTouchableOpacity}
            onPress={() => { }}
            activeOpacity={1}
          >
            <Text >Edit Exercise Information</Text>
            <View style={{ flexDirection: "row" }}>
              <Text>name:</Text>
              <TextInput placeholder='Type in exercise name.'
                style={{ backgroundColor: styles.textInput.backgroundColor }}
                value={selectedExerciseName}
                onChangeText={setSelectedExerciseName}
              ></TextInput>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text>description</Text>
              <TextInput style={{ backgroundColor: styles.textInput.backgroundColor }}
                multiline={true} placeholder='Type in exercise description.'
                value={selectedExerciseDescription}
                onChangeText={setSelectedExerciseDescription}
              />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
              <Button title='Cancel' onPress={() => setEditModalVisibility(false)} />
              <Button title='Save' onPress={() => {
                updateExercise();
                Toast.show("Exercises information is updated.");
                setEditModalVisibility(false);
              }}></Button>
            </View>

          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
  innerTouchableOpacity: {
    flex: 0,
    margin: 20,
    backgroundColor: "white",
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    top: '40%',
    justifyContent: 'space-around'
  },
  textInput: {
    backgroundColor: Colors.light.altBackground,
  }
});
