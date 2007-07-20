// Copyright (c) 2007 Google Inc.
// All rights reserved
// 
// This file is part of the Google Desktop SDK and may be freely copied and used.
// To download the latest version of the SDK please visit 
// http://desktop.google.com/

/*
 * This gadget demonstrates an XML-specified details view 
 * 
 * A details view can be specified in an XML file
 * using all the UI elements you've grown to love.
 *
 * For communication between the details view and main view,
 * a "detailsViewData" object (similar to the "options" store) can be used
 * to store and retrieve shared data.
 * 
 * Within the main gadget script, this "DetailsViewData" object is a property 
 * called "detailsViewData" of a DetailsView object.
 * 
 * Within the details view script, the object is a top level object called
 * "detailsViewData"
 * 
 * It behaves like an "options" object, 
 * so "putValue", "getValue", "remove", etc. methods are available.
 */
 
var detailsView;

// Create and open a custom details view.
function onMainClick() {
  detailsView = new DetailsView();
  
  // Create the details view and set its content.
  detailsView.SetContent(
      "",             // Item's displayed website/news source.
      undefined,      // Time created
      "details.xml",  // The XML file
      false,          // Whether time is shown as absolute time
      0);             // Content layout flags

  // Set a reference to the "closeDetailsView" function in the detailsViewData
  detailsView.detailsViewData.putValue("closeDetailsView", closeDetailsView);
  
  // Show the details view  
  plugin.ShowDetailsView(detailsView,  // The DetailsView object
      strings.DETAILS_VIEW_TITLE,      // The title
      gddDetailsViewFlagNone,  // Flags
      onDetailsViewFeedback);  // The handler to call when details view closes
}


// Hide and destroy the currently visible details view
function closeDetailsView() {
  plugin.CloseDetailsView();
}

// React to the closure of the details view.
function onDetailsViewFeedback(detailsViewFlags) {
  if (detailsViewFlags == gddDetailsViewFlagNone) {
    // User closed the details view
  } else if (detailsViewFlags == gddDetailsViewFlagToolbarOpen) {
    // User clicked on the title of the details view
  }
  
  var itemClicked = detailsView.detailsViewData.getValue("itemClicked");  
  if (itemClicked) {
    // Update status message if an item was clicked
    statusLabel.innerText = strings.LAST_ITEM_CHOSEN + itemClicked;
  }
}
