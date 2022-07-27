import {
    Modal, View, Text, TouchableOpacity, TextInput
} from 'react-native'
import 'react-native-gesture-handler'
import React, { Dispatch } from 'react'
import Colors from '../constants/Colors'
import Layout from '../constants/Layout'
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker'
import _default from 'babel-plugin-transform-typescript-metadata'
import { styles } from '../constants/styles'
import { Exercise, PushPullEnum } from '../types'
import { ButtonSet } from './ButtonSet'
export function ExerciseDialog(props: any) {
    const exerciseState = props.exerciseState;
    const majorMuscles = props.majorMuscles
    const dropDownMajorMuscleNameSelected = props.dropDownMajorMuscleNameSelected
    const aScheduledItem = props.aScheduledItem
    const dialogState = props.dialogState
    const dropDownPushPullSelected = props.dropDownPushPullSelected
    const setDropDownPushPullSelected = props.setDropDownPushPullSelected
    const setExerciseState: Dispatch<any> = props.setExerciseState;
    const setMajorMuscleValues: Dispatch<any> = props.setMajorMuscleValues

    const cancelDialog = props.cancelDialog
    const deleteExerciseConfirmation = props.deleteExerciseConfirmation
    const renderExerciseDialogForEdit = props.renderExerciseDialogForEdit
    const createExercise = props.createExercise
    const updateExercise = props.updateExercise
    const renderExerciseDialogForViewing = props.renderExerciseDialogForViewing
    const SetDialogState = props.setDialogState

    const setAExercise = (e: Exercise) => setExerciseState({ ...exerciseState, aExercise: e })
    const aExercise = exerciseState.aExercise;
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
        <Modal visible={dialogState.isExDialogVisible} animationType="fade" transparent={true}>
            <TouchableOpacity style={styles.overallDialog} onPressIn={() => SetDialogState({ ...dialogState, isExDialogVisible: false })}>
                <TouchableOpacity style={styles.innerTouchableOpacity}
                    onPress={() => { SetDialogState({ ...dialogState, isDropDownOpen: false }) }}
                    activeOpacity={1}
                >
                    <Text style={{ fontSize: Layout.defaultFontSize }}>{dialogState.dialogText}</Text>
                    <View style={styles.dialogRow}>
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
                                })
                                e.name = formattedText
                                setAExercise(e)
                            }}
                            editable={dialogState.isEditable} />
                    </View>
                    <View style={styles.dialogRow}>
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
                            editable={dialogState.isEditable} />
                    </View>
                    <View style={styles.dialogRow}>
                        <Text style={{ fontSize: Layout.defaultFontSize }}>Push Or Pull: </Text>
                        <DropDownPicker
                            style={{
                                width: "100%", minHeight: 30,
                                transform: [{ rotateX: "180deg" }],
                                backgroundColor: Colors.light.altBackground, borderWidth: 0, borderRadius: 0, maxWidth: 100
                            }}
                            disabledStyle={{ borderWidth: 0, backgroundColor: "white" }}
                            dropDownContainerStyle={{
                                transform: [{ rotateX: "180deg" }],
                                backgroundColor: Colors.light.altBackground, borderWidth: 0,
                                borderRadius: 0, minHeight: 500, maxWidth: 100
                            }}
                            textStyle={{ fontSize: Layout.defaultFontSize, transform: [{ rotateX: "180deg" }] }}
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
                            textStyle={{ fontSize: Layout.defaultFontSize, transform: [{ rotateX: "180deg" }] }}
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
                    <ButtonSet
                        dialogText={dialogState.dialogText}
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