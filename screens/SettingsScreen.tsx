
import { View, Button, Alert } from 'react-native';
import React, { useContext } from 'react';
import { SettingsScreenContext } from '../App';
import { styles } from '../constants/styles';
function confirmation(handleFunc: Function) {
    return Alert.alert(
        "Comfirmation",
        "Are you sure you want to reset the database?",
        [{ text: "Yes", onPress: () => handleFunc() }, { text: "No" }]
    )
}

export function SettingsScreen() {
    const context = useContext(SettingsScreenContext);
    return (
        <View style={styles.settingsScreen}>
            <Button title='Reset Database' onPress={() => confirmation(context.handleResetDB)} />
            {/* <Button title='export to directory of the app' onPress={()=>context.handleExport()} /> */}
            {/* <Button title='import' onPress={()=>{}} /> */}
        </View>
    );
}