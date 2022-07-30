import {
    View, Button
} from 'react-native'
import 'react-native-gesture-handler'
import React, { Dispatch } from 'react'
import _default from 'babel-plugin-transform-typescript-metadata'
import { styles } from '../constants/styles'
import { DialogState } from '../types'
export function ButtonSet(props: any) {
    //constant strings
    const ExerciseInformationText = "Exercise Information"
    const EditExerciseText = "Edit Exercise:"
    const CreateExerciseText = "Create Exercise:"
    const CreateScheduledItemText = "Create:"
    const ScheduledItemInformation = "Information:"
    const EditScheduledItemText: string = "Edit"
    const DuplicateScheduledItemText: string = "Duplicate:"
    
    const buttonsSetProps = props.buttonsSetProps
    const aExercise = props.aExercise
    const aScheduledItem = props.aScheduledItem
    const dialogText = props.dialogText
    const dialogState:DialogState= props.dialogState

    const SetDialogState:Dispatch<DialogState> = props.SetDialogState

    const cancelDialog = buttonsSetProps. cancelDialog
    const deleteExerciseConfirmation = buttonsSetProps.deleteExerciseConfirmation
    const renderExerciseDialogForEdit = buttonsSetProps.renderExerciseDialogForEdit
    const renderExerciseDialogForViewing = buttonsSetProps.renderExerciseDialogForViewing
    const createExercise = buttonsSetProps.createExercise
    const updateExercise = buttonsSetProps.updateExercise

    const deleteScheduledItemConfirmation = buttonsSetProps.deleteScheduledItemConfirmation
    const renderScheduledItemDialogForEdit = buttonsSetProps.renderScheduledItemDialogForEdit
    const renderScheduledItemDialogForViewing = buttonsSetProps.renderScheduledItemDialogForViewing
    const renderScheduledItemDialogForDuplication = buttonsSetProps.renderScheduledItemDialogForDuplication
    const createScheduledItem = buttonsSetProps.createScheduledItem;
    const updateScheduledItem = buttonsSetProps.updateScheduledItem;

    switch (dialogText) {
        case ExerciseInformationText:
            return (
                <View style={styles.buttonsRow}>
                    <Button title="delete" onPress={() => deleteExerciseConfirmation(aExercise)} />
                    <Button title='Edit' onPress={() => { renderExerciseDialogForEdit() }} />
                    <Button title='Cancel' onPress={() => cancelDialog()} />
                        <Button onPress={()=> SetDialogState({...dialogState,isHistoryDialogVisible:true})} title="History and Pr"/>
                </View>
            )
        case CreateExerciseText:
            return (
                <View style={styles.buttonsRow}>
                    <Button title='Save' onPress={() => createExercise()}></Button>
                    <Button title='Cancel' onPress={() => cancelDialog()} />
                </View>
            )
        case EditExerciseText:
            return (
                <View style={styles.buttonsRow}>
                    <Button title='Save' onPress={() => updateExercise()}></Button>
                    <Button title='Back' onPress={() => renderExerciseDialogForViewing(aExercise)} />
                    <Button title='Cancel' onPress={() => cancelDialog()} />
                </View>
            )
        case CreateScheduledItemText:
            return (
                <View style={styles.buttonsRow}>
                    <Button title='Save' onPress={() => createScheduledItem()}></Button>
                    <Button title='Cancel' onPress={() => cancelDialog()} />
                </View>
            )
        case ScheduledItemInformation:
            return (
                <View style={styles.buttonsRow}>
                    <Button title="delete" onPress={() => deleteScheduledItemConfirmation(aScheduledItem)} />
                    <Button title='Edit' onPress={() => { renderScheduledItemDialogForEdit() }} />
                    <Button title="duplicate" onPress={() => { renderScheduledItemDialogForDuplication() }} />
                    <Button title='Cancel' onPress={() => cancelDialog()} />
                </View>
            )
        case DuplicateScheduledItemText:
        case EditScheduledItemText:
            return (
                <View style={styles.buttonsRow}>
                    <Button title='Save' onPress={() => {
                        switch (dialogText) {
                            case EditScheduledItemText:
                                updateScheduledItem()
                                break
                            case DuplicateScheduledItemText:
                                createScheduledItem()
                                break
                        }
                    }}></Button>
                    <Button title='Back' onPress={() => renderScheduledItemDialogForViewing(aScheduledItem)} />
                    <Button title='Cancel' onPress={() => cancelDialog()} />
                </View>
            )
        default: return (<View></View>)
    }

}