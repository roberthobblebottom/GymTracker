import {
  StyleSheet, Alert, LogBox, Platform
} from 'react-native';
import { ExercisesScreen } from './screens/ExercisesScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { PlanScreen } from './screens/PlanScreen';
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { init, db, resetTables } from './dbhandler';
import { Emm, Exercise, ExerciseState, MajorMuscle, PushPullEnum } from './types';
import { ScheduledItem } from './types';
import Toast from 'react-native-simple-toast';
import Colors from './constants/Colors';
import Layout from './constants/Layout';
import { DateData } from 'react-native-calendars';
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import _default from 'babel-plugin-transform-typescript-metadata';
import { ScheduleDialog } from './ScheduleDialog';
import { ExerciseDialog } from './ExerciseDialog';
import { styles,bases } from './styles';
LogBox.ignoreLogs(['Require cycle:'])
const Tab = createBottomTabNavigator()

//initial constant values
export const initialDate = { year: 0, month: 0, day: 0, timestamp: 0, dateString: "" };

export const initialExerciseState: ExerciseState = {
  exercises: [{ name: "", description: "", imagesJson: "", major_muscles: [], push_or_pull: PushPullEnum.Push }]
  , aExercise: { name: "", description: "", imagesJson: "", major_muscles: [], push_or_pull: PushPullEnum.Push }
  , filteredExercises: [{ name: "", description: "", imagesJson: "", major_muscles: [], push_or_pull: PushPullEnum.Push }]
  , filteredExerciseKeyword: ""
  , oldExerciseName:""
};
export const initialScheduledItem: ScheduledItem[] = [{
  id: 0,
  exercise: initialExerciseState.aExercise,
  reps: 0,
  percent_complete: 0,
  sets: 0,
  duration_in_seconds: 0,
  weight: 0,
  notes: "",
  date: initialDate
}];
const initialMajorMuscles: MajorMuscle[] = [{ name: "", notes: "", imageJson: "" }];
const initialEmm: Emm[] = [{ id: 9999, exercise_name: "", major_muscle_name: "" }];

let d: Date = new Date()
//constexts
export const handleResetDBContext = React.createContext(() => { })
export const ExerciseScreenContext = React.createContext(
  {
    exercises: initialExerciseState.exercises, handleSelected: (exercise: Exercise) => { }, handleCreate: () => { },
    handleFilterExercises: (keyword: string) => { },
    filteredKeyword: ""
  }
)
export const ScheduledItemContext = React.createContext({
  majorSet: initialScheduledItem, handleSelected: (majorSet: ScheduledItem) => { },
  handleCreate: (majorSet: ScheduledItem) => { },
  handleFilterScheduledItem: (keyword: string) => { },
  filteredKeyword: "",
  handlePlanHeader: (date: DateData) => { }
})

export default function App() {
  //for exercise
  const [exerciseState, setExerciseState] = useState(initialExerciseState)
  const [isExDialogVisible, setExDialogVisibility] = useState(false)//Ex = exercise
  const [dropDownMajorMuscleNameSelected, setDropDownMajorMuscleNameSelected] = useState([""])
  const [openPushPullDropDown, setOpenPushPullDropDown] = useState(false)
  const [pushPullDropDownValue, setPushPullDropDownValue] = useState(PushPullEnum.Push)

  //shared
  const [dialogText, setDialogText] = useState("")
  const [isEditable, setEditability] = useState(false)

  //for majorSet
  const [isCalendarDialogVisible, setCalendarDialogVisibility] = useState(false)
  const [isPlanDialogVisible, setPlanDialogVisibility] = useState(false)
  const [scheduledItems, setScheduledItems] = useState(initialScheduledItem)
  const [aScheduledItem, setAScheduledItem] = useState(scheduledItems[0])
  const [isDropDownOpen, setDropDownOpenOrNot] = useState(false)
  const [dropDownExerciseNameSelected, setDropDownExerciseNameSelected] = useState(initialExerciseState.aExercise.name)
  const [currentDate, setCurrentDate] = useState(initialDate)
  const [filteredScheduledItems, setFilteredScheduledItems] = useState(initialScheduledItem)
  const [filteredScheduledItemKeyword, setfilteredScheduledItemsKeywords] = useState("")
  const [planHeader, SetPlanHeader] = useState("Plan " + d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear())

  //for major muscles
  const [majorMuscles, setMajorMuscles] = useState(initialMajorMuscles)
  const [emm, setEmm] = useState(initialEmm)

  //constant strings
  const ExerciseInformationText = "Exercise Information";
  const EditExerciseText = "Edit Exercise:";
  const CreateExerciseText = "Create Exercise:";
  const CreateScheduledItemText = "Create:";
  const ScheduledItemInformation = "Information:";
  const EditScheduledItemText: string = "Edit";
  const DuplicateScheduledItemText: string = "Duplicate:";

  function handlePlanHeader(date: DateData) {
    SetPlanHeader("Plan " + date.day + "-" + date.month + "-" + date.year)
  }

  useEffect(() => {
    let tempExercises: Exercise[];
    if (exerciseState.exercises[0].name == "" || exerciseState.exercises.length <= 0)
      db.transaction(t => t.executeSql(
        "SELECT * from exercise",
        undefined,
        (_, r) => {
          tempExercises = r.rows._array;
          tempExercises.forEach(ex => {
            ex.major_muscles = initialMajorMuscles;
          })
          if (scheduledItems[0] != undefined)
            if (scheduledItems[0].exercise == initialExerciseState.aExercise)
              db.transaction(
                t => {
                  t.executeSql("SELECT * FROM scheduled_item", [],
                    (_, results) => {
                      let tempScheduledItem: ScheduledItem[] = results.rows._array;
                      let a = results.rows._array.slice()
                      tempScheduledItem.forEach((ms, index) => {
                        ms.date = JSON.parse(ms.date.toString())
                        let t = tempExercises.find(ex => ex.name == a[index].exercise)
                        tempScheduledItem[index].exercise = t!;
                      })
                      setScheduledItems(tempScheduledItem)
                      setFilteredScheduledItems(tempScheduledItem)
                    },
                    (_, err) => {
                      console.log(err)
                      return true;
                    })
                }
              )
          setExerciseState({ ...exerciseState, exercises: tempExercises, filteredExercises: tempExercises })
        },
        (_, e) => { console.log(e); return true; }
      ))
    if (majorMuscles[0] == initialMajorMuscles[0]) {
      let tempMajorMuscles: MajorMuscle[];
      db.transaction(t => t.executeSql("SELECT * from major_muscle", undefined,
        (_, results) => {
          tempMajorMuscles = results.rows._array;
          setMajorMuscles(results.rows._array)
        }, (_, err) => { console.log(err); return true; }))
    }
    if (emm[0] == initialEmm[0])
      db.transaction(t => t.executeSql("SELECT * from exercise_major_muscle_one_to_many;", undefined,
        (_, results) => {
          let temp_emm_one_to_many = results.rows._array;
          setEmm(temp_emm_one_to_many)
        }, (_, err) => { console.log(err); return true; }))

    if (majorMuscles.length > 1 && exerciseState.exercises.length > 1 && emm.length > 1) {
      emm.forEach(x => {
        let ex = exerciseState.exercises.find(e => e.name == x.exercise_name)
        let mm2 = majorMuscles.find(mm => mm.name == x.major_muscle_name)
        if (ex == undefined) {
          Toast.show("There is an error is extracting major muscles from each exercises")
          return;
        }
        if (ex!.major_muscles == initialMajorMuscles) ex!.major_muscles = [mm2!];
        else ex!.major_muscles.push(mm2!)

      })
      setEmm([])
    }
  }, [scheduledItems, exerciseState, majorMuscles])
  init()
  // console.log(exerciseState.exercises.length)
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
  const renderScheduledItemDialogForEdit = () => {
    buttonStyle = styles.changeDateButtonEnabled;
    setEditability(true)
    setDropDownOpenOrNot(false)
    textInputStyle = styles.textInputEditable;
    setDialogText(EditScheduledItemText)
    setAScheduledItem(aScheduledItem)
    setDropDownExerciseNameSelected(aScheduledItem.exercise.name)
    setCurrentDate(aScheduledItem.date)
  }
  const renderScheduledItemDialogForDuplication = () => {

    buttonStyle = styles.changeDateButtonEnabled;
    setEditability(true)
    setDropDownOpenOrNot(false)
    textInputStyle = styles.textInputEditable;
    setDialogText(DuplicateScheduledItemText)
    setAScheduledItem(aScheduledItem)
    setDropDownExerciseNameSelected(aScheduledItem.exercise.name)
    setCurrentDate(aScheduledItem.date)
  }
  const renderExerciseDialogForEdit = () => {
    setEditability(true)
    textInputStyle = styles.textInputEditable;
    setDialogText(EditExerciseText)
    setDropDownOpenOrNot(false)
  }

  const handleResetDB = () => {
    resetTables()
    setExerciseState(initialExerciseState)
    setScheduledItems(initialScheduledItem)
    setMajorMuscles(initialMajorMuscles)
  }
  function cancelDialog() {
    setExDialogVisibility(false)
    setCalendarDialogVisibility(false)
    setPlanDialogVisibility(false)
  }


  // Exercises Functions:
  const commonExercisesCRUD = (es: Exercise[]) => {
    setExerciseState({ ...exerciseState, exercises: [...es], filteredExercises: [...es], filteredExerciseKeyword: "" })
    cancelDialog()
  }
  const renderExerciseDialogForViewing = (exercise: Exercise) => {
    setEditability(false)
    textInputStyle = styles.textInputViewOnly;
    setExerciseState({ ...exerciseState, aExercise: exercise,oldExerciseName:exercise.name })
    let names: string[] = [];
    exercise.major_muscles.forEach(mm => names.push(mm.name))
    setDropDownOpenOrNot(false)
    setDropDownMajorMuscleNameSelected(names)
    setDialogText(ExerciseInformationText)
    setExDialogVisibility(true)
    setPushPullDropDownValue(exercise.push_or_pull)
    setOpenPushPullDropDown(false)
  }

  let deleteExerciseConfirmation = (exercise: Exercise) => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this exercise?",
      [{ text: "Yes", onPress: () => deleteExercise(exercise) },
      { text: "No", onPress: () => renderExerciseDialogForViewing(exercise) }],//warning, recursive-
      { cancelable: true }
    )
  };
  let deleteExercise = (exercise: Exercise) => {
    let selected: MajorMuscle[] = majorMuscles.filter(x => dropDownMajorMuscleNameSelected.includes(x.name))
    selected.forEach(x =>
      db.transaction(t => t.executeSql(
        "DELETE FROM exercise_major_muscle_one_to_many WHERE exercise_name=? AND major_muscle_name=?",
        [exercise.name, x.name], undefined,
        (_, err) => { console.log(err); return true; }
      ))
    )
    db.transaction(t => t.executeSql("DELETE FROM exercise where name= ?", [exercise.name],
      () => {
        let deletedName = exercise.name;
        let es: Exercise[] = exerciseState.exercises.slice()
        es.forEach((currentExercise, i) => {
          if (currentExercise.name == deletedName) {
            es.splice(i, 1)
            return;
          }
        })
        //correct way of removing element from a array for me. Not using delete keyword which leaves a undefined space
        Toast.show("The exercise " + deletedName + " has is deleted.")
        commonExercisesCRUD(es)
      },
      (_, err) => {
        console.log(err)
        return true;
      }
    ))
  }
  const updateExercise = () => {
    const aExercise = exerciseState.aExercise;
    const oldExerciseName = exerciseState.oldExerciseName;
    let selected: MajorMuscle[] = majorMuscles.filter(x => dropDownMajorMuscleNameSelected.includes(x.name))
    let toBeUpdated = selected.filter(x => aExercise.major_muscles.includes(x))
    toBeUpdated.forEach(x => {
      if (toBeUpdated != undefined) db.transaction(t => t.executeSql(
        "INSERT INTO exercise_major_muscle_one_to_many (exercise_name,major_muscle_name) values (?,?)",
        [aExercise.name, x.name],
        undefined, (_, err) => { console.log(err); return true }
      ))
    })
    let toBeDeleted: MajorMuscle[] = selected.filter(x => !aExercise.major_muscles.includes(x))
    toBeDeleted.forEach(x => db.transaction(t => t.executeSql("DELETE FROM exercise_major_muscle_one_to_many WHERE exercise_name =? AND major_muscle_name=?",
      [aExercise.name, x.name], undefined, (_, err) => { console.log(err); return true; })))
    db.transaction(t => t.executeSql("UPDATE exercise SET name = ?, description = ?,imagesJson=?,push_or_pull=? where name = ?",
      [aExercise.name, aExercise.description, aExercise.imagesJson, pushPullDropDownValue, oldExerciseName],
      (_, result) => {
        let exerciseToBeUpdated: Exercise = {
          name: aExercise.name, description: aExercise.description, imagesJson: aExercise.imagesJson,
          major_muscles: selected, push_or_pull: pushPullDropDownValue
        }
        let es: Exercise[] = exerciseState.exercises.slice()
        es.forEach((currentExercise, i) => {
          if (currentExercise.name == oldExerciseName) {
            es.splice(i, 1, exerciseToBeUpdated)
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
    setExerciseState({ ...exerciseState, aExercise: initialExerciseState.aExercise })
    setDropDownMajorMuscleNameSelected([])
    setEditability(true)
    textInputStyle = styles.textInputEditable;
    setDialogText(CreateExerciseText)
    setExDialogVisibility(true)
    setDropDownOpenOrNot(false)
    setPushPullDropDownValue(PushPullEnum.Push)
    setOpenPushPullDropDown(false)
  }

  function createExercise() {
    const aExercise = exerciseState.aExercise;
    let selected: MajorMuscle[] = majorMuscles.filter(x => dropDownMajorMuscleNameSelected.includes(x.name))
    selected.forEach(x =>
      db.transaction(t => t.executeSql(
        "INSERT INTO exercise_major_muscle_one_to_many (exercise_name, major_muscle_name)VALUES (?,?)",
        [aExercise.name, x.name], undefined,
        (_, err) => { console.log(err); return true; }
      ))
    )
    db.transaction(t => t.executeSql("INSERT INTO exercise VALUES (?,?,?,?)",
      [aExercise.name, aExercise.description, aExercise.imagesJson, pushPullDropDownValue],
      (_, result) => {
        const es: Exercise[] = exerciseState.exercises.slice()
        es.push({
          name: aExercise.name, description: aExercise.description, imagesJson: aExercise.imagesJson, major_muscles: selected,
          push_or_pull: pushPullDropDownValue
        })
        commonExercisesCRUD(es)
        Toast.show("The exercise " + aExercise.name + " is created.")
      },
      (_, err) => {
        console.log(err)
        return true;
      }))
  }


  function handleFilterExercies(keyword: string) {
    setExerciseState({
      ...exerciseState,
      filteredExercises:
        exerciseState.exercises.filter(e => (
          e.name.includes(keyword)
          || e.major_muscles.filter(
            mm => mm.name.includes(keyword)
          ).length > 0
        )),
      filteredExerciseKeyword: keyword
    })
  }



  //Scheduled Item Functions:
  function commonScheduledItemCRUD(si: ScheduledItem[]) {
    setScheduledItems([...si])
    setFilteredScheduledItems([...si])
    // setFilteredExerciseKeyword("")
    cancelDialog()
  }
  function renderScheduledItemDialogForViewing(scheduledItem: ScheduledItem) {
    buttonStyle = styles.changeDateButtonDisabled;
    setEditability(false)
    textInputStyle = styles.textInputViewOnly;
    numberInputStyle = styles.numberInputViewOnly;
    setAScheduledItem(scheduledItem)
    setDialogText(ScheduledItemInformation)
    setDropDownOpenOrNot(false)
    setDropDownExerciseNameSelected(scheduledItem.exercise.name)
    setExDialogVisibility(false)
    setPlanDialogVisibility(true)
    setCurrentDate(scheduledItem.date)
  }
  let deleteScheduledItemConfirmation = (ms: ScheduledItem) => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this major set?",
      [{ text: "Yes", onPress: () => deleteScheduledItem(ms.id) },
      { text: "No", onPress: () => renderScheduledItemDialogForViewing(ms) }],//warning, recursive
      { cancelable: true }
    )
  };
  let deleteScheduledItem = (id: number) => {
    db.transaction(t => t.executeSql("DELETE FROM scheduled_item where id= ?", [id],
      () => {
        let si = scheduledItems.slice()
        si.forEach((ms1, i) => {
          if (ms1.id == id) {
            si.splice(i, 1)
            return;
          }
        })
        //correct way of removing element from a array for me. Not using delete keyword which leaves a undefined space
        Toast.show("The major set is deleted.")
        commonScheduledItemCRUD(si)
      },
      (_, err) => {
        console.log(err)
        return true;
      }
    ))
  }
  const updateScheduledItem = () => {
    if (dropDownExerciseNameSelected == undefined || dropDownExerciseNameSelected == "") {
      Toast.show("exercise must be selected")
      return;
    }
    let theexercise = exerciseState.exercises.filter((e, i, a) => {
      if (e.name == dropDownExerciseNameSelected) return e;
    })[0];
    db.transaction(t => t.executeSql(`UPDATE scheduled_item 
    SET exercise=?,reps=?,percent_complete=?,sets=?,duration_in_seconds=?,weight=?,notes=?,date=? 
    WHERE id=?`,
      [dropDownExerciseNameSelected, aScheduledItem.reps, aScheduledItem.percent_complete, aScheduledItem.sets,
        aScheduledItem.duration_in_seconds, aScheduledItem.weight,
        aScheduledItem.notes, JSON.stringify(currentDate), aScheduledItem.id],
      (_, result) => {
        let toBeUpdated: ScheduledItem = {
          id: aScheduledItem.id, exercise: theexercise, reps: aScheduledItem.reps,
          percent_complete: aScheduledItem.percent_complete, sets: aScheduledItem.sets,
          duration_in_seconds: aScheduledItem.duration_in_seconds,
          weight: aScheduledItem.weight, notes: aScheduledItem.notes, date: currentDate
        }
        let ms: ScheduledItem[] = scheduledItems.slice()
        ms.forEach((currentScheduledItem, i) => {
          if (currentScheduledItem.id == aScheduledItem.id) {
            ms.splice(i, 1, toBeUpdated)
            return;
          }
        })
        commonScheduledItemCRUD(ms)
        Toast.show("The major set is updated.")
      },
      (_, err) => {
        console.log(err)
        return true;
      }))

  }

  function showCreateScheduledItemDialog() {
    buttonStyle = styles.changeDateButtonEnabled;
    setEditability(true)
    textInputStyle = styles.textInputEditable;
    numberInputStyle = styles.numberInputEditable;
    setAScheduledItem(initialScheduledItem[0])
    setDialogText(CreateScheduledItemText)
    setPlanDialogVisibility(true)
    setDropDownExerciseNameSelected(exerciseState.exercises[0].name)
    setDropDownOpenOrNot(false)
    let parts: string[] = planHeader.split(" ")[1].split("-")
    let monthNumber: number = Number(parts[1])
    let month: string = monthNumber < 10 ? "0" + monthNumber.toString() : monthNumber.toString()
    let day: string = Number(parts[0]) < 10 ? "0" + parts[0] : parts[0];
    console.log(parts)
    setCurrentDate({
      year: Number(parts[2]), month: monthNumber, day: Number(parts[0]), timestamp: 0,
      dateString: parts[2] + "-" + month + "-" + day
    })
  }

  function createScheduledItem() {
    let e1: Exercise

    exerciseState.exercises.forEach(e => {
      if (e.name == dropDownExerciseNameSelected) aScheduledItem.exercise = e
    })
    db.transaction(t => {
      t.executeSql(`INSERT INTO scheduled_item
           (exercise,reps,percent_complete,sets,duration_in_seconds,weight,notes,date)  
           VALUES(?,?,?,?,?,?,?,?)`,
        [aScheduledItem.exercise.name, aScheduledItem.reps, aScheduledItem.percent_complete, aScheduledItem.sets,
        aScheduledItem.duration_in_seconds, aScheduledItem.weight,
        aScheduledItem.notes, JSON.stringify(currentDate)],
        (_, r) => {
          let tempScheduledItem = Object.assign({}, aScheduledItem)
          tempScheduledItem.id = r.insertId!
          tempScheduledItem.date = currentDate
          tempScheduledItem.duration_in_seconds = aScheduledItem.duration_in_seconds
          let m = scheduledItems.slice()
          m.push(tempScheduledItem)
          commonScheduledItemCRUD(m);
          Toast.show("Scheduled item created.")
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
    let filtered = scheduledItems.filter(si => {
      let sec = si.duration_in_seconds % 60;
      let min = Math.floor(si.duration_in_seconds / 60)
      return ((si.percent_complete.toString() + "%").includes(keyword)
        || si.id.toString().includes(keyword)
        || (si.weight.toString() + "kg").includes(keyword)
        || (si.sets.toString() + "x" + si.reps.toString()).includes(keyword)
        || (min + " minutes").includes(keyword)
        || (sec + " seconds").includes(keyword)
        || si.exercise.name.includes(keyword)
        || si.exercise.major_muscles.filter(
          si => si.name.includes(keyword)
        ).length > 0
      )
    }
    )
    setFilteredScheduledItems(filtered)
    setfilteredScheduledItemsKeywords(keyword)
  }
  return (
    <>
      <NavigationContainer>
        <ScheduleDialog
          isPlanDialogVisible={isPlanDialogVisible}
          dialogText={dialogText}
          isDropDownOpen={isDropDownOpen}
          exerciseState={exerciseState}
          dropDownExerciseNameSelected={dropDownExerciseNameSelected}
          aScheduledItem={aScheduledItem}
          setAScheduledItem={setAScheduledItem}
          isEditable={isEditable}
          setPlanDialogVisibility={setPlanDialogVisibility}
          setDropDownOpenOrNot={setDropDownOpenOrNot}
          setDropDownExerciseNameSelected={setDropDownExerciseNameSelected}
          isCalendarDialogVisible={isCalendarDialogVisible}
          setCalendarDialogVisibility={setCalendarDialogVisibility}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}

          cancelDialog={cancelDialog}

          deleteScheduledItemConfirmation={deleteScheduledItemConfirmation}
          renderScheduledItemDialogForEdit={renderScheduledItemDialogForEdit}
          createScheduledItem={createScheduledItem}
          updateScheduledItem={updateScheduledItem}
          renderScheduledItemDialogForViewing={renderScheduledItemDialogForViewing}
          renderScheduledItemDialogForDuplication={renderScheduledItemDialogForDuplication}

        />
        <ExerciseDialog
          isExDialogVisible={isExDialogVisible}
          dialogText={dialogText}
          isDropDownOpen={isDropDownOpen}
          isEditable={isEditable}
          exerciseState={exerciseState}
          pushPullDropDownValue={pushPullDropDownValue}
          majorMuscles={majorMuscles}
          openPushPullDropDown={openPushPullDropDown}
          dropDownMajorMuscleNameSelected={dropDownMajorMuscleNameSelected}

          setExerciseState={setExerciseState}
          setExDialogVisibility={setExDialogVisibility}
          setDropDownOpenOrNot={setDropDownOpenOrNot}
          setPushPullDropDownValue={setPushPullDropDownValue}
          setDropDownMajorMuscleNameSelected={setDropDownMajorMuscleNameSelected}
          setOpenPushPullDropDown={setOpenPushPullDropDown}


          cancelDialog={cancelDialog}
          aScheduledItem={aScheduledItem}
          deleteExerciseConfirmation={deleteExerciseConfirmation}
          renderExerciseDialogForEdit={renderExerciseDialogForEdit}
          createExercise={createExercise}
          updateExercise={updateExercise}
          renderExerciseDialogForViewing={renderExerciseDialogForViewing}

        />
        <handleResetDBContext.Provider value={handleResetDB}>
          <ExerciseScreenContext.Provider value={{
            exercises: exerciseState.filteredExercises,
            handleSelected: renderExerciseDialogForViewing,
            handleCreate: showCreateExerciseDialog,
            filteredKeyword: exerciseState.filteredExerciseKeyword,
            handleFilterExercises: handleFilterExercies
          }}>
            <ScheduledItemContext.Provider value={{
              majorSet: filteredScheduledItems,
              handleSelected: renderScheduledItemDialogForViewing,
              handleCreate: showCreateScheduledItemDialog,
              handleFilterScheduledItem: handleFilterScheduledItem,
              filteredKeyword: filteredScheduledItemKeyword,
              handlePlanHeader: handlePlanHeader
            }}>
              <Tab.Navigator
                screenOptions={({ route }) =>
                ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName: any;
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
                <Tab.Screen
                  options={
                    { headerTitle: planHeader }}
                  name="Plan" component={PlanScreen} />
                <Tab.Screen name="Exercises" component={ExercisesScreen} />
                <Tab.Screen name="Settings" component={SettingsScreen} />
              </Tab.Navigator>
            </ScheduledItemContext.Provider>
          </ExerciseScreenContext.Provider>
        </handleResetDBContext.Provider>
      </NavigationContainer >
    </>
  )
}
