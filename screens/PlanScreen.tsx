import { Text, TouchableOpacity, View, StyleSheet, TextInput, Modal, Pressable, Alert } from 'react-native';
import React, { Dispatch, useContext } from 'react';
import Colors from '../constants/Colors';
import { Agenda, AgendaEntry, DateData } from 'react-native-calendars';
import { ScheduledItemContext, initialDate, initialScheduledItem } from '../App';
import { ScheduledItem, ScheduledItemState } from '../types';
import Toast from 'react-native-simple-toast';
import Layout from '../constants/Layout';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
/*
Note:
this.renderWeekDayNames is commented out from line 325 of ./node_modules/react-native-calendars/src/agenda/index.js
due to the fact it is rendering the week day names upside-down.

and shouldUpdateComponent is commented out from ./nodes/react-native-calendars/src/agenda/reservation-list/reservation.js
due to this issue: https://github.com/wix/react-native-calendars/issues/1589#issuecomment-995414073
*/
export function PlanScreen() {
  const context = useContext(ScheduledItemContext);
  const scheduledItemState: ScheduledItemState = context.contextProps.scheduledItemState
  const setScheduledItemState: Dispatch<ScheduledItemState> = context.contextProps.setScheduledItemState
  const contextProps = context.contextProps
  const scheduledItems: ScheduledItem[] = scheduledItemState.scheduledItems;
  const majorSetKeyword: string = scheduledItemState.filteredScheduledItemKeyword;
  const a: { [key: string]: AgendaEntry[] } = {}
  if (scheduledItems.length > 0)
    scheduledItems.forEach(ms => {
      if (ms == undefined) return;
      if (ms.date == initialDate) return;
      if (a[ms.date.dateString] == undefined) a[ms.date.dateString] =
        [{ name: ms.id.toString(), height: 0, day: "" }];
      else a[ms.date.dateString].push({ name: ms.id.toString(), height: 0, day: "" })
    })
  const selectedScheduledItems: ScheduledItem[] = scheduledItemState.selectedScheduledItems
console.log(selectedScheduledItems)
  const handleCreate: Function = contextProps.renderScheduledItemDialogForCreate;
  const handleSelected: Function = contextProps.renderScheduledItemDialogForViewing;
  const fitlerScheduledItem: Function = contextProps.handleFilterScheduledItem;
  const handlePlanHeader: Function = contextProps.handlePlanHeader;
  const deleteScheduledItemsWithoutStateUpdate: Function = contextProps.deleteScheduledItemWithoutStateUpdate;
  const commonScheduledItemCRUD: Function = contextProps.commonScheduledItemCRUD
  contextProps.commonScheduledItemCRUD
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
          let set: ScheduledItem | undefined = scheduledItems.find(element => {
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
          let bgc;
          if (selectedScheduledItems.indexOf(set) > -1) {
            bgc = { backgroundColor: "gray" }
          } else {

            bgc = {}
          }
          return (
            <View style={{ ...styles.listStyle, ...bgc }}>
              <TouchableOpacity style={{}}
                onPress={() => { handleSelected(set) }}
                onLongPress={() => {
                  console.log("onlongpress")
                  let ssi = scheduledItemState.selectedScheduledItems.slice();
                  if (ssi.find(e => e.id == set?.id) == undefined)
                    ssi.push(set!)
                  else
                    ssi.splice(ssi.indexOf(set!), 1)
                  setScheduledItemState({ ...scheduledItemState, selectedScheduledItems: ssi })
                }}
              >
                <Text style={{ fontSize: Layout.defaultFontSize }}>{labelToShow}</Text>
              </TouchableOpacity>
            </View>
          );
        }}

        renderItem={(item, isFirst) => {
          if (item === undefined || isFirst) return (<View><Text></Text></View>);
          let id = Number(item.name);
          let set: ScheduledItem | undefined = scheduledItems.find(element => {
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

          let bgc
          if (selectedScheduledItems.indexOf(set) > -1)
            bgc = { backgroundColor: "gray" }
          else
            bgc = {}
          let labelToShow = set.id + " " + set.exercise.name + " \n" +
            +set.sets + "x" + set.reps + " " +
            set.weight + "kg "
            + ((set.duration_in_seconds != 0)
              ? Math.floor(set.duration_in_seconds / 60) + " minutes " + set.duration_in_seconds % 60 + " seconds "
              : "") +
            +set.percent_complete + "%"
          return (
            <View style={{ ...styles.listStyle, ...bgc }}>
              {/* {header} */}
              <TouchableOpacity
                style={{
                }}
                onLongPress={() => {
                  let ssi = selectedScheduledItems.slice();
                  //  ssi.forEach(s=>console.log(s.id+s.exercise.name)) 
                  if (ssi.find(e => e.id == set!.id) == undefined)
                    ssi.push(set!)
                  else {
                    const i = ssi.indexOf(set!);
                    ssi.splice(i, 1)
                  }
                  setScheduledItemState({ ...scheduledItemState, selectedScheduledItems: ssi })
                }}
                onPress={() => { handleSelected(set) }}>
                <Text style={{ fontSize: Layout.defaultFontSize }}>{labelToShow}</Text>
              </TouchableOpacity>
            </View>
          );
        }}


      />

      <Pressable
        style={{
          borderRadius: 45,
          backgroundColor: "red",
          height: 60, width: 60,
          bottom: '43%',
          start: '80%',
          marginBottom: "-20%",
          display: selectedScheduledItems.length>0? "flex" : "none"
        }}
        onPress={() => {
          Alert.alert("confirmation", "Are you sure you like to delete all selected?", [{
            text: "Yes", onPress: () => {
              selectedScheduledItems.forEach(si => deleteScheduledItemsWithoutStateUpdate(si.id))
              selectedScheduledItems.forEach(si => {
                const i = scheduledItems.indexOf(si)
                scheduledItems.splice(i, 1)
              })
              setScheduledItemState({ ...scheduledItemState, selectedScheduledItems: [] })
              commonScheduledItemCRUD(scheduledItems)
            }
          }, { text: "No", onPress: () => { } }], { cancelable: true })
        }}
      >
        <MaterialCommunityIcons style={{ bottom: "-14%", right: "-17%" }} name="delete" size={Layout.defaultMargin + 30} color="white" />
      </Pressable>


      <Pressable
        style={{
          borderRadius: 45,
          backgroundColor: "red",
          height: 60, width: 60,
          bottom: '30%',
          start: '80%',
          marginBottom: "-20%",
          display: selectedScheduledItems.length>0? "flex" : "none"
        }}
        onPress={() => { setScheduledItemState({ ...scheduledItemState, selectedScheduledItems: [] }) }}
      >
        <MaterialCommunityIcons style={{ bottom: "-14%", right: "-17%" }}
          name="selection-remove"
          size={Layout.defaultMargin + 30}
          color="white" />
      </Pressable>

      < TextInput
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
        <Ionicons style={{ bottom: "-5%", right: "-10%" }} name="add-outline" size={Layout.defaultMargin + 40} color="white" />

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
})