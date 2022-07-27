import {
  Modal, View, Text, Button,
  TouchableOpacity, TextInput, Pressable
} from 'react-native'
import 'react-native-gesture-handler'
import React, { } from 'react'
import Toast from 'react-native-simple-toast'
import Colors from './constants/Colors'
import Layout from './constants/Layout'
import { Calendar } from 'react-native-calendars'
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker'
import _default from 'babel-plugin-transform-typescript-metadata'
import { bases, styles } from './styles'
import { ButtonSet } from './ButtonSet'
import { Exercise, ScheduledItem } from './types'
export function ScheduleDialog(props: any) {
  //variables
  const isPlanDialogVisible = props.isPlanDialogVisible
  const isDropDownOpen = props.isDropDownOpen
  const exerciseState = props.exerciseState
  const dropDownExerciseNameSelected = props.dropDownExerciseNameSelected
  const aScheduledItem: ScheduledItem = props.aScheduledItem
  const dialogState = props.dialogState;
  const isCalendarDialogVisible = props.isCalendarDialogVisible
  const currentDate = props.currentDate
  const cancelDialog = props.cancelDialog

  const aExercise: Exercise = props.exerciseState.aExercise

  const minutes = Math.floor(aScheduledItem.duration_in_seconds / 60)
  const seconds = aScheduledItem.duration_in_seconds % 60

  //dispatchers
  const setPlanDialogVisibility: Function = props.setPlanDialogVisibility
  const setAScheduledItem: Function = props.setAScheduledItem
  const setDropDownOpenOrNot = props.setDropDownOpenOrNot
  const setDropDownExerciseNameSelected = props.setDropDownExerciseNameSelected
  const setCurrentDate: Function = props.setCurrentDate
  const setCalendarDialogVisibility: Function = props.setCalendarDialogVisibility
  //functions
  const deleteScheduledItemConfirmation: Function = props.deleteScheduledItemConfirmation
  const renderScheduledItemDialogForEdit: Function = props.renderScheduledItemDialogForEdit
  const createScheduledItem: Function = props.createScheduledItem
  const updateScheduledItem: Function = props.updateScheduledItem
  const renderScheduledItemDialogForViewing: Function = props.renderScheduledItemDialogForViewing
  const renderScheduledItemDialogForDuplication: Function = props.renderScheduledItemDialogForDuplication
  let textInputStyle, numberInputStyle, buttonStyle
  if (dialogState.isEditable) {
    textInputStyle = styles.textInputEditable
    numberInputStyle = styles.numberInputEditable
    buttonStyle = styles.changeDateButtonEnabled
  } else {
    textInputStyle = styles.textInputViewOnly
    numberInputStyle = styles.numberInputViewOnly
    buttonStyle = styles.changeDateButtonDisabled
  }
  return (
    <Modal visible={isPlanDialogVisible} animationType="fade" transparent={true}>
      <TouchableOpacity style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }} onPressIn={() => setPlanDialogVisibility(false)}>
        <TouchableOpacity style={{ ...styles.innerTouchableOpacity2 }} activeOpacity={1} onPress={() => setDropDownOpenOrNot(false)}>
          <Text style={{ fontSize: Layout.defaultFontSize, fontWeight: "bold" }}>{dialogState.dialogText}</Text>
          <View style={{ marginLeft: "1%", ...bases.numberCRUD }}>
            <Text style={{ fontSize: Layout.defaultFontSize, marginRight: "1%" }}>
              Exercise:
            </Text>
            <DropDownPicker
              placeholder="Select a exercise"
              open={isDropDownOpen}
              schema={{ label: "name", value: "name" }}
              items={exerciseState.exercises as ItemType<string>[]}
              itemKey="name"
              value={dropDownExerciseNameSelected}
              setOpen={setDropDownOpenOrNot}
              setValue={setDropDownExerciseNameSelected}
              disabled={!dialogState.isEditable}
              dropDownContainerStyle={{
                marginTop: -5, backgroundColor: Colors.light.altBackground,
                borderWidth: 0, width: 200, minHeight: 300, borderRadius: 0
              }}
              selectedItemContainerStyle={{
                backgroundColor: Colors.light.altBackground,
                borderColor: "white"
              }}
              style={{
                justifyContent: "flex-end",
                marginTop: -5, minHeight: 30, paddingVertical: 3,
                backgroundColor: Colors.light.altBackground,
                borderWidth: 0, borderRadius: 0,
                width: "75%"
              }}
              textStyle={{ fontSize: Layout.defaultFontSize }}
              disabledStyle={{ backgroundColor: "white" }}
              searchTextInputStyle={{ borderWidth: 0 }}
              searchable={true}
              closeAfterSelecting={true}
              closeOnBackPressed={true}
            />
          </View>
          <View style={bases.numberCRUD}>
            <Text style={{ fontSize: Layout.defaultFontSize }}
            > Sets: </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-evenly", }}>
              <Pressable style={buttonStyle} disabled={!dialogState.isEditable} onPress={() => {
                aScheduledItem.sets--
                if (aScheduledItem.sets < 0) {
                  aScheduledItem.sets = 0
                  return
                }
                setAScheduledItem(Object.assign({}, aScheduledItem))
              }
              } >
                <Text style={bases.incrementButton}>-</Text>
              </Pressable>
              <TextInput placeholder='sets'
                style={{ ...numberInputStyle, width: 30 }}
                value={aScheduledItem.sets.toString()}
                onChangeText={text => {
                  const sets = Number(text)
                  const s = Object.assign({}, aScheduledItem)
                  if (Number.isNaN(sets)) {
                    Toast.show("Symbol other than numeric ones are not allow.")
                    s.sets = 0
                  } else s.sets = sets
                  setAScheduledItem(s)
                }}
                editable={dialogState.isEditable}
                keyboardType="numeric" />
              <Pressable style={{ ...buttonStyle, marginLeft: 0 }} disabled={!dialogState.isEditable} onPress={() => {
                aScheduledItem.sets++
                setAScheduledItem(Object.assign({}, aScheduledItem))
              }}>
                <Text style={bases.incrementButton}>+</Text>
              </Pressable>
            </View>
          </View>
          <View style={bases.numberCRUD}>
            <Text style={{ fontSize: Layout.defaultFontSize }}
            > Reps: </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-evenly", }}>
              <Pressable style={buttonStyle} disabled={!dialogState.isEditable} onPress={() => {
                aScheduledItem.reps--
                if (aScheduledItem.reps < 0) {
                  aScheduledItem.reps = 0
                  return
                }
                setAScheduledItem(Object.assign({}, aScheduledItem))
              }
              } >
                <Text style={bases.incrementButton}>-</Text></Pressable>
              <TextInput placeholder='reps'
                style={{ ...numberInputStyle, width: 30 }}
                value={aScheduledItem.reps.toString()}
                onChangeText={text => {
                  const rep = Number(text)
                  const s = Object.assign({}, aScheduledItem)
                  if (Number.isNaN(rep)) {
                    Toast.show("Symbols other than numeric ones are not allow.")
                    s.reps = 0
                  } else s.reps = rep
                  setAScheduledItem(s)
                }}
                editable={dialogState.isEditable}
                keyboardType="numeric" />

              <Pressable style={{ ...buttonStyle, marginLeft: 0 }} disabled={!dialogState.isEditable} onPress={() => {
                aScheduledItem.reps++
                setAScheduledItem(Object.assign({}, aScheduledItem))
              }} >
                <Text style={bases.incrementButton}>+</Text></Pressable>

            </View>
          </View>
          <View style={bases.numberCRUD}>
            <Text style={{ fontSize: Layout.defaultFontSize }}
            > complete(%): </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-evenly", }}>
              <Pressable style={buttonStyle} disabled={!dialogState.isEditable} onPress={() => {
                aScheduledItem.percent_complete--
                if (aScheduledItem.percent_complete < 0) {
                  aScheduledItem.percent_complete = 0
                  return
                }
                setAScheduledItem(Object.assign({}, aScheduledItem))
              }
              } >
                <Text style={bases.incrementButton}>-</Text>
              </Pressable>
              <TextInput placeholder='percentage complete'
                style={{ ...numberInputStyle, width: 30 }}
                value={aScheduledItem.percent_complete.toString()}
                onChangeText={text => {
                  const p = Number(text)
                  const s = Object.assign({}, aScheduledItem)
                  if (Number.isNaN(p) || p > 100) {
                    Toast.show("Percentage cannot go above 100% and symbols other than numeric ones are not allow.")
                    s.percent_complete = 100
                  }
                  else s.percent_complete = p
                  setAScheduledItem(s)
                }}
                editable={dialogState.isEditable}
                keyboardType="numeric" />
              <Pressable style={{ ...buttonStyle, marginLeft: 0 }} disabled={!dialogState.isEditable} onPress={() => {

                aScheduledItem.percent_complete++
                if (aScheduledItem.percent_complete > 100) {
                  aScheduledItem.percent_complete = 100
                  Toast.show("Percentage cannot go above 100% and symbols other than numeric ones are not allow.")
                }
                setAScheduledItem(Object.assign({}, aScheduledItem))
              }}>
                <Text style={bases.incrementButton}>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={bases.numberCRUD}>
            <Text style={{ fontSize: Layout.defaultFontSize }}
            > Duration  min: </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-evenly", }}>
              <Pressable style={buttonStyle} disabled={!dialogState.isEditable} onPress={() => {

                const a = aScheduledItem.duration_in_seconds - 60;
                if (a < 0) {
                  setAScheduledItem({ ...aScheduledItem, duration_in_seconds: 0 });
                  Toast.show("minutes cannot be negative")
                  return
                }
                else setAScheduledItem({ ...aScheduledItem, duration_in_seconds: a });
              }
              } >
                <Text style={bases.incrementButton}>-</Text>
              </Pressable>
              <TextInput placeholder='Minutes'
                style={{ ...numberInputStyle, width: 30 }}
                value={minutes.toString()}
                onChangeText={text => {
                  const min = Number(text)
                  if (isNaN(min))
                    Toast.show("Minutes must be a number")
                  else
                    setAScheduledItem({ ...aScheduledItem, duration_in_seconds: aScheduledItem.duration_in_seconds % 60 + min * 60 });
                }}
                editable={dialogState.isEditable}
                keyboardType="numeric" />
              <Pressable style={{ ...buttonStyle, marginLeft: 0 }} disabled={!dialogState.isEditable} onPress={() => {
                setAScheduledItem({ ...aScheduledItem, duration_in_seconds: aScheduledItem.duration_in_seconds + 60 });
              }}>
                <Text style={bases.incrementButton}>+</Text>
              </Pressable>

            </View>
          </View>
          <View style={bases.numberCRUD}>
            <Text style={{ fontSize: Layout.defaultFontSize }}
            > sec: </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-evenly", }}>
              <Pressable style={buttonStyle} disabled={!dialogState.isEditable} onPress={() => {
                const a = aScheduledItem.duration_in_seconds - 1;
                console.log(a)
                if (a < 0) {
                  setAScheduledItem({ ...aScheduledItem, duration_in_seconds: 0 });
                  Toast.show("Seconds cannot be negative")
                }
                else setAScheduledItem({ ...aScheduledItem, duration_in_seconds: a });
              }
              } >
                <Text style={bases.incrementButton}>-</Text>
              </Pressable>

              <TextInput placeholder='seconds'
                style={{ ...numberInputStyle, width: 30 }}
                value={seconds.toString()}
                onChangeText={text => {
                  const seconds = Number(text)
                  if (isNaN(seconds)) {
                    setAScheduledItem({ ...aScheduledItem, duration_in_seconds: 0 });
                    Toast.show("Seconds must be a number")
                    return
                  } else if (seconds > 59) {
                    setAScheduledItem({ ...aScheduledItem, duration_in_seconds: 59 });
                    Toast.show("Seconds cannot be 60 or more.");
                    return
                  }
                  const totalSec = minutes + seconds;
                  const item = Object.assign({}, aScheduledItem)
                  item.duration_in_seconds = totalSec
                  setAScheduledItem(item);
                }}
                editable={dialogState.isEditable}
                keyboardType="numeric" />
              <Pressable style={{ ...buttonStyle, marginLeft: 0 }} disabled={!dialogState.isEditable} onPress={() => {
                setAScheduledItem({ ...aScheduledItem, duration_in_seconds: aScheduledItem.duration_in_seconds + 1 });
              }}>
                <Text style={bases.incrementButton}>+</Text>
              </Pressable>

            </View>
          </View>
          <View style={bases.numberCRUD}>
            <Text style={{ fontSize: Layout.defaultFontSize }}
            > Weight (kg): </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-evenly", }}>
              <Pressable style={buttonStyle} disabled={!dialogState.isEditable} onPress={() => {
                let s = Object.assign({}, aScheduledItem)
                s.weight--
                if (s.weight < 0) {
                  s.weight = 0
                  return
                }
                setAScheduledItem(Object.assign({}, s))
              }
              } >
                <Text style={bases.incrementButton}>-</Text>
              </Pressable>
              <TextInput placeholder='kg'
                style={{ ...numberInputStyle, width: 30 }}
                value={aScheduledItem.weight.toString()}
                onChangeText={text => {
                  const weight = Number(text)
                  const s = Object.assign({}, aScheduledItem)
                  if (Number.isNaN(weight)) {
                    Toast.show("Symbol other than numeric ones are not allow.")
                    s.weight = 0
                  } else s.weight = weight
                  setAScheduledItem(s)

                }}
                editable={dialogState.isEditable}
                keyboardType="numeric" />
              <Pressable style={{ ...buttonStyle, marginLeft: 0 }} disabled={!dialogState.isEditable} onPress={() => {
                aScheduledItem.weight++
                setAScheduledItem(Object.assign({}, aScheduledItem))
              }}>
                <Text style={bases.incrementButton}>+</Text>
              </Pressable>
            </View>
          </View>
          <View style={{ flexDirection: "row", marginTop: 20, display: 'flex', justifyContent: "space-between" }}>
            <Text style={{ fontSize: Layout.defaultFontSize }}
            > notes: </Text>
            <TextInput placeholder='notes'
              style={{ ...textInputStyle, flexGrow: 1 }}
              value={aScheduledItem.notes.toString()}
              onChangeText={text => {
                const s = Object.assign({}, aScheduledItem)
                s.notes = text
                setAScheduledItem(s)
              }}
              editable={dialogState.isEditable} />

          </View>



          <View style={{ flexDirection: "row", marginTop: 10, display: 'flex', justifyContent: "space-between" }}>
            <Text style={{ fontSize: Layout.defaultFontSize }}> date: {currentDate.day + "-" + currentDate.month + "-" + currentDate.year}</Text>
            <Pressable
              style={{
                ...buttonStyle,
                paddingVertical: Layout.defaultMargin * 1.5,
              }}
              disabled={!dialogState.isEditable} onPress={() => {
                setCalendarDialogVisibility(true)
              }} >
              <Text style={{
                color: "white", fontWeight: "600", flexDirection: "column", flex: 1,
                marginTop: "-5%",
              }}>CHANGE DATE</Text>
            </Pressable>
            <Modal visible={isCalendarDialogVisible} animationType="fade" transparent={true} >
              <TouchableOpacity style={{ flex: 1, display: "flex", justifyContent: "flex-end" }} onPressIn={() => setCalendarDialogVisibility(false)}>
                <TouchableOpacity style={styles.innerTouchableOpacity2}
                  onPress={() => { }}
                  activeOpacity={1}
                >
                  <Text style={{ fontSize: Layout.defaultFontSize, fontWeight: "bold" }} >Select a date</Text>
                  <Calendar
                    initialDate={currentDate.dateString}
                    onDayPress={day => {
                      const s = Object.assign({}, aScheduledItem)
                      s.date = day
                      setCurrentDate(day)
                      setAScheduledItem(s)
                      setCalendarDialogVisibility(false)
                    }} />
                  <Button title='Cancel' onPress={() => setCalendarDialogVisibility(false)} />
                </TouchableOpacity>
              </TouchableOpacity>
            </Modal>
          </View>
          <ButtonSet
            dialogText={dialogState.dialogText}
            cancelDialog={cancelDialog}
            aExercise={aExercise}
            aScheduledItem={aScheduledItem}
            deleteScheduledItemConfirmation={deleteScheduledItemConfirmation}
            renderScheduledItemDialogForEdit={renderScheduledItemDialogForEdit}
            createScheduledItem={createScheduledItem}
            updateScheduledItem={updateScheduledItem}
            renderScheduledItemDialogForViewing={renderScheduledItemDialogForViewing}
            renderScheduledItemDialogForDuplication={renderScheduledItemDialogForDuplication}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>


  )
}