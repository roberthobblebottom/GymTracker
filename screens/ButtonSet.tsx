import {
    View, Button
} from 'react-native'
import 'react-native-gesture-handler'
import React, { } from 'react'
import _default from 'babel-plugin-transform-typescript-metadata'
import { styles } from '../constants/styles'
export function ButtonSet(props: any) {
    //constant strings
    const ExerciseInformationText = "Exercise Information"
    const EditExerciseText = "Edit Exercise:"
    const CreateExerciseText = "Create Exercise:"
    const CreateScheduledItemText = "Create:"
    const ScheduledItemInformation = "Information:"
    const EditScheduledItemText: string = "Edit"
    const DuplicateScheduledItemText: string = "Duplicate:"

    const cancelDialog = props.cancelDialog
    const aExercise = props.aExercise
    const aScheduledItem = props.aScheduledItem
    const dialogText = props.dialogText

    const deleteExerciseConfirmation = props.deleteExerciseConfirmation
    const renderExerciseDialogForEdit = props.renderExerciseDialogForEdit
    const renderExerciseDialogForViewing = props.renderExerciseDialogForViewing
    const createExercise = props.createExercise
    const updateExercise = props.updateExercise

    const deleteScheduledItemConfirmation = props.deleteScheduledItemConfirmation
    const renderScheduledItemDialogForEdit = props.renderScheduledItemDialogForEdit
    const renderScheduledItemDialogForViewing = props.renderScheduledItemDialogForViewing
    const renderScheduledItemDialogForDuplication = props.renderScheduledItemDialogForDuplication
    const createScheduledItem = props.createScheduledItem;
    const updateScheduledItem = props.updateScheduledItem;

    switch (dialogText) {
        case ExerciseInformationText:
            return (
                <View style={styles.buttonsRow}>
                    <Button title="delete" onPress={() => deleteExerciseConfirmation(aExercise)} />
                    <Button title='Edit' onPress={() => { renderExerciseDialogForEdit() }} />
                    <Button title='Cancel' onPress={() => cancelDialog()} />
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