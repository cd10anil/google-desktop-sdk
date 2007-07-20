// Copyright (c) 2007 Google Inc.
// All rights reserved
// 
// This file is part of the Google Desktop SDK and may be freely copied and used.
// To download the latest version of the SDK please visit 
// http://desktop.google.com/dev/
//
// Our developer support group is at:
// http://groups.google.com/group/Google-Desktop-Developer

/*
 * This gadget demonstrates the listbox control.
 * 
 * Look at "main.xml" to see how the listbox is declared and configured.
 * 
 * Some interesting features of the listbox:
 * 
 * - A listbox will autoscroll when undocked or expanded if 
 *   the "autoscroll" property is set to true
 * - To disable a listitem, set the "enabled" property to false
 * - When an item is selected or unselected, an "onchange" event will fire
 */
 
function view_onOpen() {
  // Select the first listitem
  listbox.selectedIndex = 0;
}

// React to the user selecting a listitem.
function lb_onchange() {
  // Get the selected listitem
  var selectedItem = listbox.selectedItem;
  view.alert(strings.ALERT_TEXT_1 + selectedItem.name + 
             strings.ALERT_TEXT_2 + listbox.selectedIndex + 
             strings.ALERT_TEXT_3);
}
