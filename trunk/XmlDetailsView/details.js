// Copyright (c) 2007 Google Inc.
// All rights reserved
// 
// This file is part of the Google Desktop SDK and may be freely copied and used.
// To download the latest version of the SDK please visit 
// http://desktop.google.com/dev/
//
// Our developer support group is at:
// http://groups.google.com/group/Google-Desktop-Developer

function lb_onchange() {
  var selectedItem = listbox.selectedItem;  
  // Store the name of the item in details view data.  
  detailsViewData.putValue("itemClicked", selectedItem.name);

  // A technique to force the details view to close from within details view.
  // A reference was stored in details view data to a function that
  // closes the details view.
  var closeDetailsView = detailsViewData.getValue("closeDetailsView");
  closeDetailsView();  
}