import {
    Modal, View, Text, TouchableOpacity, TextInput, Pressable, Button, FlatList
} from 'react-native'
import 'react-native-gesture-handler'
import React, { Dispatch } from 'react'
import Colors from '../constants/Colors'
import Layout from '../constants/Layout'
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker'
import _default from 'babel-plugin-transform-typescript-metadata'
import { bases, styles } from '../constants/styles'
import { DialogState, Exercise, PushPullEnum, ScheduledItem, ScheduledItemState } from '../types'
import { ButtonSet } from './ButtonSet'
import Toast from 'react-native-simple-toast'
import { initialScheduledItem } from '../App'
export function ExerciseDialog(props: any) {
    const exerciseState = props.exerciseState;
    const majorMuscles = props.majorMuscles
    const scheduledItemState: ScheduledItemState = props.scheduledItemState
    const aScheduledItem = scheduledItemState.aScheduledItem
    const dialogState: DialogState = props.dialogState

    const dropDownPushPullSelected = props.dropDownPushPullSelected
    const dropDownMajorMuscleNameSelected = props.dropDownMajorMuscleNameSelected

    const setDropDownPushPullSelected = props.setDropDownPushPullSelected
    const setExerciseState: Dispatch<any> = props.setExerciseState;
    const setMajorMuscleValues: Dispatch<any> = props.setMajorMuscleValues
    const SetDialogState: Dispatch<DialogState> = props.setDialogState  
    const setAExercise = (e: Exercise) => setExerciseState({ ...exerciseState, aExercise: e })

    const buttonsSetProps = props.buttonsSetProps
    const aExercise = exerciseState.aExercise;
    let filteredScheduledItems: ScheduledItem[]
    if (scheduledItemState.scheduledItems === initialScheduledItem)
        filteredScheduledItems = dialogState.isExerciseHistory
            ? scheduledItemState
                .scheduledItems
                .filter(si => si.exercise.name == aExercise.name)
                .sort((a, b) => {
                    if (a.date.year == b.date.year) 
                        if (a.date.month == b.date.month) 
                            return a.date.day - b.date.day
                         else return a.date.month - b.date.month
                     else return a.date.year - b.date.year
                })
            : scheduledItemState
                .scheduledItems
                .filter(si => si.exercise.name == aExercise.name)
                .sort((a, b) => a.weight * a.reps * a.sets - b.weight * b.reps * b.sets)
    else filteredScheduledItems = []
    const header = dialogState.isExerciseHistory
        ? "History"
        : "Personal Records"

    const buttonTitle = dialogState.isExerciseHistory
        ? "change to Personal Records"
        : "change to history"

    let textInputStyle, numberInputStyle, buttonStyle
    if (dialogState.isEditable) {
        textInputStyle = styles.textInputEditable
        numberInputStyle = styles.numberInputEditable
        buttonStyle = styles.changeButtonEnabled
    } else {
        textInputStyle = styles.textInputViewOnly
        numberInputStyle = styles.numberInputViewOnly
        buttonStyle = styles.changeButtonDisabled
    }

    return (
        <Modal visible={dialogState.isExDialogVisible} animationType="fade" transparent={true}>
            <TouchableOpacity style={styles.overallDialog} onPressIn={() => SetDialogState({ ...dialogState, isExDialogVisible: false })}>
                <TouchableOpacity style={styles.innerTouchableOpacity}
                    onPress={() => { SetDialogState({ ...dialogState, isDropDownOpen: false }) }}
                    activeOpacity={1}
                >
                    <Text style={{ fontSize: Layout.defaultFontSize }}>{dialogState.dialogText}</Text>
                    <View style={styles.dialogRow}>
                        <Text style={{ fontSize: Layout.defaultFontSize }}>Name: </Text>
                        <TextInput placeholder='Type in exercise name.'
                            style={textInputStyle}
                            value={aExercise.name}
                            onChangeText={text => {
                                let e = Object.assign({}, aExercise)
                                let parts: string[] = text.split(" ")
                                let formattedText: string = ""
                                parts.forEach(part => {
                                    let formatedWord = part.charAt(0).toUpperCase() + part.slice(1)
                                    formattedText = formattedText + " " + formatedWord
                                })
                                e.name = formattedText
                                setAExercise(e)
                            }}
                            editable={dialogState.isEditable} />
                    </View>
                    <View style={styles.dialogRow}>
                        <Text style={{ fontSize: Layout.defaultFontSize }}>Description: </Text>
                        <TextInput style={{ ...textInputStyle, fontSize: Layout.defaultFontSize }}
                            multiline={true} placeholder='Type in exercise description.'
                            value={aExercise.description}
                            onChangeText={text => {
                                let e = Object.assign({}, aExercise)
                                e.description = text
                                setAExercise(e)
                            }}
                            editable={dialogState.isEditable} />
                    </View>
                    <View style={{...styles.dialogRow}}>
                        {/* <Text style={{ fontSize: Layout.defaultFontSize,alignSelf:'flex-start' }}>Push Or Pull: </Text> */}
                        <DropDownPicker
                            style={{
                              minHeight: 30,
                                transform: [{ rotateX: "180deg" }],
                                backgroundColor: Colors.light.altBackground, borderWidth: 0, borderRadius: 0, 
                            }}
                            disabledStyle={{ borderWidth: 0, backgroundColor: "white" }}
                            dropDownContainerStyle={{
                                alignSelf:'flex-end',
                                transform: [{ rotateX: "180deg" }],
                                backgroundColor: Colors.light.altBackground, borderWidth: 0,
                                borderRadius: 0, minHeight: 500,borderTopWidth:1,borderTopColor:"white"
                            }}

                            textStyle={{ fontSize: Layout.defaultFontSize, transform: [{ rotateX: "180deg" }],textAlign:'right' }}
                            searchTextInputStyle={{ borderWidth: 0, zIndex: -1 }}
                            placeholderStyle={{ color: "#9E9E9E" }}
                            items={[
                                { label: PushPullEnum.Push, value: PushPullEnum.Push },
                                { label: PushPullEnum.Pull, value: PushPullEnum.Pull }
                            ]}
                            value={dropDownPushPullSelected}
                            setValue={setDropDownPushPullSelected}
                            open={dialogState.openPushPullDropDown}
                            setOpen={v => SetDialogState({ ...dialogState, openPushPullDropDown: v })}
                            disabled={!dialogState.isEditable}
                            dropDownDirection="TOP"
                            closeOnBackPressed={true}
                        />
                    </View>
                    <View style={styles.dialogRow}>
                        <DropDownPicker
                            style={{
                                width: "100%", minHeight: 30,
                                transform: [{ rotateX: "180deg" }],
                                backgroundColor: Colors.light.altBackground, borderWidth: 0, borderRadius: 0
                            }}
                            disabledStyle={{ borderWidth: 0, backgroundColor: "white" }}
                            dropDownContainerStyle={{
                                transform: [{ rotateX: "180deg" }],
                                backgroundColor: Colors.light.altBackground, borderWidth: 0,
                                borderRadius: 0, minHeight: 500,
                            }}
                            textStyle={{ fontSize: Layout.defaultFontSize, transform: [{ rotateX: "180deg" }],textAlign:'right' }}
                            searchTextInputStyle={{ borderWidth: 0, zIndex: -1 }}
                            placeholderStyle={{ color: "#9E9E9E" }}
                            showBadgeDot={false}
                            schema={{ label: "name", value: "name" }}
                            items={majorMuscles as ItemType<string>[]}
                            value={dropDownMajorMuscleNameSelected}
                            setValue={setMajorMuscleValues}
                            open={dialogState.isDropDownOpen}
                            setOpen={o => SetDialogState({ ...dialogState, isDropDownOpen: o })}
                            disabled={!dialogState.isEditable}
                            multiple={true}
                            dropDownDirection="TOP"
                            searchable={true}
                            closeOnBackPressed={true}
                            placeholder='Select Muscle Group(s).'
                            mode="BADGE"
                            extendableBadgeContainer={true}
                            badgeProps={{ disabled: !dialogState.isEditable }}
                        />
                    </View>

                    <Modal visible={dialogState.isHistoryDialogVisible} animationType="fade" transparent={true}>
                        <TouchableOpacity style={styles.overallDialog} onPressIn={() => SetDialogState({ ...dialogState, isHistoryDialogVisible: false })}>
                            <TouchableOpacity style={styles.innerTouchableOpacity}
                                onPress={() => { }}
                                activeOpacity={1}
                            >
                                <Text style={{ fontSize: Layout.defaultFontSize }}>{header}</Text>
                                <FlatList
                                    data={filteredScheduledItems}
                                    renderItem={(item) => {
                                        if (item === undefined) return (<View><Text></Text></View>);
                                        let id = Number(item.item.id);
                                        let set: ScheduledItem | undefined = scheduledItemState.scheduledItems.find(element => {
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
                                            + " " + set.date.day + "-" + set.date.month + "-" + set.date.year
                                        return (
                                            <Text style={{ fontSize: Layout.defaultFontSize, marginTop: Layout.defaultMargin }}>{labelToShow}</Text>
                                        );
                                    }}
                                />
                                <View style={bases.numberCRUD}>
                                    <Button onPress={() => SetDialogState({ ...dialogState, isExerciseHistory: !dialogState.isExerciseHistory })} title={buttonTitle} />
                                    <Button onPress={() => SetDialogState({ ...dialogState, isHistoryDialogVisible: false })} title="cancel"></Button>
                                </View>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </Modal>
                    <ButtonSet
                        dialogText={dialogState.dialogText}
                        aExercise={aExercise}
                        aScheduledItem={aScheduledItem}
                        buttonsSetProps={buttonsSetProps}
                        dialogState={dialogState}
                        SetDialogState={SetDialogState}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    )
}