
import { View, Button, Alert } from 'react-native';
import { resetTables } from '../dbhandler';
import React from 'react';
import layoutConstants from '../constants/Layout';//can give any name if it is not mentioned in orginal file.
function confirmation() {
    return Alert.alert(
        "Comfirmation",
        "Are you sure you want to reset the database?",
        [{ text: "Yes", onPress: () => resetTables() }, { text: "No" }]
    )
}

export function SettingsScreen() {
    return (
        <View style={{
            flex: 1,
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            margin: layoutConstants.defaultMargin
        }}>
            <Button title='Reset Database' onPress={() => confirmation()} />
        </View>
    );
}