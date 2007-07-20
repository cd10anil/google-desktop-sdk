// Copyright (c) 2007 Google Inc.
// All rights reserved
// 
// This file is part of the Google Desktop SDK and may be freely copied and used.
// To download the latest version of the SDK please visit 
// http://desktop.google.com/

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
