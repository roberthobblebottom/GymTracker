import React from "react";
import { FlatList, Text, View, TouchableOpacity } from 'react-native';
import { ExerciseScreenContext } from '../App';
import { useContext } from 'react';
import layoutConstants from '../constants/Layout';
import { Exercise } from "../types";
import Layout from "../constants/Layout";
import Colors from "../constants/Colors";
import { TextInput } from "react-native";

function ExercisesScreen() {
  let c = useContext(ExerciseScreenContext);
  let exercises: Exercise[] = c.exercises;
  let handleSelected: Function = c.handleSelected;
  let handleShowCreate: Function = c.handleCreate;
  let filteredKeyword: string = c.filteredKeyword;
  let filteredExercises: Function = c.handleFilterExercises;
  return (
    <View style={{flexDirection: "column", flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
      <FlatList
        style={{ width: '100%'  ,transform:[{rotateX:"180deg"}],}}
        data={exercises}
        initialNumToRender={15}
        renderItem={
          ({ item}) =>
            <TouchableOpacity style={{
              alignItems: "flex-start",
              padding: layoutConstants.defaultMargin,
            }}
              onPress={() => handleSelected(item)}
            >
              <Text style={{  transform:[{rotateX:"180deg"}],fontSize: layoutConstants.defaultFontSize }}>
                {item.name}
              </Text >
            </TouchableOpacity>
        }
      />
      <TextInput
        style={{
          width: "100%",
          padding: layoutConstants.defaultMargin,
          fontSize: Layout.defaultFontSize,
          borderTopWidth: 2,
          borderTopColor: "white"
        }}
        placeholder="Type here to filter exercises..."
        onChange={text => filteredExercises(text.nativeEvent.text)}
        value={filteredKeyword}
      />
      <TouchableOpacity
        style={{
          borderRadius: 45,
          backgroundColor: Colors.light.tint,
          height: 60, width: 60,
          marginBottom: -60,
          bottom: "12%",
          start: '80%'
        }}
        onPress={() => handleShowCreate()}
      >
        <View style={{ backgroundColor: "white", height: 40, width: 5, start: "45%", top: "17%" }}></View>
        <View style={{ backgroundColor: "white", height: 5, width: 40, start: "15%", bottom: "20%" }}></View>
      </TouchableOpacity>
    </View>
  );
}

export { ExercisesScreen };