/*
Copyright (C) 2007 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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
