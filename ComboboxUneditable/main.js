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

/*
There are two types of combobox. This gadget demonstrates the uneditable
combobox of type="droplist".

An uneditable combobox resembles the select HTML input
or an ordinary dropdown list.

Look at main.xml to see how the combobox is declared and configured.
*/

// onchange handler for the combobox.
function onChange() {
  // The current value of the combobox is in the value property.
  displayChoice(combobox.value);

  // Alternatively, you can use selectedIndex to get the selected item index.
  // Here, we output the index to the debug console.
  debug.trace(strings.SELECTED_INDEX + ': ' + combobox.selectedIndex);
}

function displayChoice(choice) {
  var replies = [strings.HOW_ORIGINAL,
                 strings.GREAT_CHOICE,
                 strings.MY_FAVORITE,
                 strings.INTERESTING];

  var reply = replies[Math.floor(Math.random() * replies.length)];

  lastSelected.innerText = choice + '? ' + reply;
}
