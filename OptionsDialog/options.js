// Copyright (c) 2006 Google Inc.
// All rights reserved
// 
// This file is part of the Google Desktop SDK and may be freely copied and used.
// To download the latest version of the SDK please visit 
// http://desktop.google.com/

function onOpen() {
  // Set the checkmarks in the dialog to the current settings
  checkboxA.value = (options.getValue("checkboxa") == "ON");
  checkboxB.value = (options.getValue("checkboxb") == "ON");
  checkboxC.value = (options.getValue("checkboxc") == "ON");
}

function onCancel() {
  // No settings will be saved.
}

function onOk() {
  // Save all the settings only if required
  options.putValue("checkboxa", checkboxA.value ? "ON" : "OFF");
  options.putValue("checkboxb", checkboxB.value ? "ON" : "OFF");
  options.putValue("checkboxc", checkboxC.value ? "ON" : "OFF");
}
