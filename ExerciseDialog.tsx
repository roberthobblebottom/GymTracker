import {
    Modal, View, Text, TouchableOpacity, TextInput
} from 'react-native'
import 'react-native-gesture-handler'
import React, { } from 'react'
import Colors from './constants/Colors'
import Layout from './constants/Layout'
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker'
import _default from 'babel-plugin-transform-typescript-metadata'
import { styles } from './App'
import { Exercise, PushPullEnum } from './types'
import { ButtonSet } from './ButtonSet'
export function ExerciseDialog(props: any) {
    const dialogText = props.dialogText
    const isDropDownOpen = props.isDropDownOpen
    const isEditable = props.isEditable
    const exerciseState = props.exerciseState;
    const pushPullDropDownValue = props.pushPullDropDownValue
    const majorMuscles = props.majorMuscles
    const openPushPullDropDown = props.openPushPullDropDown
    const dropDownMajorMuscleNameSelected = props.dropDownMajorMuscleNameSelected
    const isExDialogVisible = props.isExDialogVisible
    const aScheduledItem = props.aScheduledItem

    // const setAExercise = props.setAExercise
    const setExerciseState:Function = props.setExerciseState;
    const setExDialogVisibility = props.setExDialogVisibility
    const setDropDownOpenOrNot = props.setDropDownOpenOrNot
    const setPushPullDropDownValue = props.setPushPullDropDownValue
    const setDropDownMajorMuscleNameSelected = props.setDropDronMajorMuscleNameSelected
    const setOpenPushPullDropDown = props.setOpenPushPullDropDown
    const cancelDialog = props.cancelDialog
    const deleteExerciseConfirmation = props.deleteExerciseConfirmation
    const renderExerciseDialogForEdit = props.renderExerciseDialogForEdit
    const createExercise = props.createExercise
    const updateExercise = props.updateExercise
    const renderExerciseDialogForViewing = props.renderExerciseDialogForViewing

    const setAExercise = (e:Exercise) => setExerciseState({...exerciseState,aExercise:e})
    const aExercise = exerciseState.aExercise;
    let textInputStyle, numberInputStyle, buttonStyle
    if (isEditable) {
        textInputStyle = styles.textInputEditable
        numberInputStyle = styles.numberInputEditable
        buttonStyle = styles.changeDateButtonEnabled
    } else {
        textInputStyle = styles.textInputViewOnly
        numberInputStyle = styles.numberInputViewOnly
        buttonStyle = styles.changeDateButtonDisabled
    }
    return (
        <Modal visible={isExDialogVisible} animationType="fade" transparent={true}>
            <TouchableOpacity style={{ flex: 1, display: "flex", justifyContent: "flex-end" }} onPressIn={() => setExDialogVisibility(false)}>
                <TouchableOpacity style={{ ...styles.innerTouchableOpacity }}
                    onPress={() => { setDropDownOpenOrNot(false) }}
                    activeOpacity={1}
                >
                    <Text style={{ fontSize: Layout.defaultFontSize, fontWeight: "bold" }}>{dialogText}</Text>
                    <View style={{ flexDirection: "row", marginTop: 20 }}>
                        <Text style={{ fontSize: Layout.defaultFontSize }}
                        >Name: </Text>
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
                                }
                                )
                                e.name = formattedText
                                setAExercise(e)
                            }}
                            editable={isEditable} />
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 20 }}>
                        <Text
                            style={{ fontSize: Layout.defaultFontSize }}
                        >Description: </Text>
                        <TextInput style={{ ...textInputStyle, fontSize: Layout.defaultFontSize }}
                            multiline={true} placeholder='Type in exercise description.'
                            value={aExercise.description}
                            onChangeText={text => {
                                let e = Object.assign({}, aExercise)
                                e.description = text
                                setAExercise(e)
                            }}
                            editable={isEditable} />
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 20 }}>
                        <Text
                            style={{ fontSize: Layout.defaultFontSize }}
                        >Push Or Pull: </Text>
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
                            textStyle={{ fontSize: Layout.defaultFontSize, transform: [{ rotateX: "180deg" }] }}
                            searchTextInputStyle={{ borderWidth: 0, zIndex: -1 }}
                            placeholderStyle={{ color: "#9E9E9E" }}
                            items={
                                [
                                    { label: PushPullEnum.Push, value: PushPullEnum.Push },
                                    { label: PushPullEnum.Pull, value: PushPullEnum.Pull }
                                ]
                            }
                            value={pushPullDropDownValue}
                            setValue={setPushPullDropDownValue}
                            open={openPushPullDropDown}
                            setOpen={setOpenPushPullDropDown}
                            disabled={!isEditable}
                            dropDownDirection="TOP"
                            closeOnBackPressed={true}
                        />
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 20 }}>
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
                            textStyle={{ fontSize: Layout.defaultFontSize, transform: [{ rotateX: "180deg" }] }}
                            searchTextInputStyle={{ borderWidth: 0, zIndex: -1 }}
                            placeholderStyle={{ color: "#9E9E9E" }}

                            showBadgeDot={false}
                            schema={{ label: "name", value: "name" }}
                            items={majorMuscles as ItemType<string>[]}
                            value={dropDownMajorMuscleNameSelected}
                            setValue={setDropDownMajorMuscleNameSelected}
                            open={isDropDownOpen}
                            setOpen={setDropDownOpenOrNot}
                            disabled={!isEditable}
                            multiple={true}
                            dropDownDirection="TOP"
                            searchable={true}
                            closeOnBackPressed={true}
                            placeholder='Select Muscle Group(s).'
                            mode="BADGE"
                            extendableBadgeContainer={true}
                            badgeProps={{ disabled: !isEditable }}

                        />
                    </View>
                    <ButtonSet
                        dialogText={dialogText}
                        cancelDialog={cancelDialog}
                        aExercise={aExercise}
                        aScheduledItem={aScheduledItem}
                        deleteExerciseConfirmation={deleteExerciseConfirmation}
                        renderExerciseDialogForEdit={renderExerciseDialogForEdit}
                        createExercise={createExercise}
                        updateExercise={updateExercise}
                        renderExerciseDialogForViewing={renderExerciseDialogForViewing}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    )
}