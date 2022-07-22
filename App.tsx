import {
  Modal, StyleSheet, View, Text, Button,
  TouchableOpacity, Alert, LogBox, TextInput, Platform
} from 'react-native';
import { ExercisesScreen } from './screens/ExercisesScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { PlanScreen } from './screens/PlanScreen';
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { init, db, resetTables } from './dbhandler';
import { Emm, Exercise, MajorMuscle } from './types';
import { MajorSet } from './types';
import Toast from 'react-native-simple-toast';
import Colors from './constants/Colors';
import Layout from './constants/Layout';
import { Calendar } from 'react-native-calendars';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
LogBox.ignoreLogs(['Require cycle:']);
const Tab = createBottomTabNavigator();

//dummy constant values
export const dummyDate = { year: 0, month: 0, day: 0, timestamp: 0, dateString: "" };
export const dummyExercises: Exercise[] = [{ name: "", description: "", imagesJson: "", major_muscles: [] }];
export const dummyMajorSet: MajorSet[] = [{
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
const dummyMajorMuscles: MajorMuscle[] = [{ name: "", notes: "", imageJson: "" }];

const dummyEmm: Emm[] = [{ id: 9999, exercise_name: "", major_muscle_name: "" }];
//constexts
export const handleResetDBContext = React.createContext(() => { });
export const ExerciseScreenContext = React.createContext(
  {
    exercises: dummyExercises, handleSelected: (exercise: Exercise) => { }, handleCreate: () => { },
    handleFilterExercises: (keyword: string) => { },
    filteredKeyword: ""
  }
);
export const MajorSetContext = React.createContext({
  majorSet: dummyMajorSet, handleSelected: (majorSet: MajorSet) => { },
  handleCreate: (majorSet: MajorSet) => { },
  handleFilterMajorSet: (keyword: string) => { },
  filteredKeyword: "",
});

export default function App() {
  //for exercise
  const [exercises, setExercises] = useState(dummyExercises);
  const [isExDialogVisible, setExDialogVisibility] = useState(false);//Ex = exercise
  const [aExercise, setAExercise] = useState(dummyExercises[0]);
  const [oldExerciseName, setOldExerciseName] = useState("");
  const [dropDownMajorMuscleNameSelected, setDropDownMajorMuscleNameSelected] = useState([""]);
  const [filteredExercises, setFilteredExercises] = useState(dummyExercises);
  const [filteredExerciseKeyword, setFilteredExerciseKeyword] = useState("");

  //shared
  const [dialogText, setDialogText] = useState("");
  const [textInputBackgroundColor, setTextInputBackgroundColor] = useState(styles.textInputViewOnly);
  const [isEditable, setEditability] = useState(false);

  //for majorSet
  const [isCalendarDialogVisible, setCalendarDialogVisibility] = useState(false);
  const [isPlanDialogVisible, setPlanDialogVisibility] = useState(false);
  const [majorSets, setMajorSets] = useState(dummyMajorSet);
  const [aMajorSet, setAMajorSet] = useState(majorSets[0]);
  const [isDropDownOpen, setDropDownOpenOrNot] = useState(false);
  const [dropDownExerciseNameSelected, setDropDownExerciseNameSelected] = useState(dummyExercises[0].name);
  const [currentDate, setCurrentDate] = useState(dummyDate);
  const [changeButtonBackgroundColor, setChangeButtonBackgroundColor] = useState(styles.changeDateButtonDisabled);
  const [filteredMajorSets, setFilteredMajorSets] = useState(dummyMajorSet);
  const [filtredMajorSetsKeyword, setFitleredMajorSetsKeywords] = useState("");

  //for major muscles
  const [majorMuscles, setMajorMuscles] = useState(dummyMajorMuscles);
  const [emm, setEmm] = useState(dummyEmm);

  //constant strings
  const ExerciseInformationText = "Exercise Information";
  const EditExerciseText = "Edit Exercise:";
  const CreateExerciseText = "Create Exercise:";
  const CreateMajorSetText = "Create:";
  const MajorSetInformation = "Information:";
  const EditMajorSetText: string = "Edit";
  const DuplicateMajorSetText: string = "Duplicate:";

  useEffect(() => {
    let tempExercises: Exercise[];
    if (exercises[0].name == "" || exercises.length <= 0)
      db.transaction(t => t.executeSql(
        "SELECT * from exercise",
        undefined,
        (_, r) => {
          tempExercises = r.rows._array;
          tempExercises.forEach(ex => {
            ex.major_muscles = dummyMajorMuscles;
          })
          if (majorSets[0] != undefined)
            if (majorSets[0].exercise == dummyExercises[0])
              db.transaction(
                t => {
                  t.executeSql("SELECT * FROM major_sets", [],
                    (_, results) => {
                      let tempMajorSet: MajorSet[] = results.rows._array;
                      let a = results.rows._array.slice();
                      tempMajorSet.forEach((ms, index) => {
                        ms.date = JSON.parse(ms.date.toString());
                        let t = tempExercises.find(ex => ex.name == a[index].exercise);
                        tempMajorSet[index].exercise = t!;
                      });
                      setMajorSets(tempMajorSet);
                      setFilteredMajorSets(tempMajorSet);
                    },
                    (_, err) => {
                      console.log(err)
                      return true;
                    });
                }
              )
          setExercises(tempExercises);
          setFilteredExercises(tempExercises);
        },
        (_, e) => { console.log(e); return true; }
      ));
    if (majorMuscles[0] == dummyMajorMuscles[0]) {
      let tempMajorMuscles: MajorMuscle[];
      db.transaction(t => t.executeSql("SELECT * from major_muscle", undefined,
        (_, results) => {
          tempMajorMuscles = results.rows._array;
          setMajorMuscles(results.rows._array);
        }, (_, err) => { console.log(err); return true; }))
    }
    if (emm[0] == dummyEmm[0])
      db.transaction(t => t.executeSql("SELECT * from exercise_major_muscle_one_to_many;", undefined,
        (_, results) => {
          let temp_emm_one_to_many = results.rows._array;
          setEmm(temp_emm_one_to_many);
        }, (_, err) => { console.log(err); return true; }))

    if (majorMuscles.length > 1 && exercises.length > 1 && emm.length > 1 && filteredExercises.length>0) {
      emm.forEach(x => {
        let ex = exercises.find(e => e.name == x.exercise_name);
        let fe = filteredExercises.find(e => e.name == x.exercise_name);
        let mm2 = majorMuscles.find(mm => mm.name == x.major_muscle_name);
        if (ex == undefined )  {
          Toast.show("There is an error is extracting major muscles from each exercises");
          return;
        }
        if (ex!.major_muscles == dummyMajorMuscles) ex!.major_muscles = [mm2!];
        else ex!.major_muscles.push(mm2!);

      })
      setEmm([]);
    }
  }, [majorSets, exercises, majorMuscles, filteredExercises]);
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
              setDropDownOpenOrNot(false);
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
              setDropDownOpenOrNot(false);
              setTextInputBackgroundColor(styles.textInputEditable);
              setDialogText(EditMajorSetText);
              setAMajorSet(aMajorSet);
              setDropDownExerciseNameSelected(aMajorSet.exercise.name);
              setCurrentDate(aMajorSet.date);
            }} />
            <Button title="duplicate" onPress={() => {
              setChangeButtonBackgroundColor(styles.changeDateButtonEnabled);
              setEditability(true);
              setDropDownOpenOrNot(false);
              setTextInputBackgroundColor(styles.textInputEditable);
              setDialogText(DuplicateMajorSetText);
              setAMajorSet(aMajorSet);
              setDropDownExerciseNameSelected(aMajorSet.exercise.name);
              setCurrentDate(aMajorSet.date);
            }} />
            <Button title='Cancel' onPress={() => cancelDialog()} />
          </View>
        );
      case DuplicateMajorSetText:
      case EditMajorSetText:
        return (
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
            <Button title='Save' onPress={() => {
              switch (dialogText) {
                case EditMajorSetText: updateMajorSet(); break;
                case DuplicateMajorSetText: createMajorSet(); break;
              }
            }}></Button>
            <Button title='Back' onPress={() => handleMajorSetCRUDPress(aMajorSet)} />
            <Button title='Cancel' onPress={() => cancelDialog()} />
          </View>
        );

    }
  }

  const handleResetDB = () => {
    resetTables();
    setExercises(dummyExercises);
    setMajorSets(dummyMajorSet);
    setMajorMuscles(dummyMajorMuscles);
  }
  function cancelDialog() {
    setExDialogVisibility(false);
    setCalendarDialogVisibility(false);
    setPlanDialogVisibility(false);
  }


  // Exercises Functions:
  const handleExerciseCRUDPress = (exercise: Exercise) => {
    setEditability(false);
    setTextInputBackgroundColor(styles.textInputViewOnly);
    setAExercise(exercise);
    let names: string[] = [];
    exercise.major_muscles.forEach(mm => names.push(mm.name));
    setDropDownOpenOrNot(false);
    setDropDownMajorMuscleNameSelected(names);
    setOldExerciseName(exercise.name);
    setDialogText(ExerciseInformationText);
    setExDialogVisibility(true);
  }

  let deleteExerciseConfirmation = (exercise: Exercise) => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this exercise?",
      [{ text: "Yes", onPress: () => deleteExercise(exercise) },
      { text: "No", onPress: () => handleExerciseCRUDPress(exercise) }],//warning, recursive-
      { cancelable: true }
    )
  };
  let deleteExercise = (exercise: Exercise) => {
    let selected: MajorMuscle[] = majorMuscles.filter(x => dropDownMajorMuscleNameSelected.includes(x.name));
    selected.forEach(x =>
      db.transaction(t => t.executeSql(
        "DELETE FROM exercise_major_muscle_one_to_many WHERE exercise_name=? AND major_muscle_name=?",
        [exercise.name, x.name], undefined,
        (_, err) => { console.log(err); return true; }
      ))
    );
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
        setFilteredExercises([...es]);
        setFilteredExerciseKeyword("");
        setExDialogVisibility(false);
      },
      (_, err) => {
        console.log(err);
        return true;
      }
    ));
  }
  const updateExercise = () => {
    let selected: MajorMuscle[] = majorMuscles.filter(x => dropDownMajorMuscleNameSelected.includes(x.name));
    let toBeUpdated = selected.filter(x => !aExercise.major_muscles.includes(x));
    toBeUpdated.forEach(x => {
      if (toBeUpdated != undefined) db.transaction(t => t.executeSql(
        "INSERT INTO exercise_major_muscle_one_to_many (exercise_name,major_muscle_name) values (?,?)",
        [aExercise.name, x.name],
        undefined, (_, err) => { console.log(err); return true }
      ))
    });
    let toBeDeleted: MajorMuscle[] = selected.filter(x => !aExercise.major_muscles.includes(x));
    toBeDeleted.forEach(x => db.transaction(t => t.executeSql("DELETE FROM exercise_major_muscle_one_to_many WHERE exercise_name =? AND major_muscle_name=?",
      [aExercise.name, x.name], undefined, (_, err) => { console.log(err); return true; })));
    db.transaction(t => t.executeSql("UPDATE exercise SET name = ?, description = ?,imagesJson=? where name = ?",
      [aExercise.name, aExercise.description, aExercise.imagesJson, oldExerciseName],
      (_, result) => {
        let exerciseToBeUpdated: Exercise = {
          name: aExercise.name, description: aExercise.description, imagesJson: aExercise.imagesJson,
          major_muscles: selected
        }
        let es: Exercise[] = exercises.slice();
        es.forEach((currentExercise, i) => {
          if (currentExercise.name == oldExerciseName) {
            es.splice(i, 1, exerciseToBeUpdated);
            return;
          }
        })
        setExercises([...es]);
        setFilteredExercises([...es]);
        setFilteredExerciseKeyword("");
        Toast.show("The exercise is updated.")
        setExDialogVisibility(false);
      },
      (_, err) => {
        console.log(err)
        return true;
      }))

  }

  const showCreateExerciseDialog = () => {
    setAExercise(dummyExercises[0]);
    setDropDownMajorMuscleNameSelected([]);
    setEditability(true);
    setTextInputBackgroundColor(styles.textInputEditable);
    setDialogText(CreateExerciseText);
    setExDialogVisibility(true);
    setDropDownOpenOrNot(false);
  }

  function createExercise() {
    let selected: MajorMuscle[] = majorMuscles.filter(x => dropDownMajorMuscleNameSelected.includes(x.name));
    selected.forEach(x =>
      db.transaction(t => t.executeSql(
        "INSERT INTO exercise_major_muscle_one_to_many (exercise_name, major_muscle_name)VALUES (?,?)",
        [aExercise.name, x.name], undefined,
        (_, err) => { console.log(err); return true; }
      ))
    );
    db.transaction(t => t.executeSql("INSERT INTO exercise VALUES (?,?,?)",
      [aExercise.name, aExercise.description, aExercise.imagesJson],
      (_, result) => {
        const es: Exercise[] = exercises.slice();
        es.push({ name: aExercise.name, description: aExercise.description, imagesJson: aExercise.imagesJson, major_muscles: selected });
        setExercises([...es]);
        setFilteredExercises([...es]);
        setFilteredExerciseKeyword("");
        Toast.show("The exercise " + aExercise.name + " is created.");
        cancelDialog();
      },
      (_, err) => {
        console.log(err)
        return true;
      }))
  }


  function handleFilterExercies(keyword: string) {
    setFilteredExercises(exercises.filter(e => (
      e.name.includes(keyword)
      || e.major_muscles.filter(
        mm => mm.name.includes(keyword)
      ).length > 0
    )));
    setFilteredExerciseKeyword(keyword);
  }



  //Major Set Functions:

  function handleMajorSetCRUDPress(majorSet: MajorSet) {
    setChangeButtonBackgroundColor(styles.changeDateButtonDisabled);
    setEditability(false);
    setTextInputBackgroundColor(styles.textInputViewOnly);
    setAMajorSet(majorSet);
    setDialogText(MajorSetInformation);
    setDropDownOpenOrNot(false);
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
        let ms = majorSets.slice();
        ms.forEach((ms1, i) => {
          if (ms1.id == id) {
            ms.splice(i, 1);
            return;
          }
        });
        //correct way of removing element from a array for me. Not using delete keyword which leaves a undefined space
        Toast.show("The major set is deleted.");
        setMajorSets([...ms]);
        setFilteredMajorSets({...ms});
        setFilteredExerciseKeyword("");
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
        let ms: MajorSet[] = majorSets.slice();
        ms.forEach((currentMajorSet, i) => {
          if (currentMajorSet.id == aMajorSet.id) {
            ms.splice(i, 1, toBeUpdated);
            return;
          }
        })
        setMajorSets([...ms]);
        setFilteredMajorSets([...ms]);
        setFilteredExerciseKeyword("");
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
    setDropDownOpenOrNot(false);
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
          aMajorSet.id = r.insertId!;
          aMajorSet.date = currentDate;
          let tempMajorSet = Object.assign({}, aMajorSet);
          console.log(tempMajorSet.id);
          let m = majorSets.slice();
          m.push(tempMajorSet);

          setMajorSets([...m]);
          setFilteredMajorSets([...m]);
          setFitleredMajorSetsKeywords("");
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
  function handleFilterMajorSet(keyword: string) {
    setFilteredMajorSets(majorSets.filter(mm => (
      (mm.percent_complete, toString()+"%").includes(keyword)
      || mm.id.toString().includes(keyword)
      || (mm.weight.toString() + "kg").includes(keyword)
      || (mm.sets.toString() + "x" + mm.reps.toString()).includes(keyword)
      || mm.exercise.name.includes(keyword)
      || mm.exercise.major_muscles.filter(
        mm => mm.name.includes(keyword)
      ).length > 0
    )));
    setFitleredMajorSetsKeywords(keyword);
  }
  return (
    <>
      <NavigationContainer>
        <Modal visible={isPlanDialogVisible} animationType="fade" transparent={true}>
          <TouchableOpacity style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }} onPressIn={() => setPlanDialogVisibility(false)}>
            <TouchableOpacity style={{ ...styles.innerTouchableOpacity2 }} activeOpacity={1} onPress={() => setDropDownOpenOrNot(false)}>
              <Text style={{ fontSize: Layout.defaultFontSize, fontWeight: "bold" }}>{dialogText}</Text>
              <View style={{ flexDirection: "row", marginTop: 20, marginLeft: "1%" }}>
                <Text style={{ fontSize: Layout.defaultFontSize, marginRight: "1%" }}>
                  Exercise:
                </Text>
                <DropDownPicker
                  placeholder="Select a exercise"
                  open={isDropDownOpen}
                  schema={{ label: "name", value: "name" }}
                  items={exercises as ItemType<string>[]}
                  itemKey="name"
                  value={dropDownExerciseNameSelected}
                  setOpen={setDropDownOpenOrNot}
                  setValue={setDropDownExerciseNameSelected}
                  disabled={!isEditable}
                  dropDownContainerStyle={{
                    marginTop: -5, backgroundColor: Colors.light.altBackground,
                    borderWidth: 0, width: 200, minHeight: 300, borderRadius: 0
                  }}
                  selectedItemContainerStyle={{
                    backgroundColor: Colors.light.altBackground,
                    borderColor: "white"
                  }}
                  style={{
                    // display: 'flex',
                    // flexDirection: "row",
                    // // alignItems:"stretch",
                    justifyContent: "flex-end",
                    marginTop: -5, minHeight: 30, paddingVertical: 3,
                    backgroundColor: Colors.light.altBackground,
                    borderWidth: 0, borderRadius: 0,
                    width: "75%"
                  }}
                  textStyle={{ fontSize: Layout.defaultFontSize }}
                  disabledStyle={{ backgroundColor: "white" }}
                  searchTextInputStyle={{ borderWidth: 0 }}
                  searchable={true}
                  closeAfterSelecting={true}
                  closeOnBackPressed={true}
                />

              </View>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <Text style={{ fontSize: Layout.defaultFontSize }}
                > Reps: </Text>
                <TextInput placeholder='reps'
                  style={{ ...textInputBackgroundColor }}
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
              <View style={{ flexDirection: "row", marginTop: 20, }}>
                <Text style={{ fontSize: Layout.defaultFontSize }}
                > percentage complete: </Text>
                <TextInput placeholder='percentage complete'
                  style={{ ...textInputBackgroundColor }}
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
                > Sets: </Text>
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
                > Duration: </Text>
                <TextInput placeholder='seconds'
                  style={{ ...textInputBackgroundColor, width: 30 }}
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
                > Weight: </Text>
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
                <Text style={{ fontSize: Layout.defaultFontSize }}> date: {currentDate.dateString}</Text>
                <TouchableOpacity
                  style={{
                    ...changeButtonBackgroundColor,
                    justifyContent: "flex-end", flex: 1, alignSelf: "flex-end", paddingRight: 5
                  }}
                  disabled={!isEditable} onPress={() => {
                    setCalendarDialogVisibility(true);
                  }} >
                  <Text style={{ color: "white", textAlign: "right", fontWeight: "600" }}>CHANGE DATE</Text>
                </TouchableOpacity>
                <Modal visible={isCalendarDialogVisible} animationType="fade" transparent={true} >
                  <TouchableOpacity style={{ flex: 1, display: "flex", justifyContent: "flex-end" }} onPressIn={() => setCalendarDialogVisibility(false)}>
                    <TouchableOpacity style={styles.innerTouchableOpacity2}
                      onPress={() => { }}
                      activeOpacity={1}
                    >
                      <Text style={{ fontSize: Layout.defaultFontSize, fontWeight: "bold" }} >Select a date</Text>
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
                      <Button title='Cancel' onPress={() => setCalendarDialogVisibility(false)} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                </Modal>

              </View>
              {ButtonSet()}
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
        <Modal visible={isExDialogVisible} animationType="fade" transparent={true}>
          <TouchableOpacity style={{ flex: 1, display: "flex", justifyContent: "flex-end" }} onPressIn={() => setExDialogVisibility(false)}>
            <TouchableOpacity style={{ ...styles.innerTouchableOpacity }}
              onPress={() => { setDropDownOpenOrNot(false) }}
              activeOpacity={1}
            >
              <Text style={{ fontSize: Layout.defaultFontSize, fontWeight: "bold" }}>{dialogText}</Text>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <Text style={{ fontSize: Layout.defaultFontSize }}
                >Name: </Text>
                <TextInput placeholder='Type in exercise name.'
                  style={textInputBackgroundColor}
                  value={aExercise.name}
                  onChangeText={text => {
                    const e = Object.assign({}, aExercise);
                    let parts: string[] = text.split(" ");
                    let formattedText: string = "";
                    parts.forEach(part => {
                      let formatedWord = part.charAt(0).toUpperCase() + part.slice(1)
                      formattedText = formattedText + " " + formatedWord;
                    }
                    );
                    e.name = formattedText;
                    setAExercise(e);
                  }}
                  editable={isEditable} />
              </View>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <Text
                  style={{ fontSize: Layout.defaultFontSize }}
                >Description: </Text>
                <TextInput style={{ ...textInputBackgroundColor, fontSize: Layout.defaultFontSize }}
                  multiline={true} placeholder='Type in exercise description.'
                  value={aExercise.description}
                  onChangeText={text => {
                    const e = Object.assign({}, aExercise);
                    e.description = text;
                    setAExercise(e);
                  }}
                  editable={isEditable} />
              </View>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <DropDownPicker

                  style={{
                    width: "100%", minHeight: 30,
                    backgroundColor: Colors.light.altBackground, borderWidth: 0, borderRadius: 0
                  }}
                  disabledStyle={{ borderWidth: 0, backgroundColor: "white" }}
                  dropDownContainerStyle={{
                    backgroundColor: Colors.light.altBackground, borderWidth: 0,
                    borderRadius: 0, minHeight: 500,
                  }}
                  textStyle={{ fontSize: Layout.defaultFontSize }}
                  searchTextInputStyle={{ borderWidth: 0 }}
                  placeholderStyle={{ color: "#9E9E9E" }}
                  showBadgeDot={false}
                  schema={{ label: "name", value: "name" }}
                  items={majorMuscles as ItemType<string>[]}
                  value={dropDownMajorMuscleNameSelected}
                  setValue={setDropDownMajorMuscleNameSelected}
                  open={isDropDownOpen}
                  setOpen={setDropDownOpenOrNot}
                  disabled={!isEditable}
                  multiple={true}
                  dropDownDirection="TOP"
                  searchable={true}
                  closeOnBackPressed={true}
                  placeholder='Select Muscle Group(s).'
                  mode="BADGE"
                  extendableBadgeContainer={true}
                  badgeProps={{ disabled: !isEditable }}
                />
              </View>
              {ButtonSet()}
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
        <handleResetDBContext.Provider value={handleResetDB}>
          <ExerciseScreenContext.Provider value={{
            exercises: filteredExercises,
            handleSelected: handleExerciseCRUDPress,
            handleCreate: showCreateExerciseDialog,
            filteredKeyword: filteredExerciseKeyword,
            handleFilterExercises: handleFilterExercies
          }}>
            <MajorSetContext.Provider value={{
              majorSet: filteredMajorSets,
              handleSelected: handleMajorSetCRUDPress,
              handleCreate: showCreateMajorSetDialog,
              handleFilterMajorSet: handleFilterMajorSet,
              filteredKeyword: filtredMajorSetsKeyword
            }}>
              <Tab.Navigator
                screenOptions={({ route }) =>
                ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    switch (route.name) {
                      case 'Plan':
                        iconName = focused
                          ? 'clipboard-list'
                          : 'clipboard-list-outline';
                        return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                      case 'Exercises':
                        iconName = focused
                          ? 'arm-flex'
                          : 'arm-flex-outline';
                        return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                      case 'Settings':
                        iconName = focused
                          ? 'settings'
                          : 'settings-outline';
                        return <Ionicons name={iconName} size={size} color={color} />;
                    }
                  },
                  tabBarActiveTintColor: Colors.light.tint
                })
                }>
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
const bases = StyleSheet.create({
  textInputBase: {
    fontSize: Layout.defaultFontSize,
    color: "black", marginTop: -5, justifyContent: "flex-end", flex: 1, textAlign: "right", paddingRight: 5
  },

  changeDateButtonBase: {
    padding: Layout.defaultMargin,
    // textAlign: "right",
    // margin:Layout.defaultMargin,
    marginStart: 7,
    marginBottom: 7,
    elevation: 4,
    // Material design blue from https://material.google.com/style/color.html#color-color-palette
    ...Platform.select({
      ios: {
        // iOS blue from https://developer.apple.com/ios/human-interface-guidelines/visual-design/color/
        color: '#007AFF',
        fontSize: 18,
      },
      android: {
        color: 'white',
        fontWeight: '700',
      },
    }),
    borderRadius: 2,

  },
  innerTouchableOpacityBase: {
    flex: 0,
    margin: Layout.dialogSpacingMargin,
    backgroundColor: "white",
    padding: 35,
    justifyContent: 'flex-end',
    display: 'flex',
    flexDirection: 'column',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  }
})
const styles = StyleSheet.create({
  innerTouchableOpacity2: {
    // top: '20%',
    ...bases.innerTouchableOpacityBase
  },
  innerTouchableOpacity: {
    ...bases.innerTouchableOpacityBase,
    // top: '60%',
  },
  textInputEditable: {
    backgroundColor: Colors.light.altBackground,
    ...bases.textInputBase
  },
  textInputViewOnly: {
    backgroundColor: "white",
    ...bases.textInputBase
  },

  changeDateButtonEnabled: {
    backgroundColor: '#2196F3',
    ...bases.changeDateButtonBase
  },
  changeDateButtonDisabled: {
    backgroundColor: Colors.light.altBackground,
    ...bases.changeDateButtonBase
  }

});
