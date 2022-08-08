import { Modal, TouchableOpacity, Button, Text } from "react-native"
import React from "react"
import { styles } from "../constants/styles"
import Layout from "../constants/Layout"
import { Calendar } from "react-native-calendars"
import { DialogState, ScheduledItem, ScheduledItemState } from "../types"
import { createScheduledItem, updateScheduledItem } from '../dbhandler'
export function SelectDateDialog(props: any) {
    const dialogState: DialogState = props.dialogState
    const scheduledItemState: ScheduledItemState = props.scheduledItemState

    const setDialogState = props.setDialogState
    const setScheduledItemState = props.setScheduledItemState

    const aScheduledItem = scheduledItemState.aScheduledItem
    const isMovingScheduledItems = scheduledItemState.isMovingScheduledItems
    const scheduledItems = scheduledItemState.scheduledItems

    const selectedScheduledItems: ScheduledItem[] = scheduledItemState.selectedScheduledItems
    const commonScheduledItemCRUD: Function = props.commonScheduledItemCRUD
    const text = selectedScheduledItems.length > 0 ?
        isMovingScheduledItems
            ? "Select a date to move the scheduled item(s) to"
            : "Selected a date to duplicate the scheduled items(s) to"
        : "Select a date"

    return (
        <Modal visible={dialogState.isCalendarDialogVisible} animationType="fade" transparent={true} >
            <TouchableOpacity style={styles.overallDialog}
             onPressIn={() => setDialogState({ ...dialogState, isCalendarDialogVisible: false })
            }>
                <TouchableOpacity style={styles.innerTouchableOpacity}
                    onPress={() => { }}
                    activeOpacity={1}
                >
                    <Text style={{ fontSize: Layout.defaultFontSize }}> {text} </Text>
                    <Calendar
                        initialDate={aScheduledItem.date.dateString}
                        onDayPress={day => {
                            setDialogState({ ...dialogState, isCalendarDialogVisible: false })
                            if (selectedScheduledItems.length > 0) {
                                if (isMovingScheduledItems) {
                                    let si: ScheduledItem[] = scheduledItems
                                    selectedScheduledItems.forEach(s => {
                                        s.date = day
                                        si.forEach((currentScheduledItem, i) => {
                                            if (currentScheduledItem.id == s.id) {
                                                si.splice(i, 1, s)
                                                return
                                            }
                                        })
                                        updateScheduledItem(s)
                                    })
                                    commonScheduledItemCRUD(si)
                                }
                                else {
                                    let arr: ScheduledItem[] = []
                                    selectedScheduledItems.forEach(e => {
                                        let t = { ...e }
                                        t.id = Math.floor(
                                            Math.random() * (1000000000 - 10000) + 10000
                                        )//WARNING: May cause issues of clashes of scheduled item of the same number
                                        t.date = day
                                        createScheduledItem(t)
                                        arr.push(t)
                                    })
                                    let si = arr.concat(scheduledItems)
                                    commonScheduledItemCRUD(si)
                                }
                            } else {
                                const s = {...aScheduledItem}
                                s.date = day
                                setScheduledItemState({ ...scheduledItemState, aScheduledItem: s })
                            }
                        }} />
                    < Button title='Cancel' onPress={() => setDialogState({
                        ...dialogState,
                        isCalendarDialogVisible: false
                    })} />
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>



    )
}