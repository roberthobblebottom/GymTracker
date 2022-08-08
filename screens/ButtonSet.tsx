import {
    View, Pressable, Text
} from 'react-native'
import React, { Dispatch } from 'react'
import _default from 'babel-plugin-transform-typescript-metadata'
import { bases, styles } from '../constants/styles'
import { ButtonSetProps, DialogState } from '../types'
import {
    ExerciseInformationText, CreateExerciseText, EditExerciseText, CreateScheduledItemText,
    ScheduledItemInformation, DuplicateScheduledItemText, EditScheduledItemText
} from '../constants/strings'
export function ButtonSet(props: any) {
    const buttonsSetProps: ButtonSetProps = props.buttonsSetProps
    const aExercise = props.aExercise
    const aScheduledItem = props.aScheduledItem
    const dialogState: DialogState = props.dialogState
    const SetDialogState: Dispatch<DialogState> = props.SetDialogState

    const cancelDialog = buttonsSetProps.cancelDialog
    const deleteExerciseConfirmation = buttonsSetProps.deleteExerciseConfirmation
    const renderExerciseDialogForEdit = buttonsSetProps.renderExerciseDialogForEdit
    const renderExerciseDialogForViewing = buttonsSetProps.renderExerciseDialogForViewing

    const deleteScheduledItemConfirmation =
        buttonsSetProps.deleteScheduledItemConfirmation
    const renderScheduledItemDialogForEdit =
        buttonsSetProps.renderScheduledItemDialogForEdit
    const renderScheduledItemDialogForViewing =
        buttonsSetProps.renderScheduledItemDialogForViewing
    const renderScheduledItemDialogForDuplication =
        buttonsSetProps.renderScheduledItemDialogForDuplication
    const createExercise = buttonsSetProps.createExerciseWithStateUpdate
    const updateExercise = buttonsSetProps.updateExerciseWithStateUpdate
    const createScheduledItemWithStateUpdate =
        buttonsSetProps.createScheduledItemWithStateUpdate
    const updateScheduledItemWithStateUpdate =
        buttonsSetProps.updateScheduledItemWithStateUpdate
    switch (dialogState.dialogText) {
        case ExerciseInformationText:
            return (
                <View style={styles.buttonsRow}>
                    <Pressable style={styles.buttonSet} onPress={() => deleteExerciseConfirmation(aExercise)} >
                        <Text style={styles.buttonFont} >DELETE</Text></Pressable>
                    <Pressable style={styles.buttonSet} onPress={() => { renderExerciseDialogForEdit() }} >
                        <Text style={styles.buttonFont}>EDIT</Text></Pressable>
                    <Pressable style={styles.buttonSet} onPress={
                        () => SetDialogState({
                            ...dialogState,
                            isHistoryDialogVisible: true
                        })} >
                        <Text style={styles.buttonFont}>HISTORY AND PR</Text></Pressable>
                    <Pressable style={styles.buttonSet} onPress={() => cancelDialog()} >
                        <Text style={styles.buttonFont}>CANCEL</Text></Pressable>
                </View>
            )
        case CreateExerciseText:
            return (
                <View style={styles.buttonsRow}>
                    <Pressable style={styles.buttonSet} onPress={() => createExercise()}>
                        <Text style={styles.buttonFont}>SAVE</Text>
                    </Pressable>
                    <Pressable style={styles.buttonSet} onPress={() => cancelDialog()} >
                        <Text style={styles.buttonFont}>CANCEL</Text>
                    </Pressable>
                </View>
            )
        case EditExerciseText:

            return (
                <View style={styles.buttonsRow}>
                    <Pressable style={styles.buttonSet} onPress={() => updateExercise()}>
                        <Text style={styles.buttonFont}>SAVE</Text></Pressable>
                    <Pressable style={styles.buttonSet} onPress={
                        () => renderExerciseDialogForViewing(aExercise)} >
                        <Text style={styles.buttonFont}>BACK</Text>
                    </Pressable>
                    <Pressable style={styles.buttonSet} onPress={() => cancelDialog()} >
                        <Text style={styles.buttonFont}>CANCEL</Text></Pressable >
                </View >
            )
        case CreateScheduledItemText:
            return (
                <View style={styles.buttonsRow}>
                    <Pressable style={styles.buttonSet} onPress={() => createScheduledItemWithStateUpdate()}>
                        <Text style={styles.buttonFont}>SAVE</Text>
                    </Pressable>
                    <Pressable style={styles.buttonSet} onPress={() => cancelDialog()} >
                        <Text style={styles.buttonFont}>CANCEL</Text>
                    </Pressable >
                </View >
            )
        case ScheduledItemInformation:
            return (
                <View style={styles.buttonsRow}>
                    <Pressable style={styles.buttonSet} onPress={() => deleteScheduledItemConfirmation(aScheduledItem)} >
                        <Text style={styles.buttonFont}>DELETE</Text></Pressable>
                    <Pressable style={styles.buttonSet} onPress={() => { renderScheduledItemDialogForEdit() }} >
                        <Text style={styles.buttonFont}>EDIT</Text></Pressable >
                    <Pressable style={styles.buttonSet} onPress={() => { renderScheduledItemDialogForDuplication() }} >
                        <Text style={styles.buttonFont}>DUPLICATE</Text></Pressable >
                    <Pressable style={styles.buttonSet} onPress={() => cancelDialog()} >
                        <Text style={styles.buttonFont}>CANCEL</Text></Pressable >
                </View >
            )
        case DuplicateScheduledItemText:
        case EditScheduledItemText:
            return (
                <View style={styles.buttonsRow}>
                    <Pressable style={styles.buttonSet} onPress={() => {
                        switch (dialogState.dialogText) {
                            case EditScheduledItemText:
                                updateScheduledItemWithStateUpdate()
                                break
                            case DuplicateScheduledItemText:
                                createScheduledItemWithStateUpdate()
                                break
                        }
                    }}>
                        <Text style={styles.buttonFont}>SAVE</Text></Pressable>
                    <Pressable style={styles.buttonSet} onPress={
                        () => renderScheduledItemDialogForViewing(aScheduledItem)} >
                        <Text style={styles.buttonFont}>BACK</Text></Pressable>
                    <Pressable style={styles.buttonSet} onPress={() => cancelDialog()} >
                        <Text style={styles.buttonFont}>CANCEL</Text></Pressable>
                </View >
            )
        default: return (<View></View>)
    }

}