import { Platform, StyleSheet } from "react-native"
import Colors from "./Colors"
import Layout from "./Layout"
import layoutConstants from './Layout'
export const bases = StyleSheet.create({
  textInputBase: {
    fontSize: Layout.defaultFontSize,
    color: "black", marginTop: -5,
    justifyContent: "flex-end", flex: 1, paddingRight: 5
  },
  numberTextInput: {
    height: 30,
    fontSize: Layout.defaultFontSize,
    color: "black", marginTop: 0,
    width: 30, textAlign: "center"

  },
  changeButtonBase: {
    paddingHorizontal: Layout.defaultMargin,
    paddingTop: 10,
    height: 30,
    marginStart: 7,
    marginBottom: 7,
    marginLeft: 0,
    elevation: 4,
    // Material design blue from https://material.google.com/style/color.html#color-color-palette
    ...Platform.select({
      ios: {
        // iOS blue from https://developer.apple.com/ios/human-interface-guidelines/visual-design/color/
        color: '#007AFF',
        fontSize: 18,
      },
      android: {
        color: 'white',
        fontWeight: '700',
      },
    }),
    borderRadius: 2,

  },
  changeButtonBase2: {


  },
  numberCRUD: {
    flexDirection: "row", marginTop: 20,
    display: 'flex', justifyContent: "space-between", maxHeight: 40
  },
  incrementButton:
    { color: "white", fontSize: Layout.defaultFontSize, marginTop: -7 }

})

export const styles = StyleSheet.create({
  innerTouchableOpacity: {
    flex: 0,
    margin: Layout.dialogSpacingMargin,
    backgroundColor: "white",
    padding: 35,
    justifyContent: 'flex-end',
    display: 'flex',
    flexDirection: 'column',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  numberInputEditable: {
    backgroundColor: Colors.light.altBackground,
    ...bases.numberTextInput
  },
  numberInputViewOnly: {
    backgroundColor: "white",
    ...bases.numberTextInput
  },
  textInputEditable: {
    backgroundColor: Colors.light.altBackground,
    ...bases.textInputBase
  },
  textInputViewOnly: {
    backgroundColor: "white",
    ...bases.textInputBase
  },
  changeButtonEnabled: {
    backgroundColor: '#2196F3',
    ...bases.changeButtonBase
  },
  buttonSet: {
    backgroundColor: '#2196F3',
    marginLeft: Layout.defaultMargin,
    paddingHorizontal: Layout.defaultMargin,
    paddingTop: 6,
    height: 30,
    marginStart: 7,
    marginBottom: 5,
    elevation: 4,
    borderRadius: 2,
  },
  changeButtonDisabled: {
    backgroundColor: Colors.light.altBackground,
    ...bases.changeButtonBase
  }
  ,
  buttonFont: {
    color: 'white',
    // Material design blue from https://material.google.com/style/color.html#color-color-palette
    ...Platform.select({
      ios: {
        // iOS blue from https://developer.apple.com/ios/human-interface-guidelines/visual-design/color/
        color: '#007AFF',
        fontSize: 18,
      },
      android: {
        color: 'white',
        fontWeight: '700',
      },
    }),
  },
  dialogRow: { flexDirection: "row", marginTop: 20 },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flexWrap: 'wrap',
    marginTop: 20
  },
  overallDialog: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end"
  },
  numberElementsOnTheLeftOfScheduleItemDialog: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  dialogRow2: {
    flexDirection: "row",
    marginTop: 10,
    display: 'flex',
    justifyContent: "space-between"
  },
  justBackgroundColor: { backgroundColor: Colors.light.tint },
  listStyle: {
    width: "100%", transform: [{ rotateX: "180deg" }],
    marginHorizontal: Layout.defaultMargin,
  },
  settingsScreen: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    margin: layoutConstants.defaultMargin
  },
  planScreenPressable: {
    borderRadius: 45,
    height: 60, width: 60,
    marginTop: 10,
    elevation: 3, zIndex: 3
  },
  filterScheduledItemTextInput: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: "100%",
    paddingHorizontal: Layout.defaultMargin,
    paddingBottom: Layout.defaultMargin + 5,
    paddingTop: Layout.defaultMargin - 5,
    fontSize: Layout.defaultFontSize,
    backgroundColor: "white",
  },
  filterExercisesTextInput: {
    width: "100%",
    padding: layoutConstants.defaultMargin,
    fontSize: Layout.defaultFontSize,
    borderTopWidth: 2,
    borderTopColor: "white"
  },
  settingsButtonText: {
    color: "white", textAlign: 'center', fontWeight: '600'
  }
})
