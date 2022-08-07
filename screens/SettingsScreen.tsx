
import {
    View, Button, Alert, Pressable, Text,
    Platform, StyleProp, ViewStyle
} from 'react-native';
import React, { useContext } from 'react';
import { SettingsScreenContext } from '../App';
import { styles } from '../constants/styles';
import Toast from 'react-native-simple-toast';

function confirmation(handleFunc: Function) {
    return Alert.alert(
        "Comfirmation",
        "Are you sure you want to reset the database?",
        [{ text: "Yes", onPress: () => handleFunc() }, { text: "No" }]
    )
}

const androidStyle = () => {
    if (Platform.OS == 'ios') return (
        { ...styles.buttonSet, display: 'none' } as StyleProp<ViewStyle>)
    else return { ...styles.buttonSet, display: 'flex' } as StyleProp<ViewStyle>
}

export function SettingsScreen() {
    const context = useContext(SettingsScreenContext);
    return (
        <View style={styles.settingsScreen}>
            <Button title='Reset Database' onPress={() => confirmation(context.handleResetDB)} />
            <Pressable style={() => androidStyle()} onPress={() => context.handleExport()}>
                <Text style={styles.settingsButtonText}>EXPORT</Text></Pressable>
            <Pressable style={() => androidStyle()} onPress={() => context.handleImport()}>
                <Text style={styles.settingsButtonText}>IMPORT </Text></Pressable>
            <Text>Make sure that the folder you choose have only one file with the prefix "backup.json". However if there are multiple, the very first one will be choosen</Text>
        </View>
    );
}