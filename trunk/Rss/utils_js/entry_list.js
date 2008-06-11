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

EntryList.FRAME_TOP_LEFT_IMAGE = 'frame_TopLeft.png';
EntryList.FRAME_TOP_MIDDLE_IMAGE = 'frame_TopMiddle.png';
EntryList.FRAME_TOP_RIGHT_IMAGE = 'frame_TopRight.png';
EntryList.FRAME_TOP_LOGO_IMAGE = 'frame_TopLogo.png';

EntryList.FRAME_MIDDLE_LEFT_IMAGE = 'frame_MiddleLeft.png';
EntryList.FRAME_MIDDLE_RIGHT_IMAGE = 'frame_MiddleRight.png';

// Filenames of alternative "stretch" images. If exists, gadget will use
// these instead and stretch instead of tiling.
// Other option was to introduce new parameter in config_constants to
// control stretching vs. tiling.
// Decided this would be better since it requires no code modifications on
// the designer's part.
EntryList.FRAME_TOP_MIDDLE_STRETCH_IMAGE = 'frame_TopMiddleStretch.png';
EntryList.FRAME_BOTTOM_MIDDLE_STRETCH_IMAGE = 'frame_BottomMiddleStretch.png';

EntryList.FRAME_MIDDLE_LEFT_STRETCH_IMAGE = 'frame_MiddleLeftStretch.png';
EntryList.FRAME_MIDDLE_RIGHT_STRETCH_IMAGE = 'frame_MiddleRightStretch.png';

EntryList.FRAME_BOTTOM_LEFT_IMAGE = 'frame_BottomLeft.png';
EntryList.FRAME_BOTTOM_MIDDLE_IMAGE = 'frame_BottomMiddle.png';
EntryList.FRAME_BOTTOM_RIGHT_IMAGE = 'frame_BottomRight.png';

EntryList.SCROLLBAR_TRACK_IMAGE = 'scrollbar_track.png';
EntryList.SCROLLBAR_THUMB_IMAGE = 'scrollbar_thumb.png';

// Default entry hover background, if none specified in config.
EntryList.DEFAULT_ENTRY_HOVER_BKG = '#FFFFFF';

// XML file that describes title. The title is the area above content where
// arbritrary elements can be specified.
EntryList.TITLE_FILE = 'title.xml';

// The theme file that contains the XML template for an entry item.
EntryList.ITEM_TEMPLATE_FILE = 'entry_item.xml';

// Configuration values for this theme.
EntryList.CONFIG_FILE = 'theme_config.xml';

// Encapsulates the UI that displays feed entries.
// Also manages sizing of scrollbar and frame.
// - container: Container div, inner elements are defined in "main.xml".
// - themeDir: directory path containing the desired "theme".
function EntryList(container, themeDir) {
  this.container = container;

  this.content = this.container.children('content');

  // The title area.
  this.title = this.container.children('title');
  
  // The div that wraps the entries (for clipping purposes).
  this.entryListViewport = this.content.children('entriesViewport');
  // The actual div that will contain the entries.
  this.entryList = this.entryListViewport.children('entries');
  
  // The label that will contain text content.
  this.statusLabel = this.content.children('statusLabel');

  this.scrollbar = this.container.children('scrollbar');
  // The actual scrollbar is implemented with a progressbar.
  this.scrollProgressBar = this.scrollbar.children('bar');

  // Setup handlers for the progress bar events.
  var me = this;
  this.scrollProgressBar.onchange = function() { me.onScroll(); };
  this.scrollProgressBar.onmousewheel = function() { me.onMouseWheel(); };

  this.header = new HorizStretchImage(header);
  this.footer = new HorizStretchImage(footer);
  this.borderLeft = this.container.children('borderLeft');
  this.borderRight = this.container.children('borderRight');

  this.logo = this.container.children('logo');
  this.logoImage = this.logo.children('image');

  themeDir = themeDir || EntryList.DEFAULT_THEME_DIR;
  this.loadTheme(themeDir);

  // The current number of entries.
  this.numItems = 0;
  // The height of the displayable content.
  // Will be calculated in the resize method.
  this.contentHeight = 0;
}

// Loads theme in the given directory.
EntryList.prototype.loadTheme = function(themeDir) {
  // Read in the entry item template.      
  this.itemXml = gadget.storage.openText(
      pathify(themeDir, EntryList.ITEM_TEMPLATE_FILE));

  // Read in header title XML.
  this.titleXml = gadget.storage.openText(
      pathify(themeDir, EntryList.TITLE_FILE));

  // Read in config XML.        
  var configXml = gadget.storage.openText(
      pathify(themeDir, EntryList.CONFIG_FILE));
  
  // Parse config and extract values.
  var xmlDoc = makeDomDocument();
  xmlDoc.async = false;
  xmlDoc.loadXML(configXml);
 
  var parser = new SimpleXmlParser(xmlDoc);  
  var parsedItems = parser.getItems('config');
          
  // Set the entry hover background color.
  if (parsedItems.length > 0 && parsedItems[0]['entryHoverBkg']) {
    this.entryHoverBkg = parsedItems[0]['entryHoverBkg'];
  } else {
    // Use the default.
    this.entryHoverBkg = EntryList.DEFAULT_ENTRY_HOVER_BKG;    
  }
    
  // Insert title content into title area.
  if (this.titleXml) {
    this.title.appendElement(this.titleXml);
  }
  
  var headerMiddleImage;
  
  if (isFilePresent(
      pathify(themeDir, EntryList.FRAME_TOP_MIDDLE_STRETCH_IMAGE))) {
    this.header.setStretchMode(true);
    headerMiddleImage = 
        pathify(themeDir, EntryList.FRAME_TOP_MIDDLE_STRETCH_IMAGE);
  } else {
    this.header.setStretchMode(false);    
    headerMiddleImage = pathify(themeDir, EntryList.FRAME_TOP_MIDDLE_IMAGE);
  }
  
  this.header.setImages(pathify(themeDir, EntryList.FRAME_TOP_LEFT_IMAGE),
      headerMiddleImage,
      pathify(themeDir, EntryList.FRAME_TOP_RIGHT_IMAGE));

  this.logoImage.src = pathify(themeDir, EntryList.FRAME_TOP_LOGO_IMAGE);
  this.logoImage.width = this.logoImage.srcWidth;
  this.logo.height = this.logoImage.srcHeight;

  var footerMiddleImage;
  
  if (isFilePresent(pathify(themeDir, 
                            EntryList.FRAME_BOTTOM_MIDDLE_STRETCH_IMAGE))) {
    this.footer.setStretchMode(true);
    footerMiddleImage = pathify(themeDir, 
                                EntryList.FRAME_BOTTOM_MIDDLE_STRETCH_IMAGE);
  } else {
    this.footer.setStretchMode(false);    
    footerMiddleImage = pathify(themeDir, EntryList.FRAME_BOTTOM_MIDDLE_IMAGE);
  }

  this.footer.setImages(
      pathify(themeDir, EntryList.FRAME_BOTTOM_LEFT_IMAGE),
      footerMiddleImage,
      pathify(themeDir, EntryList.FRAME_BOTTOM_RIGHT_IMAGE));

  // Setup left border.
  if (isFilePresent(
      pathify(themeDir, EntryList.FRAME_MIDDLE_LEFT_STRETCH_IMAGE))) {
    this.setupVerticalBorder(this.borderLeft, 
        pathify(themeDir, EntryList.FRAME_MIDDLE_LEFT_STRETCH_IMAGE),
        true);
  } else {
    this.setupVerticalBorder(this.borderLeft, 
        pathify(themeDir, EntryList.FRAME_MIDDLE_LEFT_IMAGE),
        false);
  }

  // Setup right border.
  if (isFilePresent(
      pathify(themeDir, EntryList.FRAME_MIDDLE_RIGHT_STRETCH_IMAGE))) {
    this.setupVerticalBorder(this.borderRight, 
        pathify(themeDir, EntryList.FRAME_MIDDLE_RIGHT_STRETCH_IMAGE),
        true);
  } else {
    this.setupVerticalBorder(this.borderRight, 
        pathify(themeDir, EntryList.FRAME_MIDDLE_RIGHT_IMAGE),
        false);
  }

  this.scrollbar.background = pathify(themeDir, 
      EntryList.SCROLLBAR_TRACK_IMAGE);
  this.scrollProgressBar.thumbImage = pathify(themeDir,
      EntryList.SCROLLBAR_THUMB_IMAGE);
  this.scrollProgressBar.emptyImage = pathify(themeDir,
      EntryList.SCROLLBAR_TRACK_IMAGE);
  this.scrollProgressBar.fullImage = pathify(themeDir,
      EntryList.SCROLLBAR_TRACK_IMAGE);

  this.scrollbar.width = getImageDimensions(this.scrollbar.background)[0];
  this.scrollProgressBar.width = this.scrollbar.width;

  this.resize(view.width, view.height);
};

// Loads an image into either left or right border.
// - border: The div representing the border.
// - imagePath: The path to the image.
// - isStretch: Whether to setup the border to stretch or tile when resized.
EntryList.prototype.setupVerticalBorder = function(
    border, imagePath, isStretch) {
  if (isStretch) {
    border.children('stretchImage').src = imagePath;
    border.width = border.children('stretchImage').srcWidth;  
    border.background = '';    
  } else {
    border.background = imagePath;
    border.width = getImageDimensions(border.background)[0];
    border.children('stretchImage').src = '';
  }      
};

// Resizes border to specified height. 
// - border: The div representing the border.
// - height: The new height.
EntryList.prototype.resizeVerticalBorder = function(border, height) {
  border.height = height;
  
  // Determine if it's stretch mode.  
  if (border.children('stretchImage').src) {  
    var stretchImageHeight = border.children('stretchImage').srcHeight;
    if (height > stretchImageHeight) {
      // When image is stretched beyond original size, edge of image fades.
      // Need to extend the image slightly.      
      border.children('stretchImage').height = height + 
          Math.sqrt(height - stretchImageHeight);
    } else {
      border.children('stretchImage').height = height;
    }
  }
};  

// Handles scrolling event (scrollbar changed value).
EntryList.prototype.onScroll = function() {
  // Bounds checks.
  if (this.scrollProgressBar.value < 0) {
    this.scrollProgressBar.value = 0;
  } else if (this.scrollProgressBar.value > 100) {
    this.scrollProgressBar.value = 100;
  }

  var percentage = (this.scrollProgressBar.max - this.scrollProgressBar.value);

  // Calculate the content scroll offset.
  var offset = (percentage / 100) *
               (this.entryList.height - this.entryListViewport.height);

  // Offset the entry list.
  this.entryList.y = -offset;
};

// Handles mousewheel event.
EntryList.prototype.onMouseWheel = function() {
  if (event.wheelDelta > 0) {
    // Up.
    this.scrollProgressBar.value += this.getPageStep();
  } else {
    // Down.
    this.scrollProgressBar.value -= this.getPageStep();
  }

  // No bounds checks here, onScroll will do it.

  // Refresh scrolling.
  this.onScroll();
};

// Calculates the percentage (represented by an int between 0 and 100)
// of total content height that is in one visible page.
EntryList.prototype.getPageStep = function() {
  if (this.entryList.height <= 0) {
    return 0;
  }

  return 100 * (this.entryListViewport.height / this.entryList.height);
};

// Clears entry list and displays a status message.
EntryList.prototype.displayMessage = function(message) {
  this.clearItems();

  // Ensure status message is visible.
  this.statusLabel.visible = true;
  this.statusLabel.innerText = message;
};

// Adds an item to the entry list.
EntryList.prototype.addItem = function(item) {
  debug.trace('Adding entry item.');

  // When there any items, hide status message.
  this.statusLabel.visible = false;

  var listitem = this.entryList.appendElement(this.itemXml);
  var itemHeight = listitem.height;

  listitem.y = itemHeight * this.numItems;
  listitem.onclick = function() { itemOnClick(item); };
  listitem.ondblclick = function() { openEntryInBrowser(item.link); };
  
  var entryHoverBkg = this.entryHoverBkg;
  
  listitem.onmouseover = function() {
    listitem.background = entryHoverBkg;
  };
  listitem.onmouseout = function() { listitem.background = ''; };

  var me = this;
  listitem.onmousewheel = function() { me.onMouseWheel(); };

  this.fillItem(listitem, item);

  ++this.numItems;
  this.entryList.height = itemHeight * this.numItems;
};

// Resize entry list to the given width and height.
EntryList.prototype.resize = function(width, height) {
  this.container.width = width;
  this.container.height = height;

  // Resize the header.
  this.header.resize(width);
  var headerHeight = this.header.getHeight();
  
  // Set title to same height as header.
  this.title.height = headerHeight;

  // Resize and position the footer.
  this.footer.resize(width);
  var footerHeight = this.footer.getHeight();
  var footerY = height - footerHeight;

  this.footer.setY(footerY);

  // Check if footer is overlapping header.
  if (footerY < headerHeight) {
    // It is overlapping, hide the footer.
    this.footer.hide();
  } else {
    this.footer.show();
  }

  // Calculate and store height of content.
  this.contentHeight = height - headerHeight - footerHeight;  
  
  // Width of area that consists of content and scrollbar (if present).
  var contentAndScrollWidth = width - this.borderRight.width -
      this.borderLeft.width;
      
  this.contentWidth = contentAndScrollWidth;
      
  // Set height of entry list viewport.
  // Subtracting 2 to account for vertical padding.
  this.entryListViewport.height = this.contentHeight - 2;
  this.entryListViewport.y = 1;  

  // If the entry list viewport is bigger than the actual entry list.
  if (this.entryListViewport.height > this.entryList.height) {
    // Hide and reset the scrollbar.
    this.scrollbar.visible = false;
    this.scrollProgressBar.value = 100;
  } else {
    this.scrollbar.visible = true;

    // Shorten the content width to account for the visible scrollbar.
    this.contentWidth -= this.scrollbar.width;

    // Resize and position the scrollbar container.
    this.scrollbar.height = this.contentHeight;
    this.scrollbar.x =  width - this.borderRight.width -
        this.scrollProgressBar.width;
    this.scrollbar.y = headerHeight;

    // Resize the progress bar.
    this.scrollProgressBar.height = this.contentHeight;
  }

  // Resize and position the content.
  this.content.height = this.contentHeight;
  this.content.width = this.contentWidth;
  this.content.x = this.borderLeft.width;
  this.content.y = headerHeight;
  
  // Align the title area to the content.
  this.title.x = this.content.x;
  this.title.width = this.content.width;

  if (this.logo) {
    // Center the logo.
    var logoImageWidth = this.logoImage.width;
    var logoX = this.borderLeft.width + 
                ((contentAndScrollWidth - logoImageWidth) / 2);

    // Check if logo overlaps left border.
    if (logoX < this.borderLeft.width) {
      logoX = this.borderLeft.width;
    }

    this.logo.x = logoX;

    // Match the logo width to that of the content (for clipping purposes).
    this.logo.width = contentAndScrollWidth;
  }

  // Padding for entries viewport.
  // Same as content container less four for left & right padding.
  // Don't have to set width of the inner entryList since it is width 100%.
  this.entryListViewport.width = this.content.width - 4;  
  this.entryListViewport.x = 2;  

  // Position the left border.
  this.borderLeft.x = 0;
  this.borderLeft.y = headerHeight;
  // Resize the left border.
  this.resizeVerticalBorder(this.borderLeft, this.contentHeight);
  
  // Position the right border.
  this.borderRight.x = width - this.borderRight.width;
  this.borderRight.y = headerHeight;
  // Resize the right border.
  this.resizeVerticalBorder(this.borderRight, this.contentHeight);  

  this.afterResize();

  // Refresh the scrolling.
  this.onScroll();
};

// Removes all items.
EntryList.prototype.clearItems = function() {
  this.numItems = 0;
  this.entryList.removeAllElements();
};

// Combination of images that will fit a given width.
//
// Consists of 3 images:
//
// [      ][        ][ ]
// ^left   ^middle   ^right
//
// The middle image will be tiled or stretched to ensure all 3 images fill out 
// the specified width.
//
// By default the middle image will tile, but can set to stretch with
// "setStretchMode".
function HorizStretchImage(container) {
  // The container div.
  this.container = container;

  // The left-side image.
  this.left = this.container.children('left');

  // The middle image that will be tiled.
  this.middle = this.container.children('middle');
  this.middle.x = this.left.width;

  // The right-side image.
  this.right = this.container.children('right');
  
  // Whether to tile or stretch the middle.
  this.isStretch = false;
}

HorizStretchImage.prototype.setStretchMode = function(isStretch) {    
  this.isStretch = isStretch;

  this.middle.children('stretchImage').visible = this.isStretch;
};

// Set image sources with provided image paths.
HorizStretchImage.prototype.setImages = function(left, middle, right) {
  this.left.src = left;
  this.left.width = this.left.srcWidth;

  this.container.height = this.left.srcHeight;

  if (this.isStretch) {
    this.middle.children('stretchImage').src = middle;
  } else {
    this.middle.background = middle;
  }

  this.right.src = right;
  this.right.width = this.right.srcWidth;

  // Images have changed, need to resize.
  this.resize(this.container.width);
};

// Resize and stretch to specified width.
HorizStretchImage.prototype.resize = function(width) {
  // Set the width of the container.
  this.container.width = width;

  // Set the width of the middle (background will tile).
  this.middle.width = this.container.width -
      this.left.width - this.right.width;

  if (this.isStretch) {
    var newStretchWidth = this.middle.width;    
    var stretchImg = this.middle.children('stretchImage');
    
    // When image is stretched beyond original size, right edge of image fades.
    // Need to enlarge the image slightly.
    if (newStretchWidth > stretchImg.srcWidth) {
      newStretchWidth += Math.sqrt(newStretchWidth - stretchImg.srcWidth);
    }
    
    stretchImg.width = newStretchWidth;
  }

  this.middle.x = this.left.width;

  // Position the right-side image.
  this.right.x = this.container.width - this.right.width;
};

// Returns the height.
HorizStretchImage.prototype.getHeight = function() {
  return this.container.height;
};

// Set the Y position.
HorizStretchImage.prototype.setY = function(y) {
  this.container.y = y;
};

// Hides the images.
HorizStretchImage.prototype.hide = function() {
  this.container.visible = false;
};

// Unhides the images.
HorizStretchImage.prototype.show = function() {
  this.container.visible = true;
};
