import React from "react";
import { FlatList, Text, View, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { ExerciseScreenContext } from '../App';
import { useContext } from 'react';
import layoutConstants from '../constants/Layout';
import { Exercise } from "../types";
import Layout from "../constants/Layout";
import Colors from "../constants/Colors";

function ExercisesScreen() {
  let c = useContext(ExerciseScreenContext);
  let exercises: Exercise[] = c.exercises;
  let handleSelected: Function = c.handleSelected;
  let handleCreate: Function = c.handleCreate;
  return (
    <View style={{ flexDirection: "column", flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
      <FlatList
        style={{ width: '100%', marginBottom: -60 }}
        data={exercises}
        initialNumToRender={15}
        renderItem={
          ({ item, index, separators }) =>
            <TouchableOpacity style={{
              alignItems: "flex-start",
              padding: layoutConstants.defaultMargin,
            }}
              onPress={(event: GestureResponderEvent) => handleSelected(item)}
            >
              <Text style={{ fontSize: layoutConstants.defaultFontSize }}>
                {item.name}
              </Text >
            </TouchableOpacity>
        }
      />
      <TouchableOpacity
        style={{
          borderRadius: 45,
          backgroundColor: Colors.light.tint,
          height: 60, width: 60,
          bottom: '2%'
          , start: '80%'
        }}
        onPress={() => {
          handleCreate()
        }}
      >
        <View style={{ backgroundColor: "white", height: 40, width: 5, start: "45%", top: "17%" }}></View>
        <View style={{ backgroundColor: "white", height: 5, width: 40, start: "15%", bottom: "20%" }}></View>
      </TouchableOpacity>
    </View>
  );
}

export { ExercisesScreen };