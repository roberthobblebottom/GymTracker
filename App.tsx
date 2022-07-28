import {
  Alert, LogBox
} from 'react-native';
import { ExercisesScreen } from './screens/ExercisesScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { PlanScreen } from './screens/PlanScreen';
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { init, db, resetTables } from './dbhandler';
import { Emm, Exercise, ExerciseState, MajorMuscle, PushPullEnum, ScheduledItemState } from './types';
import { ScheduledItem } from './types';
import Toast from 'react-native-simple-toast';
import Colors from './constants/Colors';
import { DateData } from 'react-native-calendars';
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import _default from 'babel-plugin-transform-typescript-metadata';
import { ScheduleDialog } from './screens/ScheduleDialog';
import { ExerciseDialog } from './screens/ExerciseDialog';
import { styles } from './constants/styles';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
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
  currentDate: initialDate
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
  planHeader: "Plan " + d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear()
}
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

  const [exerciseState, setExerciseState] = useState<ExerciseState>(initialExerciseState)

  //Various Drop downs
  const [dropDownMajorMuscleNameSelected, setMajorMuscleValues] = useState([""])
  const [dropDownExNameSelected, setDropDownExNameSelected] = useState("")
  const [dropDownPushPullSelected, setDropDownPushPullSelected] = useState(PushPullEnum.Push)
  const [dialogState, SetDialogState] = useState(initialDialogState)

  //for majorSet
  const [scheduledItemState, setScheduledItemState] = useState<ScheduledItemState>(initialScheduledItemState)

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
          tempExercises.forEach(ex => {
            ex.major_muscles = initialMajorMuscles;
          })
          if (scheduledItemState.scheduledItems[0] != undefined)
            if (scheduledItemState.scheduledItems[0].exercise == initialExerciseState.aExercise)
              db.transaction(
                t => {
                  t.executeSql("SELECT * FROM scheduled_item", [],
                    (_, results) => {
                      let tempScheduledItems: ScheduledItem[] = results.rows._array;
                      let a = results.rows._array.slice()
                      tempScheduledItems.forEach((ms, index) => {
                        ms.date = JSON.parse(ms.date.toString())
                        let t = tempExercises.find(ex => ex.name == a[index].exercise)
                        tempScheduledItems[index].exercise = t!;
                      })
                      setScheduledItemState({ ...scheduledItemState, scheduledItems: tempScheduledItems, filteredScheduledItems: tempScheduledItems })
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
      db.transaction(t => t.executeSql("SELECT * from major_muscle", undefined,
        (_, results) => {
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
  }, [scheduledItemState, exerciseState, majorMuscles])

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
    setMajorMuscles(initialMajorMuscles)
  }
  function cancelDialog() {
    SetDialogState({ ...dialogState, isExDialogVisible: false, isCalendarDialogVisible: false, isPlanDialogVisible: false });
  }

  // Exercises Functions:
  //renders:
  const renderScheduledItemDialogForEdit = () => {
    buttonStyle = styles.changeDateButtonEnabled;
    textInputStyle = styles.textInputEditable;
    // setAScheduledItem(aScheduledItem)
    setScheduledItemState({ ...scheduledItemState, currentDate: scheduledItemState.aScheduledItem.date })
    SetDialogState({
      ...dialogState, isEditable: true, dialogText: EditScheduledItemText,
      isDropDownOpen: false
    });
    setDropDownExNameSelected(scheduledItemState.aScheduledItem.exercise.name)
  }

  const renderScheduledItemDialogForDuplication = () => {
    buttonStyle = styles.changeDateButtonEnabled;
    textInputStyle = styles.textInputEditable;
    // setAScheduledItem(aScheduledItem)
    setScheduledItemState({ ...scheduledItemState, currentDate: scheduledItemState.aScheduledItem.date })
    setDropDownExNameSelected(scheduledItemState.aScheduledItem.exercise.name)
    SetDialogState({
      ...dialogState, isEditable: true, dialogText: DuplicateScheduledItemText,
      isDropDownOpen: false,
    });
  }
  const renderExerciseDialogForEdit = () => {
    textInputStyle = styles.textInputEditable;
    SetDialogState({ ...dialogState, isEditable: true, dialogText: EditExerciseText, isDropDownOpen: false, openPushPullDropDown: false });
  }
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
  const renderExerciseDialogForCreate = () => {
    setExerciseState({ ...exerciseState, aExercise: initialExerciseState.aExercise })
    setMajorMuscleValues([])
    textInputStyle = styles.textInputEditable;
    SetDialogState({
      ...dialogState,
      isExDialogVisible: true,
      openPushPullDropDown: false,
      dialogText: CreateExerciseText,
      isEditable: true
      , isDropDownOpen: false
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
    const aExercise = exerciseState.aExercise
    const oldExerciseName = exerciseState.oldExerciseName
    const pushPullDropDownValue = dropDownPushPullSelected
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
      },
      (_, err) => {
        console.log(err)
        return true;
      }))

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
      [aExercise.name, aExercise.description, aExercise.imagesJson, dropDownPushPullSelected],
      (_, result) => {
        const es: Exercise[] = exerciseState.exercises.slice()
        es.push({
          name: aExercise.name, description: aExercise.description, imagesJson: aExercise.imagesJson, major_muscles: selected,
          push_or_pull: dropDownPushPullSelected
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
    setScheduledItemState({ ...scheduledItemState, scheduledItems: [...si], filteredScheduledItems: [...si] })
    // setFilteredExerciseKeyword("")
    cancelDialog()
  }
  function renderScheduledItemDialogForViewing(scheduledItem: ScheduledItem) {
    buttonStyle = styles.changeDateButtonDisabled;
    textInputStyle = styles.textInputViewOnly;
    numberInputStyle = styles.numberInputViewOnly;
    setScheduledItemState({ ...scheduledItemState, aScheduledItem: scheduledItem, currentDate: scheduledItem.date })
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
      isDropDownOpen: false
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
    setScheduledItemState({ ...scheduledItemState, currentDate: date })
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
        let si = scheduledItemState.scheduledItems.slice()
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
    const aScheduledItem = scheduledItemState.aScheduledItem
    const currentDate = scheduledItemState.currentDate

    if (dropDownExNameSelected == undefined || dropDownExNameSelected == "") {
      Toast.show("exercise must be selected")
      return;
    }
    let theexercise = exerciseState.exercises.filter((e, i, a) => {
      if (e.name == dropDownExNameSelected) return e;
    })[0];
    db.transaction(t => t.executeSql(`UPDATE scheduled_item 
    SET exercise=?,reps=?,percent_complete=?,sets=?,duration_in_seconds=?,weight=?,notes=?,date=? 
    WHERE id=?`,
      [dropDownExNameSelected, aScheduledItem.reps, aScheduledItem.percent_complete, aScheduledItem.sets,
        aScheduledItem.duration_in_seconds, aScheduledItem.weight,
        aScheduledItem.notes, JSON.stringify(currentDate), aScheduledItem.id],
      (_, result) => {
        let toBeUpdated: ScheduledItem = {
          id: aScheduledItem.id, exercise: theexercise, reps: aScheduledItem.reps,
          percent_complete: aScheduledItem.percent_complete, sets: aScheduledItem.sets,
          duration_in_seconds: aScheduledItem.duration_in_seconds,
          weight: aScheduledItem.weight, notes: aScheduledItem.notes, date: currentDate
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
      (_, err) => {
        console.log(err)
        return true;
      }))

  }

  function createScheduledItem() {
    let e1: Exercise
    const aScheduledItem = scheduledItemState.aScheduledItem
    const currentDate = scheduledItemState.currentDate
    exerciseState.exercises.forEach(e => {
      if (e.name == dropDownExNameSelected) aScheduledItem.exercise = e
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
          let m = scheduledItemState.scheduledItems.slice()
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
          
          cancelDialog={cancelDialog}
          deleteScheduledItemConfirmation={deleteScheduledItemConfirmation}
          renderScheduledItemDialogForEdit={renderScheduledItemDialogForEdit}
          createScheduledItem={createScheduledItem}
          updateScheduledItem={updateScheduledItem}
          renderScheduledItemDialogForViewing={renderScheduledItemDialogForViewing}
          renderScheduledItemDialogForDuplication={renderScheduledItemDialogForDuplication}

        />
        <ExerciseDialog
          exerciseState={exerciseState}
          majorMuscles={majorMuscles}
          dropDownMajorMuscleNameSelected={dropDownMajorMuscleNameSelected}
          dialogState={dialogState}
          dropDownPushPullSelected={dropDownPushPullSelected}

          setDropDownPushPullSelected={setDropDownPushPullSelected}
          setDialogState={SetDialogState}
          setExerciseState={setExerciseState}
          setMajorMuscleValues={setMajorMuscleValues}

          cancelDialog={cancelDialog}
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
            handleCreate: renderExerciseDialogForCreate,
            filteredKeyword: exerciseState.filteredExerciseKeyword,
            handleFilterExercises: handleFilterExercies
          }}>
            <ScheduledItemContext.Provider value={{
              majorSet: scheduledItemState.filteredScheduledItems,
              handleSelected: renderScheduledItemDialogForViewing,
              handleCreate: renderScheduledItemDialogForCreate,
              handleFilterScheduledItem: handleFilterScheduledItem,
              filteredKeyword: scheduledItemState.filteredScheduledItemKeyword,
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
                    { headerTitle: dialogState.planHeader }}
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
