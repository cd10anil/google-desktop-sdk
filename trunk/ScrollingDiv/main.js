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
 * This gadget demonstrates an autoscrolling div.
 * 
 * When a div's "autoscroll" property is set to true,
 * it will automatically contain a scrollbar if:
 * 
 *  - Its contents do not fit
 *    AND
 *  - The gadget is floating (undocked) or expanded
 * 
 */

function view_onOpen() {
  // Set onDisplayTargetChange handler, to receive notifications
  // of when the gadget is docked or undocked.
  pluginHelper.onDisplayTargetChange = onDisplayTargetChange;
  
  // Initially assume gadget is docked.  If gadget actually starts up undocked
  // "onDisplayTargetChange" will receive a notification that the 
  // gadget is undocked.
  onDock();
  
  // Resize the scroll area so it fills all remaining vertical space.
  resizeScrollarea();
}

function onDisplayTargetChange(displayTarget) {
  // Find out the new display mode
  if (displayTarget == gddTargetSidebar) {
    // Gadget is docked
    onDock();
  } else if (displayTarget == gddTargetFloatingView) {
    // Gadget is floating (undocked)
    onUndock();
  }
}

function onDock() {
  label.innerText = strings.DOCKED_LABEL;
}

function onUndock() {
  label.innerText = strings.UNDOCKED_LABEL;
}

/* The gadget has been resized. React. */
function view_onSize() {
  resizeScrollarea();
}

/* The gadget has been popped in from expanded view. */
function view_onPopIn() {
  onDock();
}

/* The gadget has been popped out into expanded view. */
function view_onPopOut() {
  onUndock();  
}

/*
 * Resize the scroll area to match the view's current size.
 */
function resizeScrollarea() {
  // Fill vertical space with the scroll area
  scrollarea.height = view.height - label.height;
}
