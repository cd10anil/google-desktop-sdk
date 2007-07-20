// Copyright (c) 2006 Google Inc.
// All rights reserved
// 
// This file is part of the Google Desktop SDK and may be freely copied and used.
// To download the latest version of the SDK please visit 
// http://desktop.google.com/
//
// Our developer support group is at:
// http://groups.google.com/group/Google-Desktop-Developer

/**
 * Theming system
 */

/**
 * The key to use in the "options" object
 * for storing the current color.
 */
var MILKTHEME_COLOR = "MilkTheme_Color";

var COLORS = new Array(8);
COLORS[0] = "#CECEC2";
COLORS[1] = "#FFA72B";
COLORS[2] = "#DEFF00";
COLORS[3] = "#89EFAA";
COLORS[4] = "#90D7FF";
COLORS[5] = "#B6B0FF";
COLORS[6] = "#D58CFF";
COLORS[7] = "#FF86EA";

/**
 * Color changer button, "onmouseover" handler
 */
function NextColor_onMouseOver(mouseEvent) {
  ColorButton.background = getNextTheme();
}

/**
 * Color changer button, "onmouseout" handler
 */
function NextColor_onMouseOut(mouseEvent) {
  ColorButton.background = "#DDDDDD";
}

function NextColor_onClick() {
  var color = getNextTheme();
  // Change the theme color option.  
  // This will trigger the "view.onoptionchanged" handler, if present.
  options.putValue(MILKTHEME_COLOR, color);

  ColorButton.background = color;
}

function getNextTheme() {
  var currentColor = options.getValue(MILKTHEME_COLOR);

  var i = 0;
  for( ; i < COLORS.length; ++i) {
    if(COLORS[i] == currentColor) {
      break;
    }
  }
  
  ++i;
  if(i >= COLORS.length) {
    i = 0;
  }
  
  return COLORS[i];
}
