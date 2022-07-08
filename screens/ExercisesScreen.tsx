import React from "react";
import { SectionList, Text, View } from 'react-native';
import { exercisesContext } from '../App';
import { useContext } from 'react';
type Exercise = {
  name: string,
  description: string,
  imageJson: string
}

function ExercisesScreen() {

  let p: any = useContext(exercisesContext);
  console.log("exercise screen");
  let exercises = p._W;//if the section list has to be redone, at least this is good
  // console.log(exercises)
  const DATA = [{title:"",data:exercises}]
  // console.log(DATAs)
  return (
    <View style={{ flex: 0, alignItems: 'center', justifyContent: 'center' }}>
      <SectionList
        sections={DATA}
        renderItem={
          ({item}) => (<Text>{item.name}</Text>)
        }

      />
    </View>
  );
} 

export { ExercisesScreen };