
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { resetTables } from './dbhandler';
import React from 'react';

function confirmation() {
    return Alert.alert(
        "Comfirmation",
        "Are you sure you want to reset the database?",
        [
            { text: "Yes",onPress:()=> resetTables() }, {text:"No"}
        ]
    )
}

export function SettingsScreen() {

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
            <Button title='Reset Database' onPress={() =>confirmation()}></Button>
        </View>
    );
}