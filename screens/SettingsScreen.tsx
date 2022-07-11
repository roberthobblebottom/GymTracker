
import { View, Button, Alert } from 'react-native';
import React, { useContext } from 'react';
import {handleResetDBContext} from '../App';
import layoutConstants from '../constants/Layout';//can give any name if it is not mentioned in orginal file.
function confirmation(handleFunc:Function) {
    return Alert.alert(
        "Comfirmation",
        "Are you sure you want to reset the database?",
        [{ text: "Yes", onPress: () => handleFunc()}, { text: "No" }]
    )
}

export function SettingsScreen() {
    const handleFunc:Function = useContext(handleResetDBContext);
    return (
        <View style={{
            flex: 1,
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            margin: layoutConstants.defaultMargin
        }}>
            <Button title='Reset Database' onPress={() => confirmation(handleFunc)} />
        </View>
    );
}