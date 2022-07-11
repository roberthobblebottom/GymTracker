import { Modal, StyleSheet, View, Text, Button, TouchableOpacity, Alert, LogBox, TextInput } from 'react-native';
import { ExercisesScreen } from './screens/ExercisesScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { PlanScreen } from './screens/PlanScreen';
import 'react-native-gesture-handler';
import React, { JSXElementConstructor, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { init, db, resetTables } from './dbhandler';
import { Exercise } from './types';
import Toast from 'react-native-simple-toast';
import Colors from './constants/Colors';
import { setBackgroundColorAsync } from 'expo-system-ui';

LogBox.ignoreLogs(['Require cycle:']);
const Tab = createBottomTabNavigator();
const dummy: Exercise[] = [{ name: "fetch new exercises", description: "", imagesJson: "" }]
export const handleResetDBContext = React.createContext(() => { });
export const ExerciseScreenContext = React.createContext(
  { exercises: dummy, deleteFunc: (exercise: Exercise) => { }, createFunc: () => { } }
);
export default function App() {
  const [exercises, setExercises] = useState(dummy);
  const [isDialogModalVisible, setDialogModalVisibility] = useState(false);
  const [aExerciseName, setaExerciseName] = useState("");
  const [aExerciseDescription, setaExerciseDescription] = useState("");
  const [aExerciseImageJson, setaExerciseImageJson] = useState("");
  const [aExercise, setaExercise] = useState(dummy[0]);
  const [oldExerciseName, setOldExerciseName] = useState("");


  const [textInputBackgroundColor, setTextInputBackgroundColor] = useState("white");
  const [isEditable, setEditability] = useState(false);
  const ExerciseInformationText = "Exercise Information";
  const EditExerciseText = "Edit Exercise:";
  const CreateExerciseText = "Create Exercise:";
  const [dialogText, setDialogText] = useState(ExerciseInformationText);

  //init data required in the app
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
    setEditability(false);
    setTextInputBackgroundColor("white");
    setaExercise(exercise);
    setaExerciseName(exercise.name);
    setaExerciseDescription(exercise.description);
    setOldExerciseName(exercise.name);
    setDialogText(ExerciseInformationText);
    setDialogModalVisibility(true);
  }

  const ButtonSet = () => {
    if (dialogText == ExerciseInformationText)
      return (
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Button title="delete" onPress={() => deleteConfirmation(aExercise)} />
          <Button title='Edit' onPress={() => {
            setOldExerciseName(oldExerciseName);
            setEditability(true);
            setTextInputBackgroundColor(styles.textInput.backgroundColor);
            setDialogText(EditExerciseText);
          }} />
          <Button title='Cancel' onPress={() => {
            cancelDialog();
          }} />
        </View>
      );
    else if (dialogText == CreateExerciseText) {
      return (
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Button title='Save' onPress={() => createExercise()}></Button>
          <Button title='Cancel' onPress={() => cancelDialog()} />
        </View>
      );
    }
    else
      return (
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Button title='Save' onPress={() => updateExercise()}></Button>
          <Button title='Back' onPress={() => handleExerciseCRUDPress(aExercise)} />
          <Button title='Cancel' onPress={() => cancelDialog()} />
        </View>
      );
  }
  function cancelDialog() {
    setDialogModalVisibility(false);
  }

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
    console.log("delete operation function");
    db.transaction(t => t.executeSql("DELETE FROM exercise where name= ?", [exercise.name],
      () => {
        console.log("in here");
        let deletedName = exercise.name;
        let es: Exercise[] = exercises;
        es.forEach((e1, i) => {
          if (e1.name == deletedName) {
            es.splice(i, 1);
            return;
          }
        });
        //correct way of removing element from a array for me. Not using delete keyword which leaves a undefined space
        Toast.show("The exercise " + deletedName + " has is deleted.");
        setExercises([...es]);
        setDialogModalVisibility(false);
      },
      (_, err) => {
        console.log(err);
        return true;
      }
    ));
  }
  const updateExercise = () => {
    console.log("update operation function");
    db.transaction(t => t.executeSql("UPDATE exercise SET name = ?, description = ?,imagesJson=? where name = ?",
      [aExerciseName, aExerciseDescription, aExerciseImageJson, oldExerciseName],
      (_, result) => {
        let e: Exercise = { name: aExerciseName, description: aExerciseDescription, imagesJson: aExerciseImageJson }
        let es: Exercise[] = exercises;
        es.forEach((e1, i) => {
          if (e1.name == oldExerciseName) {
            es.splice(i, 1, e);
            return;
          }
        })
        setExercises([...es]);
        Toast.show("The exercise is updated.")
        setDialogModalVisibility(false);
      },
      (_, err) => {
        console.log(err)
        return true;
      }))

  }

  const showCreateExerciseDialog = () => {
    console.log("in createExercise function")
    setEditability(true);
    setTextInputBackgroundColor(Colors.light.altBackground);
    setaExerciseName("");
    setaExerciseDescription("");
    setDialogText(CreateExerciseText);
    setDialogModalVisibility(true);
  }
  function createExercise() {
    db.transaction(t => t.executeSql("INSERT INTO exercise VALUES (?,?,?)",
      [aExerciseName, aExerciseDescription, aExerciseImageJson],
      (_, result) => { 
        const es:Exercise[] = exercises;
        es.push({name:aExerciseName,description:aExerciseDescription,imagesJson:aExerciseImageJson});
        setExercises([...es]);
        Toast.show("The exercise "+aExerciseName+" is created.");
        cancelDialog();
      },
      (_, err) => {
        return true;
      }))
  }
  return (
    <NavigationContainer >
      <Modal visible={isDialogModalVisible} animationType="fade" transparent={true} >
        <TouchableOpacity style={{ flex: 1 }} onPressIn={() => setDialogModalVisibility(false)} >
          <TouchableOpacity style={styles.innerTouchableOpacity}
            onPress={() => { }}
            activeOpacity={1}
          >
            <Text >{dialogText}</Text>
            <View style={{ flexDirection: "row" }}>
              <Text>name:</Text>
              <TextInput placeholder='Type in exercise name.'
                style={{ backgroundColor: textInputBackgroundColor, color: "black" }}
                value={aExerciseName}
                onChangeText={setaExerciseName}
                editable={isEditable}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text>description</Text>
              <TextInput style={{ backgroundColor: textInputBackgroundColor, color: "black" }}
                multiline={true} placeholder='Type in exercise description.'
                value={aExerciseDescription}
                onChangeText={setaExerciseDescription}
                editable={isEditable}
              />
            </View>
            {ButtonSet()}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      <handleResetDBContext.Provider value={handleResetDB}>
        <ExerciseScreenContext.Provider value={
          {
            exercises: exercises,
            deleteFunc: handleExerciseCRUDPress,
            createFunc: showCreateExerciseDialog
          }}>
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
    top: '68%',
    justifyContent: 'space-around'
  },
  textInput: {
    backgroundColor: Colors.light.altBackground,
  }
});
