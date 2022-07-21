import { Modal, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import React, { useContext } from 'react';
import Colors from '../constants/Colors';
import { Agenda, AgendaEntry, DateData } from 'react-native-calendars';
import { MajorSetContext } from '../App';
import { MajorSet } from '../types';
import Toast from 'react-native-simple-toast';
import Layout from '../constants/Layout';
export function PlanScreen() {
  const context = useContext(MajorSetContext);
  const majorSet: MajorSet[] = context.majorSet;
  const a: { [key: string]: AgendaEntry[] } = {}
  if (majorSet.length > 0)
    majorSet.forEach(ms => {
      if (a[ms.date.dateString] == undefined) a[ms.date.dateString] = [{ name: ms.id.toString(), height: 0, day: "" }];
      else a[ms.date.dateString].push({ name: ms.id.toString(), height: 0, day: "" })
    })
  const handleCreate: Function = context.handleCreate;
  const handleSelected: Function = context.handleSelected;
  return (
    <View style={{
      flexDirection: "column", flex: 1,
      justifyContent: 'flex-end', display: "flex"
    }}>
      <Agenda items={a} 
      initialNumToRender={10}
      style={{
        width: '100%',
        transform: [{ rotateX: "180deg" }]
      }}
        // headerStyle={}
        // calendarStyle={{transform:[{rotateX:"180deg"}]}}
        contentContainerStyle={{ margin: Layout.defaultMargin }}
        staticHeader={false}
        hideKnob={false} showClosingKnob={true} renderEmptyDate={() => {
          return (
            <View style={styles.listStyle}>
              <Text>
                This is a empty date. Start adding your sets with the blue plus button on the bottom right corner.
              </Text>
            </View>);
        }}
        renderEmptyData={() => {
          return (
            <View style={styles.listStyle}>
              <Text>There is no plan made for today yet.</Text>
            </View>);
        }}
        renderDay={(date: DateData, _) => {
          return (<View style={{ backgroundColor: "red" }}></View>);
        }}

        renderItem={(item, isFirst) => {
          if (item === undefined) return (<View><Text></Text></View>);
          let header;
          let id = Number(item.name);
          let set: MajorSet | undefined = majorSet.find(element => {
            return element.id == id;
          });
          if (set == undefined) {
            Toast.show("Error, there is a major set with undefined exercise");
            return (<View><Text>1</Text></View>);
          }
          else if (set.exercise == undefined) {
            Toast.show("Error, there is a major set with undefined exercise");
            return (<View><Text>2</Text></View>);
          }
          if (isFirst)
            header = (<View><Text style={{
              fontSize: Layout.defaultFontSize * 1.5,
              color: Colors.light.tint,
              marginTop: Layout.defaultMargin
            }}>{set.date.day + "/" + set.date.month}</Text></View>);
          // console.log(set.exercise.name);
          let labelToShow =set.id+ set.exercise.name + " \n" +
            +set.sets + "x" + set.reps + " " +
            set.weight + "kg "
            + ((set.duration_in_seconds != 0) ? set.duration_in_seconds + " seconds " : "") +
            +set.percent_complete + "%"
          return (
            <View style={styles.listStyle}>
              {header}
              <TouchableOpacity style={{
              }} onPress={() => { handleSelected(set) }}>
                <Text style={{fontSize:Layout.defaultFontSize}}>{labelToShow}</Text>
              </TouchableOpacity></View>
          );
        }}


      />

      <TouchableOpacity
        style={{
          borderRadius: 45,
          backgroundColor: Colors.light.tint,
          height: 60, width: 60,
          bottom: '25%',
          start: '80%'
          , marginBottom: "-20%"

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
  const styles = StyleSheet.create({
    listStyle:{
    width: "100%", transform: [{ rotateX: "180deg" }],
              marginHorizontal: Layout.defaultMargin,
              marginTop: Layout.defaultMargin*2
     
    }
  });