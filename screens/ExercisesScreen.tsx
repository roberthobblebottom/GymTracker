import React from "react";
import { FlatList, Text, View, TouchableOpacity } from 'react-native';
import { ExerciseScreenContext } from '../App';
import { useContext } from 'react';
import layoutConstants from '../constants/Layout';
import { Exercise } from "../types";
import Layout from "../constants/Layout";
import Colors from "../constants/Colors";
import { TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../constants/styles";

function ExercisesScreen() {
  let c = useContext(ExerciseScreenContext);
  let filteredExercises: Exercise[] = c.contextProps.exerciseState.filteredExercises;
  let filteredKeyword: string = c.contextProps.exerciseState.filteredExerciseKeyword;
  let handleSelected: Function = c.contextProps.renderExerciseDialogForViewing;
  let handleShowCreate: Function = c.contextProps.renderExerciseDialogForCreate;
  let handleFilterExercises: Function = c.contextProps.handleFilterExercises;
  return (
    <View style={{flexDirection: "column", flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
      <FlatList
        style={{ width: '100%'  ,transform:[{rotateX:"180deg"}],}}
        data={filteredExercises}
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
        style={styles.filterExercisesTextInput}
        placeholder="Type here to filter exercises..."
        onChange={text => handleFilterExercises(text.nativeEvent.text)}
        value={filteredKeyword}
      />
      <View style={{bottom:20,end:20,position:'absolute'}}>

      <TouchableOpacity
        style={{
          ...styles.planScreenPressable,
          backgroundColor: Colors.light.tint,
        
        }}
        onPress={() => handleShowCreate()}
      >
        <Ionicons style={{bottom:"-5%",right:"-10%"}} name="add-outline" size={Layout.defaultMargin+40} color="white"/>
      </TouchableOpacity>
      </View>
    </View>
  );
}

export { ExercisesScreen };