import {
  Modal, StyleSheet, View, Text, Button,
  TouchableOpacity, Alert, LogBox, TextInput, Platform, Pressable
} from 'react-native';
import { ExercisesScreen } from './screens/ExercisesScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { PlanScreen } from './screens/PlanScreen';
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { init, db, resetTables } from './dbhandler';
import { Emm, Exercise, MajorMuscle, PushPullEnum } from './types';
import { ScheduledItem } from './types';
import Toast from 'react-native-simple-toast';
import Colors from './constants/Colors';
import Layout from './constants/Layout';
import { Calendar } from 'react-native-calendars';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { isEntityName } from 'typescript';
LogBox.ignoreLogs(['Require cycle:']);
const Tab = createBottomTabNavigator();

//dummy constant values
export const dummyDate = { year: 0, month: 0, day: 0, timestamp: 0, dateString: "" };
export const dummyExercises: Exercise[] = [{ name: "", description: "", imagesJson: "", major_muscles: [], push_or_pull: PushPullEnum.Push }];
export const dummyScheduledItem: ScheduledItem[] = [{
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
export const ScheduledItemContext = React.createContext({
  majorSet: dummyScheduledItem, handleSelected: (majorSet: ScheduledItem) => { },
  handleCreate: (majorSet: ScheduledItem) => { },
  handleFilterScheduledItem: (keyword: string) => { },
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
  const [openPushPullDropDown, setOpenPushPullDropDown] = useState(false);
  const [pushPullDropDownValue, setPushPullDropDownValue] = useState(PushPullEnum.Push);
  const [pushPullDropDownList, setPushPullDropDownList] = useState(
    [
      { label: PushPullEnum.Push, value: PushPullEnum.Push },
      { label: PushPullEnum.Pull, value: PushPullEnum.Pull }
    ]
  );
  const [aExerciseMinutes, setAExerciseMinutes] = useState(0);

  const [aExerciseSeconds, setAExerciseSeconds] = useState(0);

  //shared
  const [dialogText, setDialogText] = useState("");
  // const [textInputStyle, setTextInputBackgroundColor] = useState(styles.textInputViewOnly);
  const [isEditable, setEditability] = useState(false);

  //for majorSet
  const [isCalendarDialogVisible, setCalendarDialogVisibility] = useState(false);
  const [isPlanDialogVisible, setPlanDialogVisibility] = useState(false);
  const [scheduledItems, setScheduledItems] = useState(dummyScheduledItem);
  const [aScheduledItem, setAScheduledItem] = useState(scheduledItems[0]);
  const [isDropDownOpen, setDropDownOpenOrNot] = useState(false);
  const [dropDownExerciseNameSelected, setDropDownExerciseNameSelected] = useState(dummyExercises[0].name);
  const [currentDate, setCurrentDate] = useState(dummyDate);
  // const [buttonStyle, setChangeButtonBackgroundColor] = useState(styles.changeDateButtonDisabled);
  const [filteredScheduledItems, setFilteredScheduledItems] = useState(dummyScheduledItem);
  const [filteredScheduledItemKeyword, setfilteredScheduledItemsKeywords] = useState("");
  // const [numberInputStyle, setNumberInputBackgroundColor] = useState(styles.numberInputViewOnly);

  //for major muscles
  const [majorMuscles, setMajorMuscles] = useState(dummyMajorMuscles);
  const [emm, setEmm] = useState(dummyEmm);

  //constant strings
  const ExerciseInformationText = "Exercise Information";
  const EditExerciseText = "Edit Exercise:";
  const CreateExerciseText = "Create Exercise:";
  const CreateScheduledItemText = "Create:";
  const ScheduledItemInformation = "Information:";
  const EditScheduledItemText: string = "Edit";
  const DuplicateScheduledItemText: string = "Duplicate:";

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
          if (scheduledItems[0] != undefined)
            if (scheduledItems[0].exercise == dummyExercises[0])
              db.transaction(
                t => {
                  t.executeSql("SELECT * FROM major_sets", [],
                    (_, results) => {
                      let tempScheduledItem: ScheduledItem[] = results.rows._array;
                      let a = results.rows._array.slice();
                      tempScheduledItem.forEach((ms, index) => {
                        ms.date = JSON.parse(ms.date.toString());
                        let t = tempExercises.find(ex => ex.name == a[index].exercise);
                        tempScheduledItem[index].exercise = t!;
                      });
                      setScheduledItems(tempScheduledItem);
                      console.log("this part ran");
                      setFilteredScheduledItems(tempScheduledItem);
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

    if (majorMuscles.length > 1 && exercises.length > 1 && emm.length > 1) {
      emm.forEach(x => {
        let ex = exercises.find(e => e.name == x.exercise_name);
        let mm2 = majorMuscles.find(mm => mm.name == x.major_muscle_name);
        if (ex == undefined) {
          Toast.show("There is an error is extracting major muscles from each exercises");
          return;
        }
        if (ex!.major_muscles == dummyMajorMuscles) ex!.major_muscles = [mm2!];
        else ex!.major_muscles.push(mm2!);

      })
      setEmm([]);
    }
  }, [scheduledItems, exercises, majorMuscles, filteredExercises]);
  init();

  let textInputStyle, numberInputStyle, buttonStyle;
  if (isEditable) {
    textInputStyle = styles.textInputEditable
    numberInputStyle = styles.numberInputEditable
    buttonStyle = styles.changeDateButtonEnabled
  } else {
    textInputStyle = styles.textInputViewOnly
    numberInputStyle = styles.numberInputViewOnly
    buttonStyle = styles.changeDateButtonDisabled
  }
  const ButtonSet = () => {
    switch (dialogText) {
      case ExerciseInformationText:
        return (
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
            <Button title="delete" onPress={() => deleteExerciseConfirmation(aExercise)} />
            <Button title='Edit' onPress={() => {
              setOldExerciseName(oldExerciseName);
              setEditability(true);
              textInputStyle = styles.textInputEditable;
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
      case CreateScheduledItemText:
        return (
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
            <Button title='Save' onPress={() => createScheduledItem()}></Button>
            <Button title='Cancel' onPress={() => cancelDialog()} />
          </View>
        );
      case ScheduledItemInformation:
        return (
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
            <Button title="delete" onPress={() => deleteScheduledItemConfirmation(aScheduledItem)} />
            <Button title='Edit' onPress={() => {
              buttonStyle = styles.changeDateButtonEnabled;
              setEditability(true);
              setDropDownOpenOrNot(false);
              textInputStyle = styles.textInputEditable;
              setDialogText(EditScheduledItemText);
              setAScheduledItem(aScheduledItem);
              setDropDownExerciseNameSelected(aScheduledItem.exercise.name);
              setCurrentDate(aScheduledItem.date);
            }} />
            <Button title="duplicate" onPress={() => {
              buttonStyle = styles.changeDateButtonEnabled;
              setEditability(true);
              setDropDownOpenOrNot(false);
              textInputStyle = styles.textInputEditable;
              setDialogText(DuplicateScheduledItemText);
              setAScheduledItem(aScheduledItem);
              setDropDownExerciseNameSelected(aScheduledItem.exercise.name);
              setCurrentDate(aScheduledItem.date);
            }} />
            <Button title='Cancel' onPress={() => cancelDialog()} />
          </View>
        );
      case DuplicateScheduledItemText:
      case EditScheduledItemText:
        return (
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
            <Button title='Save' onPress={() => {
              switch (dialogText) {
                case EditScheduledItemText: updateScheduledItem(); break;
                case DuplicateScheduledItemText: createScheduledItem(); break;
              }
            }}></Button>
            <Button title='Back' onPress={() => handleScheduledItemCRUDPress(aScheduledItem)} />
            <Button title='Cancel' onPress={() => cancelDialog()} />
          </View>
        );

    }
  }

  const handleResetDB = () => {
    resetTables();
    setExercises(dummyExercises);
    setScheduledItems(dummyScheduledItem);
    setMajorMuscles(dummyMajorMuscles);
  }
  function cancelDialog() {
    setExDialogVisibility(false);
    setCalendarDialogVisibility(false);
    setPlanDialogVisibility(false);
  }


  // Exercises Functions:
  const commonExercisesCRUD = (es: Exercise[]) => {
    setExercises([...es]);
    setFilteredExercises([...es]);
    setFilteredExerciseKeyword("");

    cancelDialog();
  }
  const handleExerciseCRUDPress = (exercise: Exercise) => {
    setEditability(false);
    textInputStyle = styles.textInputViewOnly;
    setAExercise(exercise);
    let names: string[] = [];
    exercise.major_muscles.forEach(mm => names.push(mm.name));
    setDropDownOpenOrNot(false);
    setDropDownMajorMuscleNameSelected(names);
    setOldExerciseName(exercise.name);
    setDialogText(ExerciseInformationText);
    setExDialogVisibility(true);
    setPushPullDropDownValue(exercise.push_or_pull);
    setOpenPushPullDropDown(false);
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
        commonExercisesCRUD(es);
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
    db.transaction(t => t.executeSql("UPDATE exercise SET name = ?, description = ?,imagesJson=?,push_or_pull=? where name = ?",
      [aExercise.name, aExercise.description, aExercise.imagesJson, pushPullDropDownValue, oldExerciseName],
      (_, result) => {
        let exerciseToBeUpdated: Exercise = {
          name: aExercise.name, description: aExercise.description, imagesJson: aExercise.imagesJson,
          major_muscles: selected, push_or_pull: pushPullDropDownValue
        }
        let es: Exercise[] = exercises.slice();
        es.forEach((currentExercise, i) => {
          if (currentExercise.name == oldExerciseName) {
            es.splice(i, 1, exerciseToBeUpdated);
            return;
          }
        })
        commonExercisesCRUD(es)
        Toast.show("The exercise is updated.")
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
    textInputStyle = styles.textInputEditable;
    setDialogText(CreateExerciseText);
    setExDialogVisibility(true);
    setDropDownOpenOrNot(false);
    setPushPullDropDownValue(PushPullEnum.Push);
    setOpenPushPullDropDown(false);
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
    db.transaction(t => t.executeSql("INSERT INTO exercise VALUES (?,?,?,?)",
      [aExercise.name, aExercise.description, aExercise.imagesJson, pushPullDropDownValue],
      (_, result) => {
        const es: Exercise[] = exercises.slice();
        es.push({
          name: aExercise.name, description: aExercise.description, imagesJson: aExercise.imagesJson, major_muscles: selected,
          push_or_pull: pushPullDropDownValue
        })
        commonExercisesCRUD(es)
        Toast.show("The exercise " + aExercise.name + " is created.");
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

  function handleScheduledItemCRUDPress(scheduledItem: ScheduledItem) {
    buttonStyle = styles.changeDateButtonDisabled;
    setEditability(false);
    textInputStyle = styles.textInputViewOnly;
    numberInputStyle = styles.numberInputViewOnly;
    setAScheduledItem(scheduledItem);
    setDialogText(ScheduledItemInformation);
    setDropDownOpenOrNot(false);
    setDropDownExerciseNameSelected(scheduledItem.exercise.name);
    setExDialogVisibility(false);
    setPlanDialogVisibility(true);
    setCurrentDate(scheduledItem.date);
    setAExerciseMinutes(Math.floor(scheduledItem.duration_in_seconds / 60))
    setAExerciseSeconds(scheduledItem.duration_in_seconds % 60)
  }
  let deleteScheduledItemConfirmation = (ms: ScheduledItem) => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this major set?",
      [{ text: "Yes", onPress: () => deleteScheduledItem(ms.id) },
      { text: "No", onPress: () => handleScheduledItemCRUDPress(ms) }],//warning, recursive
      { cancelable: true }
    )
  };
  let deleteScheduledItem = (id: number) => {
    db.transaction(t => t.executeSql("DELETE FROM major_sets where id= ?", [id],
      () => {
        let ms = scheduledItems.slice();
        ms.forEach((ms1, i) => {
          if (ms1.id == id) {
            ms.splice(i, 1);
            return;
          }
        });
        //correct way of removing element from a array for me. Not using delete keyword which leaves a undefined space
        Toast.show("The major set is deleted.");
        setScheduledItems([...ms]);
        setFilteredScheduledItems({ ...ms });
        setFilteredExerciseKeyword("");
        cancelDialog();
      },
      (_, err) => {
        console.log(err);
        return true;
      }
    ));
  }
  const updateScheduledItem = () => {
    let duration = aExerciseMinutes * 60 + aExerciseSeconds
    if (dropDownExerciseNameSelected == undefined || dropDownExerciseNameSelected == "") {
      Toast.show("exercise must be selected")
      return;
    }
    let theexercise = exercises.filter((e, i, a) => {
      if (e.name == dropDownExerciseNameSelected) return e;
    })[0];
    db.transaction(t => t.executeSql(`UPDATE major_sets 
    SET exercise=?,reps=?,percent_complete=?,sets=?,duration_in_seconds=?,weight=?,notes=?,date=? 
    WHERE id=?`,
      [dropDownExerciseNameSelected, aScheduledItem.reps, aScheduledItem.percent_complete, aScheduledItem.sets,
        duration, aScheduledItem.weight,
        aScheduledItem.notes, JSON.stringify(currentDate), aScheduledItem.id],
      (_, result) => {
        let toBeUpdated: ScheduledItem = {
          id: aScheduledItem.id, exercise: theexercise, reps: aScheduledItem.reps,
          percent_complete: aScheduledItem.percent_complete, sets: aScheduledItem.sets,
          duration_in_seconds: duration,
          weight: aScheduledItem.weight, notes: aScheduledItem.notes, date: currentDate
        }
        let ms: ScheduledItem[] = scheduledItems.slice();
        ms.forEach((currentScheduledItem, i) => {
          if (currentScheduledItem.id == aScheduledItem.id) {
            ms.splice(i, 1, toBeUpdated);
            return;
          }
        })
        setScheduledItems([...ms]);
        setFilteredScheduledItems([...ms]);
        setFilteredExerciseKeyword("");
        Toast.show("The major set is updated.")
        cancelDialog();
      },
      (_, err) => {
        console.log(err)
        return true;
      }))

  }

  function showCreateScheduledItemDialog() {
    buttonStyle = styles.changeDateButtonEnabled;
    setEditability(true);
    textInputStyle = styles.textInputEditable;
    numberInputStyle = styles.numberInputEditable;
    setAScheduledItem(dummyScheduledItem[0]);
    setDialogText(CreateScheduledItemText);
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
    setAExerciseMinutes(0);
    setAExerciseSeconds(0);
  }

  function createScheduledItem() {

    let duration = aExerciseMinutes * 60 + aExerciseSeconds
    let e1: Exercise

    exercises.forEach(e => {
      if (e.name == dropDownExerciseNameSelected) aScheduledItem.exercise = e
    });
    db.transaction(t => {
      t.executeSql(`INSERT INTO major_sets
           (exercise,reps,percent_complete,sets,duration_in_seconds,weight,notes,date)  
           VALUES(?,?,?,?,?,?,?,?);`,
        [aScheduledItem.exercise.name, aScheduledItem.reps, aScheduledItem.percent_complete, aScheduledItem.sets,
          duration, aScheduledItem.weight,
        aScheduledItem.notes, JSON.stringify(currentDate)],
        (_, r) => {
          aScheduledItem.id = r.insertId!
          aScheduledItem.date = currentDate
          aScheduledItem.duration_in_seconds = duration
          let tempScheduledItem = Object.assign({}, aScheduledItem)
          console.log(tempScheduledItem.id)
          let m = scheduledItems.slice()
          m.push(tempScheduledItem)
          setScheduledItems([...m])
          setFilteredScheduledItems([...m])
          setfilteredScheduledItemsKeywords("")
          cancelDialog()
        },
        (_, e) => {
          console.log(e)
          cancelDialog()
          return true
        }
      )
    })
  }
  function handleFilterScheduledItem(keyword: string) {
    console.log("handleFilterScheduledItem");
    let filtered = scheduledItems.filter(mm => {
      //  console.log(mm.exercise.name +"   "+keyword)
      return ((mm.percent_complete, toString() + "%").includes(keyword)
        || mm.id.toString().includes(keyword)
        || (mm.weight.toString() + "kg").includes(keyword)
        || (mm.sets.toString() + "x" + mm.reps.toString()).includes(keyword)
        || mm.exercise.name.includes(keyword)
        || mm.exercise.major_muscles.filter(
          mm => mm.name.includes(keyword)
        ).length > 0
      )
    }
    );
    setFilteredScheduledItems(filtered);
    setfilteredScheduledItemsKeywords(keyword);
  }
  return (
    <>
      <NavigationContainer>
        <Modal visible={isPlanDialogVisible} animationType="fade" transparent={true}>
          <TouchableOpacity style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }} onPressIn={() => setPlanDialogVisibility(false)}>
            <TouchableOpacity style={{ ...styles.innerTouchableOpacity2 }} activeOpacity={1} onPress={() => setDropDownOpenOrNot(false)}>
              <Text style={{ fontSize: Layout.defaultFontSize, fontWeight: "bold" }}>{dialogText}</Text>
              <View style={{ marginLeft: "1%", ...bases.numberCRUD }}>
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
              <View style={bases.numberCRUD}>
                <Text style={{ fontSize: Layout.defaultFontSize }}
                > Sets: </Text>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", }}>
                  <Pressable style={buttonStyle} disabled={!isEditable} onPress={() => {
                    aScheduledItem.sets--
                    if (aScheduledItem.sets < 0) {
                      aScheduledItem.sets = 0
                      return
                    }
                    setAScheduledItem(Object.assign({}, aScheduledItem))
                  }
                  } >
                    <Text style={bases.incrementButton}>-</Text>
                  </Pressable>
                  <TextInput placeholder='sets'
                    style={{ ...numberInputStyle, width: 30 }}
                    value={aScheduledItem.sets.toString()}
                    onChangeText={text => {
                      const sets = Number(text);
                      const s = Object.assign({}, aScheduledItem);
                      if (Number.isNaN(sets)) {
                        Toast.show("Symbol other than numeric ones are not allow.");
                        s.sets = 0;
                      } else s.sets = sets;
                      setAScheduledItem(s);
                    }}
                    editable={isEditable}
                    keyboardType="numeric" />
                  <Pressable style={{ ...buttonStyle, marginLeft: 0 }} disabled={!isEditable} onPress={() => {
                    aScheduledItem.sets++
                    setAScheduledItem(Object.assign({}, aScheduledItem))
                  }}>
                    <Text style={bases.incrementButton}>+</Text>
                  </Pressable>
                </View>
              </View>
              <View style={bases.numberCRUD}>
                <Text style={{ fontSize: Layout.defaultFontSize }}
                > Reps: </Text>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", }}>
                  <Pressable style={buttonStyle} disabled={!isEditable} onPress={() => {
                    aScheduledItem.reps--
                    if (aScheduledItem.reps < 0) {
                      aScheduledItem.reps = 0
                      return
                    }
                    setAScheduledItem(Object.assign({}, aScheduledItem))
                  }
                  } >
                    <Text style={bases.incrementButton}>-</Text></Pressable>
                  <TextInput placeholder='reps'
                    style={{ ...numberInputStyle, width: 30 }}
                    value={aScheduledItem.reps.toString()}
                    onChangeText={text => {
                      const rep = Number(text);
                      const s = Object.assign({}, aScheduledItem);
                      if (Number.isNaN(rep)) {
                        Toast.show("Symbols other than numeric ones are not allow.");
                        s.reps = 0;
                      } else s.reps = rep;
                      setAScheduledItem(s);
                    }}
                    editable={isEditable}
                    keyboardType="numeric" />

                  <Pressable style={{ ...buttonStyle, marginLeft: 0 }} disabled={!isEditable} onPress={() => {
                    aScheduledItem.reps++
                    setAScheduledItem(Object.assign({}, aScheduledItem))
                  }} >
                    <Text style={bases.incrementButton}>+</Text></Pressable>

                </View>
              </View>
              <View style={bases.numberCRUD}>
                <Text style={{ fontSize: Layout.defaultFontSize }}
                > complete(%): </Text>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", }}>
                  <Pressable style={buttonStyle} disabled={!isEditable} onPress={() => {
                    aScheduledItem.percent_complete--
                    if (aScheduledItem.percent_complete < 0) {
                      aScheduledItem.percent_complete = 0
                      return
                    }
                    setAScheduledItem(Object.assign({}, aScheduledItem))
                  }
                  } >
                    <Text style={bases.incrementButton}>-</Text>
                  </Pressable>
                  <TextInput placeholder='percentage complete'
                    style={{ ...numberInputStyle, width: 30 }}
                    value={aScheduledItem.percent_complete.toString()}
                    onChangeText={text => {
                      const p = Number(text);
                      const s = Object.assign({}, aScheduledItem);
                      if (Number.isNaN(p) || p > 100) {
                        Toast.show("Percentage cannot go above 100% and symbols other than numeric ones are not allow.");
                        s.percent_complete = 100;
                      }
                      else s.percent_complete = p;
                      setAScheduledItem(s);
                    }}
                    editable={isEditable}
                    keyboardType="numeric" />
                  <Pressable style={{ ...buttonStyle, marginLeft: 0 }} disabled={!isEditable} onPress={() => {

                    aScheduledItem.percent_complete++
                    if (aScheduledItem.percent_complete > 100) {
                      aScheduledItem.percent_complete = 100;
                      Toast.show("Percentage cannot go above 100% and symbols other than numeric ones are not allow.");
                    }
                    setAScheduledItem(Object.assign({}, aScheduledItem))
                  }}>
                    <Text style={bases.incrementButton}>+</Text>
                  </Pressable>
                </View>
              </View>

              <View style={bases.numberCRUD}>
                <Text style={{ fontSize: Layout.defaultFontSize }}
                > Duration  min: </Text>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", }}>
                  <Pressable style={buttonStyle} disabled={!isEditable} onPress={() => {
                    let a: number = aExerciseMinutes
                    a--
                    if (a < 0) {
                      setAExerciseMinutes(0)
                      Toast.show("Minutes cannot be less than 0.");
                      return
                    } else setAExerciseMinutes(a)
                  }
                  } >
                    <Text style={bases.incrementButton}>-</Text>
                  </Pressable>

                  <TextInput placeholder='Minutes'

                    style={{ ...numberInputStyle, width: 30 }}
                    value={aExerciseMinutes.toString()}
                    onChangeText={text => {
                      const min = Number(text);
                      if (min < 0) {
                        setAExerciseMinutes(0);
                        Toast.show("Minutes cannot be negative");
                      } else if (isNaN(min)) {
                        setAExerciseMinutes(0);
                        Toast.show("Minutes must be a number");
                      }
                      else setAExerciseMinutes(min);
                    }}
                    editable={isEditable}
                    keyboardType="numeric" />
                  <Pressable style={{ ...buttonStyle, marginLeft: 0 }} disabled={!isEditable} onPress={() => {
                    let a: number = aExerciseMinutes;
                    a++
                    setAExerciseMinutes(a);
                  }}>
                    <Text style={bases.incrementButton}>+</Text>
                  </Pressable>

                </View>
              </View>
              <View style={bases.numberCRUD}>
                <Text style={{ fontSize: Layout.defaultFontSize }}
                > sec: </Text>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", }}>
                  <Pressable style={buttonStyle} disabled={!isEditable} onPress={() => {
                    let a: number = aExerciseSeconds
                    a--
                    if (a < 0) {
                      setAExerciseSeconds(0)
                      Toast.show("Seconds cannot be negative");
                      return
                    }
                    else setAExerciseSeconds(a)
                  }
                  } >
                    <Text style={bases.incrementButton}>-</Text>
                  </Pressable>

                  <TextInput placeholder='seconds'
                    style={{ ...numberInputStyle, width: 30 }}
                    value={aExerciseSeconds.toString()}
                    onChangeText={text => {
                      const min = Number(text);
                      if (min < 0) {
                        setAExerciseSeconds(0);
                        Toast.show("Seconds cannot be negative");
                      }
                      else if (isNaN(min)) {
                        setAExerciseSeconds(0);
                        Toast.show("Seconds must be a number.")
                      }
                      else setAExerciseSeconds(min);
                    }}
                    editable={isEditable}
                    keyboardType="numeric" />
                  <Pressable style={{ ...buttonStyle, marginLeft: 0 }} disabled={!isEditable} onPress={() => {
                    let a: number = aExerciseSeconds;
                    a++
                    if (a > 59) {
                      setAExerciseSeconds(59)
                      Toast.show("Seconds cannot be more than 59");
                      return
                    } else setAExerciseSeconds(a);
                  }}>
                    <Text style={bases.incrementButton}>+</Text>
                  </Pressable>

                </View>
              </View>
              <View style={bases.numberCRUD}>
                <Text style={{ fontSize: Layout.defaultFontSize }}
                > Weight (kg): </Text>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", }}>
                  <Pressable style={buttonStyle} disabled={!isEditable} onPress={() => {
                    let s = Object.assign({}, aScheduledItem)
                    s.weight--
                    if (s.weight < 0) {
                      s.weight = 0
                      return
                    }
                    setAScheduledItem(Object.assign({}, s))
                  }
                  } >
                    <Text style={bases.incrementButton}>-</Text>
                  </Pressable>
                  <TextInput placeholder='kg'
                    style={{ ...numberInputStyle, width: 30 }}
                    value={aScheduledItem.weight.toString()}
                    onChangeText={text => {
                      const weight = Number(text);
                      const s = Object.assign({}, aScheduledItem);
                      if (Number.isNaN(weight)) {
                        Toast.show("Symbol other than numeric ones are not allow.");
                        s.weight = 0;
                      } else s.weight = weight;
                      setAScheduledItem(s);

                    }}
                    editable={isEditable}
                    keyboardType="numeric" />
                  <Pressable style={{ ...buttonStyle, marginLeft: 0 }} disabled={!isEditable} onPress={() => {
                    aScheduledItem.weight++
                    setAScheduledItem(Object.assign({}, aScheduledItem))
                  }}>
                    <Text style={bases.incrementButton}>+</Text>
                  </Pressable>
                </View>
              </View>
              <View style={{ flexDirection: "row", marginTop: 20, display: 'flex', justifyContent: "space-between" }}>
                <Text style={{ fontSize: Layout.defaultFontSize }}
                > notes: </Text>
                <TextInput placeholder='notes'
                  style={{ ...textInputStyle, flexGrow: 1 }}
                  value={aScheduledItem.notes.toString()}
                  onChangeText={text => {
                    const s = Object.assign({}, aScheduledItem);
                    s.notes = text;
                    setAScheduledItem(s);
                  }}
                  editable={isEditable} />

              </View>



              <View style={{ flexDirection: "row", marginTop: 10, display: 'flex', justifyContent: "space-between" }}>
                <Text style={{ fontSize: Layout.defaultFontSize }}> date: {currentDate.dateString}</Text>
                <Pressable
                  style={{
                    ...buttonStyle,
                    paddingVertical: Layout.defaultMargin * 1.5,
                  }}
                  disabled={!isEditable} onPress={() => {
                    setCalendarDialogVisibility(true);
                  }} >
                  <Text style={{
                    color: "white", fontWeight: "600", flexDirection: "column", flex: 1,
                    marginTop: "-5%",
                  }}>CHANGE DATE</Text>
                </Pressable>
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
                          const s = Object.assign({}, aScheduledItem);
                          s.date = day;
                          setCurrentDate(day);
                          setAScheduledItem(s);
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
                  style={textInputStyle}
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
                <TextInput style={{ ...textInputStyle, fontSize: Layout.defaultFontSize }}
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
                <Text
                  style={{ fontSize: Layout.defaultFontSize }}
                >Push Or Pull: </Text>
                <DropDownPicker

                  style={{
                    width: "100%", minHeight: 30,
                    transform: [{ rotateX: "180deg" }],
                    backgroundColor: Colors.light.altBackground, borderWidth: 0, borderRadius: 0
                  }}
                  disabledStyle={{ borderWidth: 0, backgroundColor: "white" }}
                  dropDownContainerStyle={{
                    transform: [{ rotateX: "180deg" }],
                    backgroundColor: Colors.light.altBackground, borderWidth: 0,
                    borderRadius: 0, minHeight: 500,
                  }}
                  textStyle={{ fontSize: Layout.defaultFontSize, transform: [{ rotateX: "180deg" }] }}
                  searchTextInputStyle={{ borderWidth: 0, zIndex: -1 }}
                  placeholderStyle={{ color: "#9E9E9E" }}

                  items={pushPullDropDownList}
                  value={pushPullDropDownValue}
                  setValue={setPushPullDropDownValue}
                  open={openPushPullDropDown}
                  setOpen={setOpenPushPullDropDown}
                  disabled={!isEditable}
                  dropDownDirection="TOP"
                  closeOnBackPressed={true}
                />
              </View>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <DropDownPicker

                  style={{
                    width: "100%", minHeight: 30,
                    transform: [{ rotateX: "180deg" }],
                    backgroundColor: Colors.light.altBackground, borderWidth: 0, borderRadius: 0
                  }}
                  disabledStyle={{ borderWidth: 0, backgroundColor: "white" }}
                  dropDownContainerStyle={{
                    transform: [{ rotateX: "180deg" }],
                    backgroundColor: Colors.light.altBackground, borderWidth: 0,
                    borderRadius: 0, minHeight: 500,
                  }}
                  textStyle={{ fontSize: Layout.defaultFontSize, transform: [{ rotateX: "180deg" }] }}
                  searchTextInputStyle={{ borderWidth: 0, zIndex: -1 }}
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
            <ScheduledItemContext.Provider value={{
              majorSet: scheduledItems,
              handleSelected: handleScheduledItemCRUDPress,
              handleCreate: showCreateScheduledItemDialog,
              handleFilterScheduledItem: handleFilterScheduledItem,
              filteredKeyword: filteredScheduledItemKeyword
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
            </ScheduledItemContext.Provider>
          </ExerciseScreenContext.Provider>
        </handleResetDBContext.Provider>
      </NavigationContainer >
    </>
  );
}
const bases = StyleSheet.create({
  textInputBase: {
    fontSize: Layout.defaultFontSize,
    color: "black", marginTop: -5,
    justifyContent: "flex-end", flex: 1, textAlign: "right", paddingRight: 5
  },
  numberTextInput: {
    height: 30,
    fontSize: Layout.defaultFontSize,
    color: "black", marginTop: 0,
    width: 50, textAlign: "center"

  },
  changeDateButtonBase: {
    paddingHorizontal: Layout.defaultMargin,
    paddingTop: 10,
    height: 30,
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
  },
  numberCRUD: {
    flexDirection: "row", marginTop: 20, display: 'flex', justifyContent: "space-between", maxHeight: 40
  }, incrementButton:
    { color: "white", fontSize: Layout.defaultFontSize, marginTop: -7 }

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
  numberInputEditable: {
    backgroundColor: Colors.light.altBackground,
    ...bases.numberTextInput
  },
  numberInputViewOnly: {
    backgroundColor: "white",
    ...bases.numberTextInput
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
