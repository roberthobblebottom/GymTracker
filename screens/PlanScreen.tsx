import { Text, TouchableOpacity, View, StyleSheet, TextInput } from 'react-native';
import React, { useContext } from 'react';
import Colors from '../constants/Colors';
import { Agenda, AgendaEntry, DateData } from 'react-native-calendars';
import { ScheduledItemContext, initialDate } from '../App';
import { ScheduledItem } from '../types';
import Toast from 'react-native-simple-toast';
import Layout from '../constants/Layout';
/*
Note:
this.renderWeekDayNames is commented out from line 325 of ./node_modules/react-native-calendars/src/agenda/index.js
due to the fact it is rendering the week day names upside-down.

and shouldUpdateComponent is commented out from ./nodes/react-native-calendars/src/agenda/reservation-list/reservation.js
due to this issue: https://github.com/wix/react-native-calendars/issues/1589#issuecomment-995414073
*/
export function PlanScreen() {
  const context = useContext(ScheduledItemContext);
  const majorSet: ScheduledItem[] = context.majorSet;
  const a: { [key: string]: AgendaEntry[] } = {}

  if (majorSet.length > 0)
    majorSet.forEach(ms => {
      if (ms == undefined) return;
      if (ms.date == initialDate) return;
      if (a[ms.date.dateString] == undefined) a[ms.date.dateString] =
        [{ name: ms.id.toString(), height: 0, day: "" }];
      else a[ms.date.dateString].push({ name: ms.id.toString(), height: 0, day: "" })
    })
  const handleCreate: Function = context.handleCreate;
  const handleSelected: Function = context.handleSelected;
  const fitlerScheduledItem: Function = context.handleFilterScheduledItem;
  const majorSetKeyword: string = context.filteredKeyword;
  const handlePlanHeader: Function = context.handlePlanHeader;
  return (
    <View style={{
      flexDirection: "column", flex: 1,
      justifyContent: 'flex-end', display: "flex"
    }}>
      <Agenda items={a}
        showOnlySelectedDayItems={true}
        initialNumToRender={2}
        style={{
          width: '100%',
          transform: [{ rotateX: "180deg" }]
        }}
        showScrollIndicator={true}
        showClosingKnob={true}
        onDayPress={(date: DateData) =>
          handlePlanHeader(date)
        }
        renderEmptyDate={() => {
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
        renderDay={(date: DateData, item) => {
          if (item === undefined || date === undefined) return (<View><Text></Text></View>);
          let id = Number(item.name);
          let set: ScheduledItem | undefined = majorSet.find(element => {
            return element.id == id;
          });
          if (set == undefined) return (<View></View>);
          let labelToShow = set.id + " " + set.exercise.name + " \n" +
            +set.sets + "x" + set.reps + " " +
            set.weight + "kg "
            + ((set.duration_in_seconds != 0)
              ? Math.floor(set.duration_in_seconds / 60) + " minutes " + set.duration_in_seconds % 60 + " seconds "
              : "") +
            +set.percent_complete + "%"
          let dateString = String(date);
          let dateParts: string[] = dateString.split(" ");
          let dateLabelToShow = dateParts[1] + " " + dateParts[2]
          return (
            <View style={{ ...styles.listStyle, flexDirection: "row" }}>
              <TouchableOpacity style={{
              }} onPress={() => { handleSelected(set) }}>
                <Text style={{ fontSize: Layout.defaultFontSize }}>{labelToShow}</Text>
              </TouchableOpacity>
            </View>
          );
        }}

        renderItem={(item, isFirst) => {
          let header;
          if (item === undefined || isFirst) return (<View><Text></Text></View>);
          let id = Number(item.name);
          let set: ScheduledItem | undefined = majorSet.find(element => {
            return element.id == id;
          });
          if (set == undefined) {
            Toast.show("Error, there is a major set with undefined exercise");
            return (<View></View>);
          }
          else if (set.exercise == undefined) {
            Toast.show("Error, there is a major set with undefined exercise");
            return (<View></View>);
          }
          let labelToShow = set.id + " " + set.exercise.name + " \n" +
            +set.sets + "x" + set.reps + " " +
            set.weight + "kg "
            + ((set.duration_in_seconds != 0)
              ? Math.floor(set.duration_in_seconds / 60) + " minutes " + set.duration_in_seconds % 60 + " seconds "
              : "") +
            +set.percent_complete + "%"
          return (
            <View style={{ ...styles.listStyle }}>
              {/* {header} */}
              <TouchableOpacity style={{
              }} onPress={() => { handleSelected(set) }}>
                <Text style={{ fontSize: Layout.defaultFontSize }}>{labelToShow}</Text>
              </TouchableOpacity>
            </View>
          );
        }}


      />
      <TextInput
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: "100%",
          paddingHorizontal: Layout.defaultMargin,
          paddingBottom: Layout.defaultMargin + 5,
          paddingTop: Layout.defaultMargin - 5,
          fontSize: Layout.defaultFontSize,
          marginBottom: "2%",
          backgroundColor: "white",
        }}
        placeholder="Type here to filter items per day..."
        onChange={text => fitlerScheduledItem(text.nativeEvent.text)}
        value={majorSetKeyword}
      />

      <TouchableOpacity
        style={{
          borderRadius: 45,
          backgroundColor: Colors.light.tint,
          height: 60, width: 60,
          bottom: '25%',
          start: '80%',
          marginBottom: "-20%"

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
  listStyle: {
    width: "100%", transform: [{ rotateX: "180deg" }],
    marginHorizontal: Layout.defaultMargin,
    // marginTop: Layout.defaultMargin * 2

  }
});