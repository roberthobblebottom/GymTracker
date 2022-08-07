import { ExerciseState, PushPullEnum, ScheduledItem, ScheduledItemState, MajorMuscle, Emm, ContextProps } from "../types";

const d: Date = new Date()
//initial constant values
export const initialDate = { year: 0, month: 0, day: 0, timestamp: 0, dateString: "" };
export const initialExerciseState: ExerciseState = {
  exercises: [{ name: "", description: "", imagesJson: "", major_muscles: [], push_or_pull: PushPullEnum.Push }],
  aExercise: { name: "", description: "", imagesJson: "", major_muscles: [], push_or_pull: PushPullEnum.Push },
  filteredExercises: [{ name: "", description: "", imagesJson: "", major_muscles: [], push_or_pull: PushPullEnum.Push }],
  filteredExerciseKeyword: "",
  oldExerciseName: "",
  majorMuscles: []
};
export const initialScheduledItem: ScheduledItem[] = [{
  id: 0, exercise: initialExerciseState.aExercise,
  reps: 1, percent_complete: 0, sets: 1,
  duration_in_seconds: 0, weight: 1, notes: "", date: initialDate
}];
export const initialScheduledItemState: ScheduledItemState = {
  scheduledItems: initialScheduledItem,
  aScheduledItem: initialScheduledItem[0],
  filteredScheduledItems: initialScheduledItem,
  filteredScheduledItemKeyword: "",
  selectedScheduledItems: [],
  isMovingScheduledItems: false
}
export const initialMajorMuscles: MajorMuscle[] = [{ name: "", notes: "", imageJson: "" }];
export const initialEmm: Emm[] = [{ id: 9999, exercise_name: "", major_muscle_name: "" }];
export const initialDialogState = {
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
export const initalContextProps: ContextProps = {
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