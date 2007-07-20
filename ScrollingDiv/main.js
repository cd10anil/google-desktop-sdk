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
