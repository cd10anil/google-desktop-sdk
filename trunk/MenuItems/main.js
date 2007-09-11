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

// Start with a checked Item C
var itemCChecked = true;

function onOpen() {
  // Call onAddCustomMenuItems whenever the gadget needs to list menu items. 
  // This will happen when the user right clicks on the gadget or clicks the 
  // menu button on the gadget.
  pluginHelper.onAddCustomMenuItems = onAddCustomMenuItems;
}

function onAddCustomMenuItems(menu) {
  // Add each item. Note that this needs to be done each time this function is
  // called.
  menu.AddItem(ITEM_A, 0, onItemAClick);
  menu.AddItem(ITEM_B, gddMenuItemFlagGrayed, null);
  menu.AddItem(ITEM_C, itemCChecked ? gddMenuItemFlagChecked : 0, onItemCClick);
}

function onItemAClick() {
  view.alert(ITEM_A_CLICKED);
}

function onItemCClick() {
  // Reverse the checkmark status of the item
  itemCChecked = !itemCChecked;
}
