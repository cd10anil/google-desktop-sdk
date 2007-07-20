// Copyright 2006 Google Inc.
// All Rights Reserved.
// 
// This file is part of the Google Desktop SDK and may be freely copied and used.
// To download the latest version of the SDK please visit 
// http://desktop.google.com/

/**
 * @fileoverview This file contains the SelectionBox class
 * which is a UI element used in the wireless selection gadget
 * that holds selectable network listings and a scroll bar.
 */


/**
* Class Selection Box ui element
* @param {Object} divArea The div element to put the box into
*/
function SelectionBox(divArea) {

  // UI object setup.
  var area = divArea; 
  var boundary = area.appendElement("<div x='2' y='2' />"); 
  this.selectionArea = boundary.appendElement("<div x='0' y='0' />"); 

  // Persistent vars for tracking listings
  this.numSelected = -1; // index of selected listing
  this.listedNetworks = 0; 
  this.networkIds = []; 

  // Initialize selection area.
  boundary.height = area.height - SelectionBox.HEIGHT_BUFFER;
  boundary.width = area.width - SelectionBox.WIDTH_BUFFER;
  this.selectionArea.height = boundary.height;
  this.selectionArea.width = boundary.width;
}

// Global constants
SelectionBox.SELECTION_HEIGHT = 17;
SelectionBox.LISTING_SIZE = 8;
SelectionBox.LISTING_WIDTH = 90;
SelectionBox.STRENGTH_WIDTH = 35;
SelectionBox.STRENGTH_COLOR = "#0066CC";
SelectionBox.SELECTION_COLOR = "#ddeeff";
SelectionBox.HEIGHT_BUFFER = 8;
SelectionBox.WIDTH_BUFFER = 19;

/**
 * Add a selection to the selection box.
 * @param {String} textName Plain text name of listing
 * @param {String} logicalName What the computer calls the listing
 * @param {String} percentStrength String containing signal strength int
 */
SelectionBox.prototype.addSelection = function(textName, 
                                               logicalName, percentStrength) {
  debug.trace("adding: " + textName + " to position: " + this.listedNetworks);
  var s = "<div enabled='true' onclick='makeSelection(" + 
          this.listedNetworks + ")' />";
  var l = "<label />";
  var p = "<label />";
  var selection = this.selectionArea.appendElement(s);
  var listing = selection.appendElement(l);
  var strength = selection.appendElement(p);

  this.networkIds[this.listedNetworks] = logicalName;

  selection.x = 0;
  selection.y = this.listedNetworks * SelectionBox.SELECTION_HEIGHT;
  selection.height = SelectionBox.SELECTION_HEIGHT;
  selection.width = this.selectionArea.width;
    
  listing.size = SelectionBox.LISTING_SIZE;
  listing.width = SelectionBox.LISTING_WIDTH;
  listing.align = "left";
  listing.innerText = textName;
  listing.y = 2;

  strength.size = SelectionBox.LISTING_SIZE;
  strength.width = SelectionBox.STRENGTH_WIDTH;
  strength.x = listing.width;
  strength.align = "right";
  strength.color = SelectionBox.STRENGTH_COLOR;
  strength.innerText = percentStrength + '%';
  strength.y = 2;

  this.listedNetworks++;
  this.selectionArea.height = this.listedNetworks * 
      SelectionBox.SELECTION_HEIGHT;
};
  
/**
 * Clear the selection box.
 */
SelectionBox.prototype.clearListings = function() {
  var children = this.selectionArea.children;
  var count = children.count;
  while (children.count > 0) {
    this.selectionArea.removeElement(children(0));
  }
  this.listedNetworks = 0;
  this.numSelected = -1;
  this.moveTo(0);
};

/**
 * Return logical name of the selected item.
 * @return {String} Name of selection
 */
SelectionBox.prototype.selected = function() {
  if (this.numSelected < 0) {
    return null;
  }
  return this.networkIds[this.numSelected];
};

/**
 * Highlight the selected listing.
 * @param {Number} selectionNumber Index in box of new selection
 */
SelectionBox.prototype.select = function(selectionNumber) {
  selections = this.selectionArea.children;
  if (this.numSelected >= 0) {
    selections(this.numSelected).background = "";
  }
  selections(selectionNumber).background = SelectionBox.SELECTION_COLOR;
  this.numSelected = selectionNumber;
};

/**
 * Move selection list up or down. (scroll)
 * @param {String} direction 'up' or 'down'
 */
SelectionBox.prototype.move = function(direction) {
  debug.trace(this.selectionArea.y + this.selectionArea.height);
  if (direction == "up" && this.selectionArea.y < 0) {
    this.selectionArea.y += SelectionBox.SELECTION_HEIGHT;
    elemScroll.value += 10;

  } else if ((direction == "down") && 
            ((this.selectionArea.y + this.selectionArea.height) > 
            (3 * SelectionBox.SELECTION_HEIGHT))) {
    this.selectionArea.y -= SelectionBox.SELECTION_HEIGHT;
    elemScroll.value -= 10;
  }
};

/**
 * Move to a specific index in the list.
 * @param {Number} index
 */
SelectionBox.prototype.moveTo = function(index) {
  this.selectionArea.y = (-1) * index * SelectionBox.SELECTION_HEIGHT;
};