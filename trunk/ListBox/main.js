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
 * This gadget demonstrates the listbox control.
 * 
 * Look at "main.xml" to see how the listbox is declared and configured.
 * 
 * Some interesting features of the listbox:
 * 
 * - A listbox will autoscroll when undocked or expanded if 
 *   the "autoscroll" property is set to true
 * - To disable an item, set the "enabled" property to false
 * - When an item is selected or unselected, an "onchange" event will fire
 * 
 * NOTE: This sample is not compatible with Mac Desktop Gadgets 1.0.0.0
 * because it uses the <item> element which is not yet supported.
 * To ensure a gadget based off this sample runs on the Mac,
 * change the <item> elements to <listitem> in main.xml.
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
