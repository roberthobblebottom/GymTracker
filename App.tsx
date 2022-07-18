import {
  Modal, StyleSheet, View, Text, Button,
  TouchableOpacity, Alert, LogBox, TextInput
} from 'react-native';
import { ExercisesScreen } from './screens/ExercisesScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { PlanScreen } from './screens/PlanScreen';
import 'react-native-gesture-handler';
import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { init, db, resetTables } from './dbhandler';
import { Exercise } from './types';
import { MajorSet } from './types';
import Toast from 'react-native-simple-toast';
import Colors from './constants/Colors';
import Layout from './constants/Layout';
import { Calendar } from 'react-native-calendars';
import DropDownPicker, { ItemType, ValueType } from 'react-native-dropdown-picker';
LogBox.ignoreLogs(['Require cycle:']);
const Tab = createBottomTabNavigator();
const dummyDate = { year: 0, month: 0, day: 0, timestamp: 0, dateString: "" };
const dummyExercises: Exercise[] = [{ name: "", description: "", imagesJson: "" }];
const dummyMajorSet: MajorSet[] = [{
  id: 0,
  exercise: dummyExercises[0],
  reps: 0,
  percent_complete: 0,
  sets: 0,
  duration_in_seconds: 0,
  weight: 0,
  notes: "",
  date: dummyDate
}];
export const handleResetDBContext = React.createContext(() => { });
export const ExerciseScreenContext = React.createContext(
  { exercises: dummyExercises, handleSelected: (exercise: Exercise) => { }, handleCreate: () => { } }
);
export const MajorSetContext = React.createContext({
  majorSet: dummyMajorSet, handleSelected: (majorSet: MajorSet) => { }, handleCreate: (majorSet: MajorSet) => { }
});
export default function App() {
  //for exercise
  const [exercises, setExercises] = useState(dummyExercises);
  const [exercisesForDropDown, setExercisesForDropDown]: [ItemType<ValueType>[], Dispatch<SetStateAction<ItemType<ValueType>[]>>] =
    useState([({ label: dummyExercises[0].name, value: dummyExercises[0] } as ItemType<any>)]);
  const [isExDialogVisible, setExDialogVisibility] = useState(false);//Ex = exercise
  const [aExercise, setaExercise] = useState(dummyExercises[0]);
  const [oldExerciseName, setOldExerciseName] = useState("");
  const ExerciseInformationText = "Exercise Information";
  const EditExerciseText = "Edit Exercise:";
  const CreateExerciseText = "Create Exercise:";

  //shared
  const [dialogText, setDialogText] = useState("");
  const [textInputBackgroundColor, setTextInputBackgroundColor] = useState(styles.textInputViewOnly);
  const [isEditable, setEditability] = useState(false);

  //for majorSet
  const [isCalendarDialogVisible, setCalendarDialogVisibility] = useState(false);
  const [isPlanDialogVisible, setPlanDialogVisibility] = useState(false);
  const [majorSet, setMajorSet] = useState(dummyMajorSet);
  const [aMajorSet, setAMajorSet] = useState(majorSet[0]);
  const CreateMajorSetText = "Create:";
  const MajorSetInformation = "Information:";
  const EditMajorSetText = "Edit";
  const [isDropDownVisible, setDropDownVisibility] = useState(false);
  const [dropDownExerciseNameSelected, setDropDownExerciseNameSelected] = useState(dummyExercises[0].name);
  const [currentDate, setCurrentDate] = useState(dummyDate);
  const [changeButtonBackgroundColor, setChangeButtonBackgroundColor] = useState(styles.changeDateButtonDisabled);
  useEffect(() => {
    if (exercises[0].name == "" || exercises.length <= 0)
      db.transaction(t => t.executeSql(
        "SELECT * from exercise",
        undefined,
        (_, r) => {
          let tempExercises:Exercise[] = r.rows._array;
          setExercises(r.rows._array);
          tempExercises.forEach((elm: Exercise) => {
            exercisesForDropDown.push({ label: elm.name, value: elm.name });
          });
          if (majorSet[0] != undefined)
            if (majorSet[0].exercise == dummyExercises[0])
              db.transaction(
                t => {
                  t.executeSql("SELECT * FROM major_sets", [],
                    (_, results) => {
                      let tempMajorSet: MajorSet[] = results.rows._array;
                      let a = results.rows._array.slice();
                      console.log(exercises.length);
                      tempMajorSet.forEach((ms, index, arr) => {
                        ms.date = JSON.parse(ms.date.toString());
                        let t = tempExercises.filter(ex => {
                          if (ex.name == a[index].exercise) return ex;
                        })[0];
                        console.log(t);
                        tempMajorSet[index].exercise = t;
                      });
                      setMajorSet(tempMajorSet);
                      console.log(majorSet);
                    },
                    (_, err) => {
                      console.log(err)
                      return true;
                    });
                }
              )
        },
        (_, e) => { console.log(e); return true; }
      ));
    // if (majorSet.length <= 1 )

  }, [majorSet, exercises]);
  init();

  const ButtonSet = () => {
    switch (dialogText) {
      case ExerciseInformationText:
        return (
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
            <Button title="delete" onPress={() => deleteExerciseConfirmation(aExercise)} />
            <Button title='Edit' onPress={() => {
              setOldExerciseName(oldExerciseName);
              setEditability(true);
              setTextInputBackgroundColor(styles.textInputEditable);
              setDialogText(EditExerciseText);
            }} />
            <Button title='Cancel' onPress={() => cancelDialog()} />
          </View>
        );
      case CreateExerciseText:
        return (
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
            <Button title='Save' onPress={() => createExercise()}></Button>
            <Button title='Cancel' onPress={() => cancelDialog()} />
          </View>
        );
      case EditExerciseText:
        return (
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
            <Button title='Save' onPress={() => updateExercise()}></Button>
            <Button title='Back' onPress={() => handleExerciseCRUDPress(aExercise)} />
            <Button title='Cancel' onPress={() => cancelDialog()} />
          </View>
        );
      case CreateMajorSetText:
        return (
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
            <Button title='Save' onPress={() => createMajorSet()}></Button>
            <Button title='Cancel' onPress={() => cancelDialog()} />
          </View>
        );
      case MajorSetInformation:
        return (
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
            <Button title="delete" onPress={() => deleteMajorSetConfirmation(aMajorSet)} />
            <Button title='Edit' onPress={() => {
              setChangeButtonBackgroundColor(styles.changeDateButtonEnabled);
              setEditability(true);
              setTextInputBackgroundColor(styles.textInputEditable);
              setDialogText(EditMajorSetText);
              setDropDownVisibility(true);
              setAMajorSet(aMajorSet);
              setDropDownExerciseNameSelected(aMajorSet.exercise.name);
              setCurrentDate(aMajorSet.date);
            }} />
            <Button title='Cancel' onPress={() => cancelDialog()} />
          </View>
        );
      case EditMajorSetText:
        return (
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
            <Button title='Save' onPress={() => updateMajorSet()}></Button>
            <Button title='Back' onPress={() => handleMajorSetCRUDPress(aMajorSet)} />
            <Button title='Cancel' onPress={() => cancelDialog()} />
          </View>
        );
    }
  }
  const handleResetDB = () => {
    resetTables();
    setExercises(dummyExercises);
    setMajorSet(dummyMajorSet);
  }

  const handleExerciseCRUDPress = (exercise: Exercise) => {
    setEditability(false);
    setTextInputBackgroundColor(styles.textInputViewOnly);
    setaExercise(exercise);
    setOldExerciseName(exercise.name);
    setDialogText(ExerciseInformationText);
    setExDialogVisibility(true);
  }


  function cancelDialog() {
    setExDialogVisibility(false);
    setCalendarDialogVisibility(false);
    setPlanDialogVisibility(false);
  }

  let deleteExerciseConfirmation = (exercise: Exercise) => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this exercise?",
      [{ text: "Yes", onPress: () => deleteExercise(exercise) },
      { text: "No", onPress: () => handleExerciseCRUDPress(exercise) }],//warning, recursive
      { cancelable: true }
    )
  };
  let deleteExercise = (exercise: Exercise) => {
    db.transaction(t => t.executeSql("DELETE FROM exercise where name= ?", [exercise.name],
      () => {
        let deletedName = exercise.name;
        let es: Exercise[] = exercises.slice();
        es.forEach((currentExercise, i) => {
          if (currentExercise.name == deletedName) {
            es.splice(i, 1);
            return;
          }
        });
        //correct way of removing element from a array for me. Not using delete keyword which leaves a undefined space
        Toast.show("The exercise " + deletedName + " has is deleted.");
        setExercises([...es]);
        setExDialogVisibility(false);
      },
      (_, err) => {
        console.log(err);
        return true;
      }
    ));
  }
  const updateExercise = () => {
    db.transaction(t => t.executeSql("UPDATE exercise SET name = ?, description = ?,imagesJson=? where name = ?",
      [aExercise.name, aExercise.description, aExercise.imagesJson, oldExerciseName],
      (_, result) => {
        let exerciseToBeUpdated: Exercise = { name: aExercise.name, description: aExercise.description, imagesJson: aExercise.imagesJson }
        let es: Exercise[] = exercises.slice();
        es.forEach((currentExercise, i) => {
          if (currentExercise.name == oldExerciseName) {
            es.splice(i, 1, exerciseToBeUpdated);
            return;
          }
        })
        setExercises([...es]);
        Toast.show("The exercise is updated.")
        setExDialogVisibility(false);
      },
      (_, err) => {
        console.log(err)
        return true;
      }))

  }

  const showCreateExerciseDialog = () => {
    setaExercise(dummyExercises[0]);
    setEditability(true);
    setTextInputBackgroundColor(styles.textInputEditable);
    setDialogText(CreateExerciseText);
    setExDialogVisibility(true);
  }

  function createExercise() {
    db.transaction(t => t.executeSql("INSERT INTO exercise VALUES (?,?,?)",
      [aExercise.name, aExercise.description, aExercise.imagesJson],
      (_, result) => {
        const es: Exercise[] = exercises.slice();
        es.push({ name: aExercise.name, description: aExercise.description, imagesJson: aExercise.imagesJson });
        setExercises([...es]);
        Toast.show("The exercise " + aExercise.name + " is created.");
        cancelDialog();
      },
      (_, err) => {
        console.log(err)
        return true;
      }))
  }
  function handleMajorSetCRUDPress(majorSet: MajorSet) {
    setChangeButtonBackgroundColor(styles.changeDateButtonDisabled);
    setEditability(false);
    setTextInputBackgroundColor(styles.textInputViewOnly);
    setAMajorSet(majorSet);
    setDialogText(MajorSetInformation);
    setDropDownVisibility(false);
    setDropDownExerciseNameSelected(majorSet.exercise.name);
    setExDialogVisibility(false);
    setPlanDialogVisibility(true);
    setCurrentDate(majorSet.date);
  }
  let deleteMajorSetConfirmation = (ms: MajorSet) => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this major set?",
      [{ text: "Yes", onPress: () => deleteMajorSet(ms.id) },
      { text: "No", onPress: () => handleMajorSetCRUDPress(ms) }],//warning, recursive
      { cancelable: true }
    )
  };
  let deleteMajorSet = (id: number) => {
    db.transaction(t => t.executeSql("DELETE FROM major_sets where id= ?", [id],
      () => {
        let ms = majorSet.slice();
        ms.forEach((ms1, i) => {
          if (ms1.id == id) {
            ms.splice(i, 1);
            return;
          }
        });
        //correct way of removing element from a array for me. Not using delete keyword which leaves a undefined space
        Toast.show("The major set is deleted.");
        setMajorSet([...ms]);
        cancelDialog();
      },
      (_, err) => {
        console.log(err);
        return true;
      }
    ));
  }
  const updateMajorSet = () => {
    if (dropDownExerciseNameSelected == undefined || dropDownExerciseNameSelected == "") {
      Toast.show("exercise must be selected")
      return;
    }
    let theexercise = exercises.filter((e, i, a) => {
      if (e.name == dropDownExerciseNameSelected) return e;
    })[0];
    console.log(dropDownExerciseNameSelected);
    console.log(currentDate);
    db.transaction(t => t.executeSql(`UPDATE major_sets 
    SET exercise=?,reps=?,percent_complete=?,sets=?,duration_in_seconds=?,weight=?,notes=?,date=? 
    WHERE id=?`,
      [dropDownExerciseNameSelected, aMajorSet.reps, aMajorSet.percent_complete, aMajorSet.sets,
        aMajorSet.duration_in_seconds, aMajorSet.weight,
        aMajorSet.notes, JSON.stringify(currentDate), aMajorSet.id],
      (_, result) => {
        let toBeUpdated: MajorSet = {
          id: aMajorSet.id, exercise: theexercise, reps: aMajorSet.reps,
          percent_complete: aMajorSet.percent_complete, sets: aMajorSet.sets,
          duration_in_seconds: aMajorSet.duration_in_seconds,
          weight: aMajorSet.weight, notes: aMajorSet.notes, date: currentDate
        }
        let ms: MajorSet[] = majorSet.slice();
        ms.forEach((currentMajorSet, i) => {
          if (currentMajorSet.id == aMajorSet.id) {
            ms.splice(i, 1, toBeUpdated);
            return;
          }
        })
        setMajorSet([...ms]);
        Toast.show("The major set is updated.")
        cancelDialog();
      },
      (_, err) => {
        console.log(err)
        return true;
      }))

  }

  function showCreateMajorSetDialog() {
    setChangeButtonBackgroundColor(styles.changeDateButtonEnabled);
    setEditability(true);
    setTextInputBackgroundColor(styles.textInputEditable);
    setAMajorSet(dummyMajorSet[0]);
    setDialogText(CreateMajorSetText);
    setPlanDialogVisibility(true);
    setDropDownExerciseNameSelected(exercises[0].name);
    let d = new Date();
    let monthNumber: number = d.getMonth() + 1;
    let month: string = monthNumber < 10 ? "0" + monthNumber.toString() : monthNumber.toString();
    let day: string = d.getDate() < 10 ? "0" + d.getDate().toString() : d.getDate().toString();
    setCurrentDate({
      year: d.getFullYear(), month: monthNumber, day: d.getDate(), timestamp: 0,
      dateString: d.getFullYear() + "-" + month + "-" + day
    });
  }

  function createMajorSet() {
    let e1: Exercise;
    exercises.forEach(e => {
      if (e.name == dropDownExerciseNameSelected) aMajorSet.exercise = e;
    });
    db.transaction(t => {
      t.executeSql(`INSERT INTO major_sets
           (exercise,reps,percent_complete,sets,duration_in_seconds,weight,notes,date)  
           VALUES(?,?,?,?,?,?,?,?);`,
        [aMajorSet.exercise.name, aMajorSet.reps, aMajorSet.percent_complete, aMajorSet.sets,
        aMajorSet.duration_in_seconds, aMajorSet.weight,
        aMajorSet.notes, JSON.stringify(currentDate)],
        (_, r) => {
          aMajorSet.date = currentDate;
          let m = majorSet.slice();
          m.push(aMajorSet);
          setMajorSet([...m]);
          cancelDialog();
        },
        (_, e) => {
          console.log(e);
          cancelDialog();
          return true;
        }
      )
    });
  }
  return (
    <>
      <NavigationContainer>
        <Modal visible={isPlanDialogVisible} animationType="fade" transparent={true}>
          <TouchableOpacity style={{ flex: 1 }} onPressIn={() => setPlanDialogVisibility(false)}>
            <TouchableOpacity style={styles.innerTouchableOpacity2} activeOpacity={1}>
              <Text style={{ fontSize: Layout.defaultFontSize, fontWeight: "bold" }}>{dialogText}</Text>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <Text style={{ fontSize: Layout.defaultFontSize }}>
                  exercise:
                </Text>
                <DropDownPicker
                  style={{ width: 200}}
                  containerStyle={{ width: 200 }}
                  disabledStyle={{ borderColor: "white" }}
                  open={isDropDownVisible}
                  items={exercisesForDropDown}
                  value={dropDownExerciseNameSelected}
                  setOpen={setDropDownVisibility}
                  setValue={setDropDownExerciseNameSelected}
                  disabled={!isEditable}
                />

              </View>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <Text style={{ fontSize: Layout.defaultFontSize }}
                > reps: </Text>
                <TextInput placeholder='reps'
                  style={textInputBackgroundColor}
                  value={aMajorSet.reps.toString()}
                  onChangeText={text => {
                    const rep = Number(text);
                    const s = Object.assign({}, aMajorSet);
                    if (Number.isNaN(rep)) {
                      Toast.show("Symbols other than numeric ones are not allow.");
                      s.reps = 0;
                    } else s.reps = rep;
                    setAMajorSet(s);
                  }}
                  editable={isEditable}
                  keyboardType="numeric" />
              </View>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <Text style={{ fontSize: Layout.defaultFontSize }}
                > percentage complete: </Text>
                <TextInput placeholder='percentage complete'
                  style={textInputBackgroundColor}
                  value={aMajorSet.percent_complete.toString()}
                  onChangeText={text => {
                    const p = Number(text);
                    const s = Object.assign({}, aMajorSet);
                    if (Number.isNaN(p) || p > 100) {
                      Toast.show("Percentage cannot go above 100% and symbols other than numeric ones are not allow.");
                      s.percent_complete = 0;
                    }
                    else s.percent_complete = p;
                    setAMajorSet(s);

                  }}
                  editable={isEditable}
                  keyboardType="numeric" />
              </View>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <Text style={{ fontSize: Layout.defaultFontSize }}
                > sets: </Text>
                <TextInput placeholder='sets'
                  style={textInputBackgroundColor}
                  value={aMajorSet.sets.toString()}
                  onChangeText={text => {
                    const sets = Number(text);
                    const s = Object.assign({}, aMajorSet);
                    if (Number.isNaN(sets)) {
                      Toast.show("Symbol other than numeric ones are not allow.");
                      s.sets = 0;
                    } else s.sets = sets;
                    setAMajorSet(s);
                  }}
                  editable={isEditable}
                  keyboardType="numeric" />
              </View>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <Text style={{ fontSize: Layout.defaultFontSize }}
                > duration: </Text>
                <TextInput placeholder='seconds'
                  style={textInputBackgroundColor}
                  value={aMajorSet.duration_in_seconds.toString()}
                  onChangeText={text => {
                    const duration = Number(text);
                    const s = Object.assign({}, aMajorSet);
                    if (Number.isNaN(duration)) {
                      Toast.show("Symbol other than numeric ones are not allow.");
                      s.duration_in_seconds = 0;
                    } else s.duration_in_seconds = duration;
                    setAMajorSet(s);
                  }}
                  editable={isEditable}
                  keyboardType="numeric" />
              </View>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <Text style={{ fontSize: Layout.defaultFontSize }}
                > weight: </Text>
                <TextInput placeholder='kg'
                  style={textInputBackgroundColor}
                  value={aMajorSet.weight.toString()}
                  onChangeText={text => {
                    const weight = Number(text);
                    const s = Object.assign({}, aMajorSet);
                    if (Number.isNaN(weight)) {
                      Toast.show("Symbol other than numeric ones are not allow.");
                      s.weight = 0;
                    } else s.weight = weight;
                    setAMajorSet(s);

                  }}
                  editable={isEditable}
                  keyboardType="numeric" />
              </View>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <Text style={{ fontSize: Layout.defaultFontSize }}
                > notes: </Text>
                <TextInput placeholder='notes'
                  style={textInputBackgroundColor}
                  value={aMajorSet.notes.toString()}
                  onChangeText={text => {
                    const s = Object.assign({}, aMajorSet);
                    s.notes = text;
                    setAMajorSet(s);
                  }}
                  editable={isEditable} />

              </View>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <Text style={{ fontSize: Layout.defaultFontSize }}> date: </Text>
                <Text>{currentDate.dateString}</Text>
                <TouchableOpacity
                  style={changeButtonBackgroundColor}
                  disabled={!isEditable} onPress={() => {
                    setCalendarDialogVisibility(true);
                  }} >
                  <Text style={{ color: "white" }}>Change Date</Text>
                </TouchableOpacity>
                <Modal visible={isCalendarDialogVisible} animationType="fade" transparent={true} >
                  <TouchableOpacity style={{ flex: 1 }} onPressIn={() => setCalendarDialogVisibility(false)}>
                    <TouchableOpacity style={styles.innerTouchableOpacity2}
                      onPress={() => { }}
                      activeOpacity={1}
                    >
                      <Calendar
                        initialDate={currentDate.dateString}
                        onDayPress={day => {
                          console.log(day);
                          const s = Object.assign({}, aMajorSet);
                          s.date = day;
                          setCurrentDate(day);
                          setAMajorSet(s);
                          setCalendarDialogVisibility(false);

                        }} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                </Modal>

              </View>
              {ButtonSet()}
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
        <Modal visible={isExDialogVisible} animationType="fade" transparent={true}>
          <TouchableOpacity style={{ flex: 1 }} onPressIn={() => setExDialogVisibility(false)}>
            <TouchableOpacity style={styles.innerTouchableOpacity}
              onPress={() => { }}
              activeOpacity={1}
            >
              <Text style={{ fontSize: Layout.defaultFontSize, fontWeight: "bold" }}>{dialogText}</Text>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <Text style={{ fontSize: Layout.defaultFontSize }}
                >name: </Text>
                <TextInput placeholder='Type in exercise name.'
                  style={textInputBackgroundColor}
                  value={aExercise.name}
                  onChangeText={text => {
                    const e = Object.assign({}, aExercise);
                    e.name = text;
                    setaExercise(e);
                  }}
                  editable={isEditable} />
              </View>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <Text
                  style={{ fontSize: Layout.defaultFontSize }}
                >description: </Text>
                <TextInput style={textInputBackgroundColor}
                  multiline={true} placeholder='Type in exercise description.'
                  value={aExercise.description}
                  onChangeText={text => {
                    const e = Object.assign({}, aExercise);
                    e.description = text;
                    setaExercise(e);
                  }
                  }
                  editable={isEditable} />
              </View>
              {ButtonSet()}
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
        <handleResetDBContext.Provider value={handleResetDB}>
          <ExerciseScreenContext.Provider value={{
            exercises: exercises,
            handleSelected: handleExerciseCRUDPress,
            handleCreate: showCreateExerciseDialog
          }}>
            <MajorSetContext.Provider value={{
              majorSet: majorSet,
              handleSelected: handleMajorSetCRUDPress,
              handleCreate: showCreateMajorSetDialog
            }}>
              <Tab.Navigator>
                <Tab.Screen name="Plan" component={PlanScreen} />
                <Tab.Screen name="Exercises" component={ExercisesScreen} />
                <Tab.Screen name="Settings" component={SettingsScreen} />
              </Tab.Navigator>
            </MajorSetContext.Provider>
          </ExerciseScreenContext.Provider>
        </handleResetDBContext.Provider>
      </NavigationContainer >
    </>
  );
}

const styles = StyleSheet.create({
  innerTouchableOpacity2: {
    flex: 0,
    margin: Layout.dialogSpacingMargin,
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
    top: '20%',
    flexDirection: "column",
  },
  innerTouchableOpacity: {
    flex: 0,
    margin: Layout.dialogSpacingMargin,
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
    top: '60%',
    flexDirection: "column",
  },
  textInputEditable: {
    backgroundColor: Colors.light.altBackground,
    fontSize: Layout.defaultFontSize,
    color: "black", marginTop: -5
  },
  textInputViewOnly: {
    backgroundColor: "white",
    fontSize: Layout.defaultFontSize,
    color: "black", marginTop: -5


  },
  changeDateButtonEnabled: {
    marginStart: "10%", backgroundColor: Colors.light.tint
  },
  changeDateButtonDisabled: {
    marginStart: "10%", backgroundColor: Colors.light.altBackground
  }

});
