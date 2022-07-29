import { Platform, StyleSheet } from "react-native"
import Colors  from "./Colors"
import Layout from "./Layout"

export const bases = StyleSheet.create({
  textInputBase: {
    fontSize: Layout.defaultFontSize,
    color: "black", marginTop: -5,
    justifyContent: "flex-end", flex: 1, textAlign: "right", paddingRight: 5
  },
  numberTextInput: {
    height: 30,
    fontSize: Layout.defaultFontSize,
    color: "black", marginTop: 0,
    width: 30, textAlign: "center"

  },
  changeDateButtonBase: {
    paddingHorizontal: Layout.defaultMargin,
    paddingTop: 10,
    height: 30,
    marginStart: 7,
    marginBottom: 7,
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

  numberCRUD: {
    flexDirection: "row", marginTop: 20, display: 'flex', justifyContent: "space-between", maxHeight: 40
  }, incrementButton:
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
    fontSize:Layout.defaultFontSize
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
  changeDateButtonEnabled: {
    backgroundColor: '#2196F3',
    ...bases.changeDateButtonBase
  },
  changeDateButtonDisabled: {
    backgroundColor: Colors.light.altBackground,
    ...bases.changeDateButtonBase
  }
  ,
  dialogRow: { flexDirection: "row", marginTop: 20 },
  buttonsRow:{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 },
  overallDialog:{ flex: 1, display: "flex", justifyContent: "flex-end" },
  numberElementsOnTheLeftOfScheduleItemDialog:{ flexDirection: "row", justifyContent: "space-evenly", },
  dialogRow2:{ flexDirection: "row", marginTop: 10, display: 'flex', justifyContent: "space-between" }
})
