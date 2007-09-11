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
