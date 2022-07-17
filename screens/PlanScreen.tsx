import { Text, TouchableOpacity, View } from 'react-native';
import React, { useContext } from 'react';
import Colors from '../constants/Colors';
import { Agenda, AgendaEntry } from 'react-native-calendars';
import { MajorSetContext } from '../App';
import { MajorSet } from '../types';
export function PlanScreen() {
  const context = useContext(MajorSetContext);
  const majorSet: MajorSet[] = context.majorSet;
  console.log("----");
  console.log(majorSet);
  const a: { [key: string]: AgendaEntry[] } = {}
  if (majorSet.length > 0)
    majorSet.forEach(ms => {
      a[ms.date.dateString] = [{ name: ms.id.toString(), height: 0, day: "dummy" }];
    })
    console.log("plan screen major set:")
    console.log(a)
  const handleCreate: Function = context.handleCreate;
  const handleSelected: Function = context.handleSelected;
  return (
    <View style={{ flexDirection: "column", flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
      <Agenda items={a} style={{ width: '100%', marginBottom: "-10%" }}
        hideKnob={false} showClosingKnob={true} renderEmptyDate={() => {
          return (
            <View >
              <Text>
                This is a empty date. Start adding your sets with the blue plus button on the bottom right corner.
              </Text>
            </View>);
        }}
        renderEmptyData={() => {
          return (
            <View>
              <Text>There is no plan made for today yet.</Text>
            </View>);
        }}
        renderDay={(date, item) => {
          console.log("render day")
          console.log(date);
          console.log(item);
          if(item===undefined)  return(<View></View>);

           let id = Number(item.name);
           let set: MajorSet = majorSet.filter((element, index, array) => {
             return element.id == id;
           })[0];
           return (
             <TouchableOpacity onPress={() => { handleSelected(set) }}>
               <Text>{set.id + " "+set.exercise.name}</Text>
               <Text>{set.sets}x{set.reps} {set.weight}kg</Text>
               <Text>{set.percent_complete}% completed</Text>
             </TouchableOpacity>
             // <View/>
           );
        }}
        renderKnob={() => { return <View /> }}

        renderItem={(reservation, isFirst) => {
          console.log("renderKnob");
  return (<View></View>);
        }}


      />
      <TouchableOpacity
        style={{
          borderRadius: 45,
          backgroundColor: Colors.light.tint,
          height: 60, width: 60,
          bottom: '2%',
          start: '80%'
        }}
        onPress={() => { handleCreate() }}
      >
        <View style={{
          backgroundColor: "white", height: 40, width: 5,
          start: "45%", top: "17%"
        }}></View>
        <View style={{
          backgroundColor: "white", height: 5, width: 40,
          start: "15%", bottom: "20%"
        }}></View>
      </TouchableOpacity>
    </View>
  );
}