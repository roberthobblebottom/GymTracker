import React from "react";
import { FlatList, Text, View, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { ExerciseScreenContext } from '../App';
import { useContext } from 'react';
import layoutConstants from '../constants/Layout';
import { Exercise } from "../types";

function ExercisesScreen() {
let c = useContext(ExerciseScreenContext);
let exercises:Exercise[] = c.exercises;
let handleExerciseEvent:Function = c.deleteFunc; 
  return (
    <View style={{ flex: 2, alignItems: 'flex-start', justifyContent: 'center' }}>
      <FlatList
        style={{ width: '100%' }}
        data={exercises}
        renderItem={
          ({ item, index, separators }) =>
            <TouchableOpacity style={{
              alignItems: "flex-start",
              padding: layoutConstants.defaultMargin,
            }}
              onPress={(event: GestureResponderEvent) => {
                handleExerciseEvent(item);
              }}
            >
              <Text style={{ fontSize: layoutConstants.defaultFontSize }}>
                {item.name}
              </Text >
            </TouchableOpacity>
        }
      />
    </View>
  );
}

export { ExercisesScreen };