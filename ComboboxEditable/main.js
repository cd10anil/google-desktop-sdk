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
There are two types of combobox. This gadget demonstrates the editable
combobox of type="dropdown".

An editable combobox resembles a textbox but also offers a dropdown list
to provide preset choices to the user.

Look at main.xml to see how the combobox is declared and configured.
*/

// onclick handler for the submit button.
function onSubmit() {
  // Alas, not very magical...
  view.alert(strings.YOU_CHOSE + ' ' + combobox.value);
}

// onkeypress handler for the combobox.
// Submits the form if the enter key is detected.
function onKeyPress() {
  if (event.keycode == 13) {
    onSubmit();
    return false;
  }
}
