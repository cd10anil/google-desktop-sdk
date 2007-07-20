// Copyright (c) 2006 Google Inc.
// All rights reserved
// 
// This file is part of the Google Desktop SDK and may be freely copied and used.
// To download the latest version of the SDK please visit 
// http://desktop.google.com/

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
