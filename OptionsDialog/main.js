// Copyright (c) 2006 Google Inc.
// All rights reserved
// 
// This file is part of the Google Desktop SDK and may be freely copied and used.
// To download the latest version of the SDK please visit 
// http://desktop.google.com/

function onOpen() {
  checkboxAValue.innerText = (options.getValue("checkboxa") == "ON") ? ON : OFF;
  checkboxBValue.innerText = (options.getValue("checkboxb") == "ON") ? ON : OFF;
  checkboxCValue.innerText = (options.getValue("checkboxc") == "ON") ? ON : OFF;
}

function onOptionChanged() {
  // optionChanged will contain the name of the option which was changed
  var optionChanged = event.propertyName;

  // Update only the appropriate checkbox
  if (optionChanged == "checkboxa")
    checkboxAValue.innerText = (options.getValue("checkboxa") == "ON") ? ON : OFF;
  if (optionChanged == "checkboxb")
    checkboxBValue.innerText = (options.getValue("checkboxb") == "ON") ? ON : OFF;
  if (optionChanged == "checkboxc")
    checkboxCValue.innerText = (options.getValue("checkboxc") == "ON") ? ON : OFF;
}

function onOpenOptionsClick() {
  // Show the options dialog. This is one of many ways a user can be shown
  // this dialog. Another method is for them to right click on the gadget and
  // to select the "Options" menu item.
  pluginHelper.showOptionsDialog();
}
