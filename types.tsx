/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Dispatch } from 'react';
import { DateData } from 'react-native-calendars';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

export enum PushPullEnum { Push = "Push", Pull = "Pull" }

export type Exercise = {
  name: string,
  description: string,
  imagesJson: string,
  major_muscles: MajorMuscle[] //TODO, uncomment this when the development is ready for it.
  push_or_pull: PushPullEnum
}

export type ScheduledItem = {
  id: number,
  exercise: Exercise,
  reps: number,
  percent_complete: number,
  sets: number,
  duration_in_seconds: number,
  weight: number,
  notes: string,
  date: DateData
}

export type MajorMuscle = {
  name: string,
  notes: string,
  imageJson: string
}

export type Emm = {
  id: number,
  exercise_name: string,
  major_muscle_name: string
}

export type ExerciseState = {
  exercises: Exercise[],
  aExercise: Exercise,
  filteredExercises: Exercise[],
  filteredExerciseKeyword: string,
  oldExerciseName: string
}

export type ScheduledItemState = {
  scheduledItems: ScheduledItem[],
  aScheduledItem: ScheduledItem,
  filteredScheduledItems: ScheduledItem[],
  filteredScheduledItemKeyword: string,
  selectedScheduledItems: ScheduledItem[],
  isMovingScheduledItems:boolean
}

export type DialogState = {

  isExDialogVisible: boolean,
  openPushPullDropDown: boolean,
  dialogText: string,
  isEditable: boolean,
  isCalendarDialogVisible: boolean,
  isDropDownOpen: boolean,
  isPlanDialogVisible: boolean,
  isHistoryDialogVisible: boolean,
  planHeader: string,
  isExerciseHistory: boolean,//false means it is PR History. 
}

export type ContextProps = {
  renderScheduledItemDialogForViewing: Function,
  renderScheduledItemDialogForCreate: Function,
  handleFilterScheduledItem: Function
  handlePlanHeader: Function,
  scheduledItemState: ScheduledItemState,
  setScheduledItemState: Dispatch<ScheduledItemState>,
  exerciseState:ExerciseState,
  setExerciseState:Dispatch<ExerciseState>,
  renderExerciseDialogForViewing: Function,
  renderExerciseDialogForCreate: Function
  handleFilterExercises: Function,
  deleteScheduledItemWithoutStateUpdate:Function,
  commonScheduledItemCRUD:Function,
  createScheduledItem2:Function,
    setDialogState:Function,
dialogState:DialogState
}