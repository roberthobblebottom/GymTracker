/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DateData } from 'react-native-calendars';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}
declare var Blob: {
  prototype: Blob;
  new (name:string,description:string,imagesJson:string): Blob;
}
export {Blob};
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
export enum PushPullEnum {Push="Push",Pull="Pull"}
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
  name:string,
  notes:string,
  imageJson:string
}

export type Emm = {
  id:number,
  exercise_name:string,
  major_muscle_name:string
}