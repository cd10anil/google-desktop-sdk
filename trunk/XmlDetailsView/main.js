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
 *
 * NOTE: This sample is not compatible with Mac Desktop Gadgets 1.0.0.0
 * because it uses the <item> element which is not yet supported.
 * To ensure a gadget based off this sample runs on the Mac,
 * change the <item> elements to <listitem> in details.xml.
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
