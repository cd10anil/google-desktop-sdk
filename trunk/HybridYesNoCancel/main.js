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

function onTextClick() {
  // Will represent the dll object once loaded
  var dll = null;
    
  try {
    // Attempt to load the MyStuff object from the dll
    dll = new MyStuff();
  } catch (e) {
    view.alert(COULDNT_LOAD_DLL);
    return;
  }

  // Call the MyYesNoCancelPrompt method that is compiled in the DLL. The
  // source code for this function is in the YesNoCancel directory.
  var result = dll.MyYesNoCancelPrompt(IS_EXCITING);

  // Display the string result
  view.alert(YOU_CHOSE + " " + result);
}
