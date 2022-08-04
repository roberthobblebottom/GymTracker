import {
  Alert, LogBox
} from 'react-native';
import { ExercisesScreen } from './screens/ExercisesScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { PlanScreen } from './screens/PlanScreen';
import 'react-native-gesture-handler';
import React, { useState, useEffect, Dispatch } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { init, db, resetTables, createScheduledItem, deleteScheduledItem, updateScheduledItem, 
  createExerciseMajorMuscleRelationship, createExercise, deleteExerciseMajorMuscleRelationship, deleteExercise, updateExercise } 
  from './dbhandler';
import { ButtonSetProps, ContextProps, DialogState, Emm, Exercise, ExerciseState, MajorMuscle, PushPullEnum, ScheduledItemState } from './types';
import { ScheduledItem } from './types';
import Toast from 'react-native-simple-toast';
import Colors from './constants/Colors';
import { DateData } from 'react-native-calendars';
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import _default from 'babel-plugin-transform-typescript-metadata';
import { ScheduleDialog } from './screens/ScheduleDialog';
import { ExerciseDialog } from './screens/ExerciseDialog';
import { styles } from './constants/styles';
import { SelectDateDialog } from './screens/SelectDateDialog';
import * as Filesystem from 'expo-file-system';
import { StorageAccessFramework } from 'expo-file-system'
LogBox.ignoreLogs(['Require cycle:'])
const Tab = createBottomTabNavigator()

let d: Date = new Date()

//initial constant values
export const initialDate = { year: 0, month: 0, day: 0, timestamp: 0, dateString: "" };
export const initialExerciseState: ExerciseState = {
  exercises: [{ name: "", description: "", imagesJson: "", major_muscles: [], push_or_pull: PushPullEnum.Push }]
  , aExercise: { name: "", description: "", imagesJson: "", major_muscles: [], push_or_pull: PushPullEnum.Push }
  , filteredExercises: [{ name: "", description: "", imagesJson: "", major_muscles: [], push_or_pull: PushPullEnum.Push }]
  , filteredExerciseKeyword: ""
  , oldExerciseName: ""
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
export const initialScheduledItemState: ScheduledItemState = {
  scheduledItems: initialScheduledItem,
  aScheduledItem: initialScheduledItem[0],
  filteredScheduledItems: initialScheduledItem,
  filteredScheduledItemKeyword: "",
  selectedScheduledItems: [],
  isMovingScheduledItems: false
}
const initialMajorMuscles: MajorMuscle[] = [{ name: "", notes: "", imageJson: "" }];
const initialEmm: Emm[] = [{ id: 9999, exercise_name: "", major_muscle_name: "" }];
const initialDialogState = {
  isExDialogVisible: false,
  openPushPullDropDown: false,
  dialogText: "",
  isEditable: false,
  isCalendarDialogVisible: false,
  isDropDownOpen: false,
  isPlanDialogVisible: false,
  isHistoryDialogVisible: false,
  planHeader: "Plan " + d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear(),
  isExerciseHistory: true,
}
const initalContextProps: ContextProps = {
  renderScheduledItemDialogForViewing: Function,
  renderScheduledItemDialogForCreate: Function,
  handleFilterScheduledItem: Function,
  handlePlanHeader: Function,
  scheduledItemState: initialScheduledItemState,
  setScheduledItemState: () => { },
  exerciseState: initialExerciseState,
  setExerciseState: () => { },
  renderExerciseDialogForCreate: Function,
  renderExerciseDialogForViewing: Function,
  handleFilterExercises: Function,
  commonScheduledItemCRUD: Function,
  setDialogState: () => { },
  dialogState: initialDialogState,
}

//contexts
export const SettingsScreenContext = React.createContext({
  handleResetDB: () => { },
  handleExport: () => { }
})
export const ExerciseScreenContext = React.createContext({ contextProps: initalContextProps })
export const ScheduledItemContext = React.createContext({ contextProps: initalContextProps })

export default function App() {
  const [exerciseState, setExerciseState] = useState<ExerciseState>(initialExerciseState)
  const [scheduledItemState, setScheduledItemState] = useState<ScheduledItemState>(initialScheduledItemState)
  const [majorMuscles, setMajorMuscles] = useState(initialMajorMuscles)
  const [emm, setEmm] = useState(initialEmm)


  //Various Drop downs
  const [dropDownMajorMuscleNameSelected, setMajorMuscleValues] = useState([""])
  const [dropDownExNameSelected, setDropDownExNameSelected] = useState("")
  const [dropDownPushPullSelected, setDropDownPushPullSelected] = useState(PushPullEnum.Push)
  const [dialogState, SetDialogState] = useState<DialogState>(initialDialogState)

  //constant strings
  const ExerciseInformationText = "Exercise Information";
  const EditExerciseText = "Edit Exercise:";
  const CreateExerciseText = "Create Exercise:";
  const CreateScheduledItemText = "Create:";
  const ScheduledItemInformation = "Information:";
  const EditScheduledItemText: string = "Edit";
  const DuplicateScheduledItemText: string = "Duplicate:";

  function handlePlanHeader(date: DateData) {
    let s: string = ("Plan " + date.day + "-" + date.month + "-" + date.year)
    SetDialogState({ ...dialogState, planHeader: s });
  }
  useEffect(() => {
    let tempExercises: Exercise[];
    if (exerciseState.exercises[0].name == "" || exerciseState.exercises.length <= 0)
      db.transaction(t => t.executeSql(
        "SELECT * from exercise",
        undefined,
        (_, r) => {
          tempExercises = r.rows._array;
          tempExercises.forEach(ex => ex.major_muscles = initialMajorMuscles)
          if (scheduledItemState.scheduledItems[0] != undefined)
            if (scheduledItemState.scheduledItems[0].exercise == initialExerciseState.aExercise)
              db.transaction(
                t =>
                  t.executeSql("SELECT * FROM scheduled_item", [],
                    (_, results) => {
                      let tempScheduledItems: ScheduledItem[] = results.rows._array;
                      let a = results.rows._array.slice()
                      tempScheduledItems.forEach((ms, index) => {
                        ms.date = JSON.parse(ms.date.toString())
                        let t = tempExercises.find(ex => {
                          return ex.name == a[index].exercise
                        })
                        tempScheduledItems[index].exercise = t!;
                      })
                      setScheduledItemState({
                        ...scheduledItemState,
                        scheduledItems: tempScheduledItems,
                        filteredScheduledItems: tempScheduledItems
                      })
                    },
                    (_, err) => { console.log(err); return true; })
              )
          setExerciseState({
            ...exerciseState,
            exercises: tempExercises,
            filteredExercises: tempExercises
          })
        },
        (_, e) => { console.log(e); return true; }
      ))
    if (majorMuscles[0] == initialMajorMuscles[0])
      db.transaction(t => t.executeSql("SELECT * from major_muscle", undefined,
        (_, results) => setMajorMuscles(results.rows._array)
        , (_, err) => { console.log(err); return true; }))
    if (emm[0] == initialEmm[0])
      db.transaction(t => t.executeSql("SELECT * from exercise_major_muscle_one_to_many;", undefined,
        (_, results) => setEmm(results.rows._array)
        , (_, err) => { console.log(err); return true; }))
    if (majorMuscles.length > 1 && exerciseState.exercises.length > 1 && emm.length > 1) {
      emm.forEach(x => {
        let ex = exerciseState.exercises.find(e => e.name == x.exercise_name)
        let mm2 = majorMuscles.find(mm => mm.name == x.major_muscle_name)
        if (ex == undefined) {
          Toast.show("There is an error is extracting major muscles from each exercises")
          return;
        }
        if (ex!.major_muscles == initialMajorMuscles) ex!.major_muscles = [mm2!]
        else if(!ex!.major_muscles.find(x=>x.name==mm2?.name)) ex!.major_muscles.push(mm2!)
      })
    }
  }, [scheduledItemState, exerciseState, majorMuscles, emm])
  init()

  let textInputStyle, numberInputStyle, buttonStyle;
  if (dialogState.isEditable) {
    textInputStyle = styles.textInputEditable
    numberInputStyle = styles.numberInputEditable
    buttonStyle = styles.changeDateButtonEnabled
  } else {
    textInputStyle = styles.textInputViewOnly
    numberInputStyle = styles.numberInputViewOnly
    buttonStyle = styles.changeDateButtonDisabled
  }

  const handleResetDB = () => {
    resetTables()
    setExerciseState(initialExerciseState)
    setScheduledItemState(initialScheduledItemState)
    SetDialogState(initialDialogState)
    setMajorMuscles(initialMajorMuscles)
    setEmm(initialEmm)
  }

  async function handleExport() {
    const exportData = {
      exercises: exerciseState.exercises,
      majorMuscles: majorMuscles,
      scheduledItems: scheduledItemState.scheduledItems
    }
    //     const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync()
    //     if(!permissions.granted)
    // return
  }
  function cancelDialog() {
    SetDialogState({ ...dialogState, isExDialogVisible: false, isCalendarDialogVisible: false, isPlanDialogVisible: false });
  }

  // Exercises Functions:
  //renders
  const renderExerciseDialogForViewing = (exercise: Exercise) => {
    textInputStyle = styles.textInputViewOnly;
    setExerciseState({ ...exerciseState, aExercise: exercise, oldExerciseName: exercise.name })
    let names: string[] = [];
    exercise.major_muscles.forEach(mm => names.push(mm.name))
    setMajorMuscleValues(names)
    setDropDownPushPullSelected(exercise.push_or_pull)
    SetDialogState({
      ...dialogState,
      isExDialogVisible: true,
      openPushPullDropDown: false,
      dialogText: ExerciseInformationText,
      isEditable: false,
      isDropDownOpen: false,
    });
  }

  const renderExerciseDialogForEdit = () => {
    textInputStyle = styles.textInputEditable;
    SetDialogState({ ...dialogState, isEditable: true, dialogText: EditExerciseText, isDropDownOpen: false, openPushPullDropDown: false });
  }

  const renderExerciseDialogForCreate = () => {
    setExerciseState({ ...exerciseState, aExercise: initialExerciseState.aExercise })
    setMajorMuscleValues([])
    textInputStyle = styles.textInputEditable;
    SetDialogState({
      ...dialogState,
      isExDialogVisible: true,
      openPushPullDropDown: false,
      dialogText: CreateExerciseText,
      isEditable: true,
      isDropDownOpen: false
    });
    setDropDownPushPullSelected(PushPullEnum.Push)
  }

  //db
  const commonExercisesCRUD = (es: Exercise[]) => {
    setExerciseState({ ...exerciseState, exercises: [...es], filteredExercises: [...es], filteredExerciseKeyword: "" })
    cancelDialog()
  }

  let deleteExerciseConfirmation = (exercise: Exercise) => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this exercise?",
      [{ text: "Yes", onPress: () => deleteExerciseWithStateUpdate(exercise) },
      { text: "No", onPress: () => renderExerciseDialogForViewing(exercise) }],//warning, recursive-
      { cancelable: true }
    )
  };

  let deleteExerciseWithStateUpdate = (exercise: Exercise) => {
    let selected: MajorMuscle[] = majorMuscles.filter(x => dropDownMajorMuscleNameSelected.includes(x.name))
    selected.forEach(x => deleteExerciseMajorMuscleRelationship(exercise.name, x.name))
    deleteExercise(exercise.name, () => {
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
    })
  }

  const updateExerciseWithStateUpdate = () => {
    const aExercise = exerciseState.aExercise
    const oldExerciseName = exerciseState.oldExerciseName
    const pushPullDropDownValue = dropDownPushPullSelected
    let selected: MajorMuscle[] = majorMuscles.filter(x => dropDownMajorMuscleNameSelected.includes(x.name))
    let toBeCreated: MajorMuscle[] = selected.filter(x => !aExercise.major_muscles.find(t=>t.name==x.name))
    let toBeDeleted:MajorMuscle[]=aExercise.major_muscles.filter(x=>!selected.find(t=>t.name==x.name))
    console.log("mm")
    console.log(aExercise.major_muscles)
    console.log("selected")
    console.log(selected)
    console.log("toBeCreated")
    console.log(toBeCreated)
    console.log("tobedeleted")
console.log(toBeDeleted)
    toBeCreated.forEach(x =>createExerciseMajorMuscleRelationship(aExercise.name, x.name))
    toBeDeleted.forEach(x => deleteExerciseMajorMuscleRelationship(aExercise.name, x.name))
    aExercise.push_or_pull = pushPullDropDownValue
    updateExercise(aExercise, oldExerciseName,
      (_, result) => {
        let exerciseToBeUpdated: Exercise = {
          name: aExercise.name, description: aExercise.description, imagesJson: aExercise.imagesJson,
          major_muscles: selected, push_or_pull: dropDownPushPullSelected
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
      })
  }

  function createExerciseWithStateUpdate() {
    const aExercise = exerciseState.aExercise;
    let selected: MajorMuscle[] = majorMuscles.filter(x => dropDownMajorMuscleNameSelected.includes(x.name))
    selected.forEach(x => createExerciseMajorMuscleRelationship(aExercise.name, x.name))

    aExercise.push_or_pull = dropDownPushPullSelected
    console.log(aExercise.push_or_pull)
    createExercise(aExercise,(_, result) => {
        const es: Exercise[] = exerciseState.exercises.slice()
        es.push({
          name: aExercise.name, description: aExercise.description, imagesJson: aExercise.imagesJson, major_muscles: selected,
          push_or_pull: dropDownPushPullSelected
        })
        commonExercisesCRUD(es)
        Toast.show("The exercise " + aExercise.name + " is created.")
      })
  }

  function handleFilterExercises(keyword: string) {
    console.log("handleFilterExercises")
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
  //renders:
  function renderScheduledItemDialogForViewing(scheduledItem: ScheduledItem) {
    buttonStyle = styles.changeDateButtonDisabled;
    textInputStyle = styles.textInputViewOnly;
    numberInputStyle = styles.numberInputViewOnly;
    setScheduledItemState({ ...scheduledItemState, aScheduledItem: scheduledItem })
    SetDialogState({
      ...dialogState,
      isEditable: false,
      dialogText: ScheduledItemInformation,
      isExDialogVisible: false,
      openPushPullDropDown: false,
      isPlanDialogVisible: true
    })
    setDropDownExNameSelected(scheduledItem.exercise.name)
  }

  function commonLogicForScheduledItemEditAndDuplication(dialogText: string) {
    buttonStyle = styles.changeDateButtonEnabled;
    textInputStyle = styles.textInputEditable;
    setScheduledItemState({ ...scheduledItemState, })
    SetDialogState({
      ...dialogState,
      isEditable: true,
      isDropDownOpen: false,
      dialogText: dialogText
    });
    setDropDownExNameSelected(scheduledItemState.aScheduledItem.exercise.name)
  }

  const renderScheduledItemDialogForEdit = () => {
    commonLogicForScheduledItemEditAndDuplication(EditScheduledItemText)
  }

  const renderScheduledItemDialogForDuplication = () => {
    commonLogicForScheduledItemEditAndDuplication(DuplicateScheduledItemText)
  }

  function renderScheduledItemDialogForCreate() {
    buttonStyle = styles.changeDateButtonEnabled;
    textInputStyle = styles.textInputEditable;
    numberInputStyle = styles.numberInputEditable;
    setScheduledItemState({ ...scheduledItemState, aScheduledItem: initialScheduledItem[0] })
    SetDialogState({
      ...dialogState,
      isEditable: true,
      dialogText: CreateScheduledItemText,
      isPlanDialogVisible: true,
      isDropDownOpen: false,
    })
    setDropDownExNameSelected(exerciseState.exercises[0].name)
    let parts: string[] = dialogState.planHeader.split(" ")[1].split("-")
    let monthNumber: number = Number(parts[1])
    let month: string = monthNumber < 10 ? "0" + monthNumber.toString() : monthNumber.toString()
    let day: string = Number(parts[0]) < 10 ? "0" + parts[0] : parts[0];
    let date: DateData = {
      year: Number(parts[2]), month: monthNumber, day: Number(parts[0]), timestamp: 0,
      dateString: parts[2] + "-" + month + "-" + day
    }
    const aScheduledItem = initialScheduledItem[0]
    aScheduledItem.date = date;
    setScheduledItemState({ ...scheduledItemState, aScheduledItem: { ...aScheduledItem } })
  }

  //db:
  function commonScheduledItemCRUD(si: ScheduledItem[]) {
    setScheduledItemState({
      ...scheduledItemState, scheduledItems: [...si],
      filteredScheduledItems: [...si],
      selectedScheduledItems: [],
      isMovingScheduledItems: false
    })
    cancelDialog()
  }

  let deleteScheduledItemConfirmation = (ms: ScheduledItem) => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this scheduled item?",
      [{ text: "Yes", onPress: () => deleteScheduledItemWithStateUpdate(ms.id) },
      { text: "No", onPress: () => renderScheduledItemDialogForViewing(ms) }],//warning, recursive
      { cancelable: true }
    )
  };

  let deleteScheduledItemWithStateUpdate = (id: number) => {
    deleteScheduledItem(id, () => {
      let si = scheduledItemState.scheduledItems.slice()
      si.forEach((ms1, i) => {
        if (ms1.id == id) {
          si.splice(i, 1)
          return;
        }
      }) //correct way of removing element from a array for me. Not using delete keyword which leaves a undefined space
      Toast.show("The scheduled item is deleted.")
      commonScheduledItemCRUD(si)
    })
  }

  const updateScheduledItemWithStateUpdate = () => {
    const aScheduledItem = scheduledItemState.aScheduledItem
    if (dropDownExNameSelected == undefined || dropDownExNameSelected == "") {
      Toast.show("exercise must be selected")
      return;
    }
    let theexercise = exerciseState.exercises.filter((e, i, a) => {
      if (e.name == dropDownExNameSelected) return e;
    })[0];
    updateScheduledItem(aScheduledItem,
      (_, result) => {
        let toBeUpdated: ScheduledItem = {
          id: aScheduledItem.id, exercise: theexercise, reps: aScheduledItem.reps,
          percent_complete: aScheduledItem.percent_complete, sets: aScheduledItem.sets,
          duration_in_seconds: aScheduledItem.duration_in_seconds,
          weight: aScheduledItem.weight, notes: aScheduledItem.notes, date: aScheduledItem.date
        }
        let ms: ScheduledItem[] = scheduledItemState.scheduledItems.slice()
        ms.forEach((currentScheduledItem, i) => {
          if (currentScheduledItem.id == aScheduledItem.id) {
            ms.splice(i, 1, toBeUpdated)
            return;
          }
        })
        commonScheduledItemCRUD(ms)
        Toast.show("The major set is updated.")
      },
    )
  }

  function createScheduledItemWithStateUpdate() {
    let e1: Exercise
    const aScheduledItem = scheduledItemState.aScheduledItem
    exerciseState.exercises.forEach(e => {
      if (e.name == dropDownExNameSelected) {
        aScheduledItem.exercise = e
        return
      }
    })
    createScheduledItem(aScheduledItem,
      (_, r) => {
        let tempScheduledItem = Object.assign({}, aScheduledItem)
        tempScheduledItem.id = r.insertId!
        tempScheduledItem.date = aScheduledItem.date
        tempScheduledItem.duration_in_seconds = aScheduledItem.duration_in_seconds
        let m = scheduledItemState.scheduledItems.slice()
        m.push(tempScheduledItem)
        commonScheduledItemCRUD(m)
        Toast.show("Scheduled item created.")
      })
  }

  function handleFilterScheduledItem(keyword: string) {
    let filtered = scheduledItemState.scheduledItems.filter(si => {
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
    setScheduledItemState({ ...scheduledItemState, filteredScheduledItems: filtered, filteredScheduledItemKeyword: keyword })
  }
  const buttonsSetProps: ButtonSetProps = {
    cancelDialog: cancelDialog,
    deleteScheduledItemConfirmation: deleteScheduledItemConfirmation,
    deleteExerciseConfirmation: deleteExerciseConfirmation,
    createExerciseWithStateUpdate: createExerciseWithStateUpdate,
    updateExerciseWithStateUpdate: updateExerciseWithStateUpdate,
    createScheduledItemWithStateUpdate:createScheduledItemWithStateUpdate,
    updateScheduledItemWithStateUpdate:updateScheduledItemWithStateUpdate,
    renderScheduledItemDialogForViewing: renderScheduledItemDialogForViewing,
    renderScheduledItemDialogForDuplication: renderScheduledItemDialogForDuplication,
    renderScheduledItemDialogForEdit: renderScheduledItemDialogForEdit,
    renderExerciseDialogForEdit: renderExerciseDialogForEdit,
    renderExerciseDialogForViewing: renderExerciseDialogForViewing,
  };

  const contextProps: ContextProps = {
    renderScheduledItemDialogForViewing: renderScheduledItemDialogForViewing,
    renderScheduledItemDialogForCreate: renderScheduledItemDialogForCreate,
    renderExerciseDialogForCreate: renderExerciseDialogForCreate,
    renderExerciseDialogForViewing: renderExerciseDialogForViewing,

    handleFilterScheduledItem: handleFilterScheduledItem,
    handlePlanHeader: handlePlanHeader,
    handleFilterExercises: handleFilterExercises,

    commonScheduledItemCRUD: commonScheduledItemCRUD,

    scheduledItemState: scheduledItemState,
    dialogState: dialogState,
    exerciseState: exerciseState,

    setDialogState: SetDialogState,
    setScheduledItemState: setScheduledItemState,
    setExerciseState: setExerciseState,
  }

  return (
    <>
      <NavigationContainer>
        <ScheduleDialog
          dialogState={dialogState}
          exerciseState={exerciseState}
          scheduledItemState={scheduledItemState}
          dropDownExNameSelected={dropDownExNameSelected}

          setScheduledItemState={setScheduledItemState}
          setDialogState={SetDialogState}
          setDropDownExNameSelected={setDropDownExNameSelected}

          createExerciseWithStateUpdate={createExerciseWithStateUpdate}
          updateExerciseWithStateUpdate={updateExerciseWithStateUpdate}
          buttonsSetProps={buttonsSetProps}
        />
        <ExerciseDialog
          exerciseState={exerciseState}
          dialogState={dialogState}
          scheduledItemState={scheduledItemState}
          majorMuscles={majorMuscles}
          dropDownPushPullSelected={dropDownPushPullSelected}
          dropDownMajorMuscleNameSelected={dropDownMajorMuscleNameSelected}

          setDropDownPushPullSelected={setDropDownPushPullSelected}
          setDialogState={SetDialogState}
          setExerciseState={setExerciseState}
          setMajorMuscleValues={setMajorMuscleValues}

          buttonsSetProps={buttonsSetProps}
        />
        <SelectDateDialog
          scheduledItemState={scheduledItemState}
          dialogState={dialogState}

          setScheduledItemState={setScheduledItemState}
          setDialogState={SetDialogState}

          commonScheduledItemCRUD={commonScheduledItemCRUD}
        />
        <SettingsScreenContext.Provider value={{
          handleResetDB: handleResetDB,
          handleExport: handleExport
        }}>
          <ExerciseScreenContext.Provider value={{ contextProps: contextProps }}>
            <ScheduledItemContext.Provider value={{ contextProps: contextProps }}>
              <Tab.Navigator
                screenOptions={({ route }) =>
                ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName: any
                    switch (route.name) {
                      case 'Plan':
                        iconName = focused ? 'clipboard-list' : 'clipboard-list-outline'
                        return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                      case 'Exercises':
                        iconName = focused ? 'arm-flex' : 'arm-flex-outline'
                        return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                      case 'Settings':
                        iconName = focused ? 'settings' : 'settings-outline'
                        return <Ionicons name={iconName} size={size} color={color} />;
                    }
                  },
                  tabBarActiveTintColor: Colors.light.tint
                })
                }>
                <Tab.Screen
                  options={{ headerTitle: dialogState.planHeader }}
                  name="Plan" component={PlanScreen} />
                <Tab.Screen name="Exercises" component={ExercisesScreen} />
                <Tab.Screen name="Settings" component={SettingsScreen} />
              </Tab.Navigator>
            </ScheduledItemContext.Provider>
          </ExerciseScreenContext.Provider>
        </SettingsScreenContext.Provider>
      </NavigationContainer >
    </>
  )
}
