// Copyright 2006 Google Inc.
// All Rights Reserved.
// 
// This file is part of the Google Desktop SDK and may be freely copied and used.
// To download the latest version of the SDK please visit 
// http://desktop.google.com/

/**
 * @fileoverview This file contains all of the main functionality
 * of the wireless network selector gadget.  This consists mostly 
 * of ui setup, api calls, and event handlers.
 */

var wifiGadget = new WifiGadget();

/**
 * Wifi gadget class
 */
function WifiGadget() {
  this.wifi = new Wifi();
}

/**
 * Performed on gadget load, sets up defaults.
 */
WifiGadget.prototype.onOpen = function() {
  debug.trace("opening gadget");
  // Handles extra menu options
  plugin.onAddCustomMenuItems = WifiGadget.addCustomMenuItems;

  // Set skin to user choice or default
  options.putDefaultValue("skin1", true);
  options.putDefaultValue("skin2", false);
  options.putDefaultValue("skin3", false);

  // instanciate wifi function namespace
  this.wifi.init();
  this.wifi.checkNetwork();

  elemSkin1.opacity = options("skin1") ? 255 : 0;
  elemSkin2.opacity = options("skin2") ? 255 : 0;
  elemSkin3.opacity = options("skin3") ? 255 : 0;
};

/**
 * Creates custom menu items.
 * @param {Object} menu Menu object passed in by gadget
 */
WifiGadget.addCustomMenuItems = function(menu) {
  menu.AddItem(SKIN1, options("skin1") ? gddMenuItemFlagChecked : 0, 
               WifiGadget.chooseSkin1);
  menu.AddItem(SKIN2, options("skin2") ? gddMenuItemFlagChecked : 0, 
               WifiGadget.chooseSkin2);
  menu.AddItem(SKIN3, options("skin3") ? gddMenuItemFlagChecked : 0, 
               WifiGadget.chooseSkin3);
};

// Custom menu item handlers
WifiGadget.chooseSkin1 = function() {
  debug.trace("skin 1 chosen");
  if (!options("skin1")) {
    options("skin1") = true;
    options("skin2") = false;
    options("skin3") = false;
    Wifi.changeSkin('1');
  }
};
WifiGadget.chooseSkin2 = function() {
  debug.trace("skin 2 chosen");
  if (!options("skin2")) {
    options("skin1") = false;
    options("skin2") = true;
    options("skin3") = false;
    Wifi.changeSkin('2');
  }
};
WifiGadget.chooseSkin3 = function() {
  debug.trace("skin 3 chosen");
  if (!options("skin3")) {
    options("skin1") = false;
    options("skin2") = false;
    options("skin3") = true;
    Wifi.changeSkin('3');
  }
};


/**
 * Wifi function class
 */
function Wifi() {
  // Vars holding gadget state.
  this.connectedState = 0; // 1 for connecting, 2 for connected
  this.selectionBox = null; 

  // Member vars that help track a connection attempt.
  this.connectionToken = null; 
  this.connectionChecks = null; 
  this.connectionTimeout = null; 

  // Points to selection box object
  this.selectionBox = null;
}

// Member consts

// Polling intervals
Wifi.CONNECTING_POLLING_INTERVAL = 1000;
Wifi.CONNECTED_POLLING_INTERVAL = 2000;
Wifi.DISCONNECTED_POLLING_INTERVAL = 5000; 
Wifi.TIMEOUT = 45; //in CONNECTING_POLLING_INTERVAL units

// Globals used for skin animation.
Wifi.currentSkin = null;
Wifi.oldSkin = null;
Wifi.newSkin = null; 


/**
 * Create box, set default sizes for ui elements.
 */
Wifi.prototype.init = function() {
  var me = this;
  elemScroll.onchange = function() { me.onScrollChange(); };
  elemScrollDown.onclick = function() { me.moveSelection('down'); };
  elemScrollUp.onclick = function() { me.moveSelection('up'); };
  elemConnectButton.onclick = function() { me.doConnect(); };
  elemDisconnectButton.onclick = function() { me.doDisconnect(); };
  elemCancelButton.onclick = function() { me.doCancel(); };

  elemSelectionDiv.x = elemMainArea.x;
  elemSelectionDiv.y = elemMainArea.y + 1;
  elemSelectionDiv.width = elemMainArea.width;
  elemSelectionDiv.height = elemMainArea.height;

  elemDisplayArea.x = elemMainArea.x;
  elemDisplayArea.y = elemMainArea.y;
  elemDisplayArea.width = elemMainArea.width;
  elemDisplayArea.height = elemMainArea.height;
  
  // Instantiate selection box object after setup.
  this.selectionBox = new SelectionBox(elemSelectionDiv);

  // Set current skin to user preference.
  if (options("skin1")) {
    Wifi.currentSkin = elemSkin1;
  } else if (options("skin2")) {
    Wifi.currentSkin = elemSkin2;
  } else if (options("skin3")) {
    Wifi.currentSkin = elemSkin3;
  }
};

/**
 * Check if the network is connected, change display accordingly.
 */
Wifi.prototype.checkNetwork = function() {
  var connected = system.network.wireless.connected;
  debug.trace("online? " + system.network.online);
  debug.trace("connection type? " + system.network.connectionType);
  debug.trace("Physical: " + system.network.physicalMediaType);
  debug.trace("Enum supported: " + 
              system.network.wireless.enumerationSupported);
  debug.trace("On Wireless? " + system.network.wireless.connected);
  debug.trace("networkName: " + system.network.wireless.networkName);
  debug.trace("name: " + system.network.wireless.name);

  if (connected) {
    this.displayConnected();
  } else {
    this.displayDisconnected(false);
  }
};

/**
 * Animate to new skin choice.
 * @param {String} skin Represents a skin, '1', '2', or '3'
 */
Wifi.changeSkin = function(skin) {
  Wifi.oldSkin = Wifi.currentSkin;
  if (skin == '1') {
    Wifi.newSkin = elemSkin1;
    elemConnectionLabel.color = "#f2f2f2";
    elemNetworkName.color = "#f2f2f2";
    debug.trace("changing to skin1");
  }
  if (skin == '2') {
    Wifi.newSkin = elemSkin2;
    elemConnectionLabel.color = "#f2f2f2";
    elemNetworkName.color = "#f2f2f2";
    debug.trace("changing to skin2");
  }
  if (skin == '3') {
    Wifi.newSkin = elemSkin3;
    elemConnectionLabel.color = "#000000";
    elemNetworkName.color = "#000000";
    debug.trace("changing to skin3");
  }

  beginAnimation(Wifi.animateSkin, 0, 355, 500);
  Wifi.currentSkin = Wifi.newSkin;
};

/**
 * Animate by fading out current skin and fading in new skin.
 */
Wifi.animateSkin = function() {
  Wifi.oldSkin.opacity = Math.min(355 - event.value, 255);
  Wifi.newSkin.opacity = Math.min(event.value, 255);
};

/**
 * Animate between ui states
 */
Wifi.animateConnect = function() {
  elemSelectionDiv.opacity = 255 - event.value;
  elemDisplayArea.opacity = event.value;
};

/**
 * Change display elements to connecting state.
 */
Wifi.prototype.displayConnecting = function() {
  this.connectedState = 1;

  elemConnectButton.visible = false;
  elemCancelButton.enabled = true;
  elemConnectionLabel.innerText = CONNECTING_TO;
  elemNetworkName.innerText = this.selectionBox.selected().name + " ...";
  elemSignalStrength.visible = false;
  elemStrPercent.visible = false;
  elemConnectingProgress.visible = true;
  elemConnectingProgress.width = 8;

  // Poll while connecting for completed connection.
  this.connectionChecks = 0;
  this.connectionTimeout = 0;
  clearInterval(this.connectionToken);
  var me = this;
  this.connectionToken = setInterval(function() { me.checkConnecting(); }, 
                                     Wifi.CONNECTING_POLLING_INTERVAL);
    
  // Transition smoothly between ui states
  beginAnimation(Wifi.animateConnect, 0, 255, 250);
};

/**
 * Change display elements to to connected state.
 */
Wifi.prototype.displayConnected = function() {
  this.connectedState = 2;

  elemDisplayArea.opacity = 255;
  elemSelectionDiv.opacity = 0;
  elemConnectButton.visible = false;
  elemCancelButton.visible = false;
  elemDisconnectButton.visible = true;
  elemConnectionLabel.innerText = CONNECTED_TO;
  elemConnectingProgress.visible = false;
  elemSignalStrength.visible = true;
  elemStrPercent.visible = true;

  // Update connection status and signal strength.
  this.updateConnectionInfo();

  // Poll for new info about connection.
  clearInterval(this.connectionToken);
  var me = this;
  this.connectionToken = setInterval(function() { me.checkConnection(); }, 
                                     Wifi.CONNECTED_POLLING_INTERVAL);
};

/**
 * Change display elements to disconnected state.
 * @param {Boolean} animate True if an animation is necessary for state change
 */
Wifi.prototype.displayDisconnected = function(animate) {
  debug.trace("it's disconnected...");

  this.connectedState = 0;

  elemConnectButton.visible = true;
  elemCancelButton.visible = true;
  elemCancelButton.enabled = false;
  elemDisconnectButton.visible = false;

  // Update network list.
  this.updateNetworks();

  // Poll for new connections while disconnected.
  clearInterval(this.connectionToken);
  var me = this;
  this.connectionToken = setInterval(function() { me.checkDisconnected(); }, 
                                     Wifi.DISCONNECTED_POLLING_INTERVAL);

  if (animate) {
    beginAnimation(Wifi.animateConnect, 255, 0, 250);
  } else {
    elemSelectionDiv.opacity = 255;
  }
};

/**
 * Check if connection is complete.
 */
Wifi.prototype.checkConnecting = function() {
  this.connectionChecks = (this.connectionChecks + 1) % 15;
  var connected = system.network.wireless.connected;
    
  // If connected, update display.
  if (connected) {
    this.displayConnected();
  }

  // If connection timed out, go back to disconnected state.
  if (this.connectionTimeout > Wifi.TIMEOUT) {
    this.doCancel();
  }
    
  elemConnectingProgress.width = (this.connectionChecks + 1) * 8;
  this.connectionTimeout++;
};

/**
 * Check if connection is still active and if so, update signal strength.
 */
Wifi.prototype.checkConnection = function() {
  // Check if still connected.
  var connected = system.network.wireless.connected;

  // If connected, update info.
  if (connected) {
    this.updateConnectionInfo();
  }

  if (!connected) {
    this.displayDisconnected(true);
  }
};

/**
 * Check if connection state is still disconnected.
 */
Wifi.prototype.checkDisconnected = function() {
  var connected = system.network.wireless.connected;

  // If not disconnected, update display.
  if (connected) {
    this.displayConnected();
  }
};

/**
 * Initiate connect to selected network.
 */
Wifi.prototype.doConnect = function() {
  var selected = this.selectionBox.selected();
  if (!selected) {
    return;
  }

  // Start connecting to selected network.
  debug.trace("connecting to: " + selected.name);
  var me = this;
  selected.connect(function() { me.connectStatus(); });

  // Update connection display state.
  this.displayConnecting();
};

/**
 * Cancel connection attempt.
 */
Wifi.prototype.doCancel = function() {
  if (this.connectedState == 1) {
    var selected = this.selectionBox.selected();
    var me = this;
    selected.disconnect(function() { me.connectStatus(); });
    this.displayDisconnected(true);
  }
};

/**
 * Disconnect from current wifi network.
 */
Wifi.prototype.doDisconnect = function() {
  // If network is not connected, just update display.
  if (!system.network.wireless.connected) {
    this.displayDisconnected(true);
    return;
  }

  // If network is not enumerable, disconnect won't be supported.
  if (!system.network.wireless.enumerationSupported) {
    debug.trace("can't support disconnect");
    return;
  }

  // Disconnect via name, but if there is a problem getting the name,
  // disconnect by other methods if possible.
  var wifi = system.network.wireless;
    
  try {
    if (wifi.networkName !== '') {
      debug.trace("disconnect by name: " + wifi.networkName);
      var me = this;
      system.network.wireless.disconnect(wifi.networkName, 
                                         function() { me.connectStatus(); });
    } 

    // Else cases in case the API can't find the network name, or if the
    // network is nameless.
    else if (this.selectionBox.selected()) {
      debug.trace("disconnect by selection: " + 
                  this.selectionBox.selected().name);
      var me = this;
      this.selectionBox.selected().disconnect(function() { 
        me.connectStatus(); 
      });
    } else {
      // On failure just try calling disconnect on any network.
      // It will work if it's seen by the same device.
      var list = system.network.wireless.enumerateAvailableAccessPoints;
      var e = new Enumerator(list);
      debug.trace("disconnect by first on list: " + e.item().name);
      var me = this;
      e.item().disconnect(function() { me.connectStatus(); }); 
    }
  }
  catch(e) {
    debug.error("can't disconnect");
  }

  if (!wifi.connected) {
    debug.trace("already disconnected");
    this.displayDisconnected(true);
  } else {
    debug.trace("waiting to disconnect");
  }
};

/**
 * This handles user changes in the scroll bar.
 */
Wifi.prototype.onScrollChange = function() {
  var newValue;
  newValue = Math.round((elemScroll.max - elemScroll.value) / 10);
  this.selectionBox.moveTo(newValue);
};

/**
 * Get info about available networks.
 */
Wifi.prototype.updateNetworks = function() {
  debug.trace("trying to display available networks");

  var enumerable = system.network.wireless.enumerationSupported;

  if (enumerable) {
    this.selectionBox.clearListings();

    var filterList = new Array();
    var list = system.network.wireless.enumerateAvailableAccessPoints;
    var e = new Enumerator(list);
    for(; !e.atEnd(); e.moveNext()) {
      var name = e.item().name === "" ? UNNAMED : e.item().name;
      if (!filterList[name] || e.item().signalStrength > 
                               filterList[name].signalStrength) {
        filterList[name] = e.item();
      }
    }

    var count = 0;
    for (var i in filterList) {
      this.selectionBox.addSelection(i, filterList[i], 
                                     filterList[i].signalStrength);
      count++;
    }

    if (count === 0) {
      elemDefaultMessage.visible = true;
      elemDefaultMessage.innerText = DEFAULT_TEXT;
      elemConnectButton.enabled = false;
    } else {
      elemDefaultMessage.visible = false;
      elemConnectButton.enabled = true;
    }

    // 3 is the number of listings that fit in the window,
    // and 10 is extra granularity for smooth scrolling
    elemScroll.max = Math.max(0, (count - 3) * 10);
    elemScroll.value = elemScroll.max;
  }

  // Display some default message if there is no enumerable network.
  if (!enumerable) {
    elemDefaultMessage.visible = true;
    elemDefaultMessage.innerText = DEFAULT_TEXT2;
    elemConnectButton.enabled = false;
    elemCancelButton.enabled = false;
  }

  if (elemScroll.max > 0) {
    elemScroll.visible = true;
  } else {
    elemScroll.visible = false;
  }
};

/**
 * Update display info about connection.
 */
Wifi.prototype.updateConnectionInfo = function() {
  var wifi = system.network.wireless;

  debug.trace("network '" + wifi.networkName + "' is at " + 
      wifi.signalStrength + "%");
  var signal = wifi.signalStrength;
  var name = wifi.networkName;

  // Find wifi name, and fail to selected name.
  if (name === "") {
    if (this.selectionBox.selected()) {
      name = this.selectionBox.selected().name;
    } else {
      name = UNNAMED;
    }
  }
    
  // Update labels to reflect new connection status.
  if (elemConnectionLabel.innerText != CONNECTED_TO) {
    elemConnectionLabel.innerText = CONNECTED_TO;
  }

  if (elemNetworkName.innerText != name) {
    elemNetworkName.innerText = name;
  }

  if (elemStrPercent.innerText != (signal + '%')) {
    elemStrPercent.innerText = signal + '%';
    elemSignalStrength.width = Math.round(signal / 10) * 9 - 3;
  }
};

/**
 * Connection returns to this function after attempt, but doesn't
 * give any useful information.
 * @param {Boolean} Status value returned by connection callback
 */
Wifi.prototype.connectStatus = function(status) {
  debug.trace("Connection status has returned: " + status);
};

/**
 * Passing mouse events to selection box. (single click on item)
 * @param {Number} Index of the selected item
 */
Wifi.prototype.makeSelection = function(selectionNumber) {
  this.selectionBox.select(selectionNumber);
};

/**
 * Passing mouse events to selection box. (box nav buttons)
 * @param {String} Direction of move 'up' or 'down'
 */
Wifi.prototype.moveSelection = function(direction) {
  this.selectionBox.move(direction);
};

/**
 * Handle mouse events for selection area. (single click on item)
 * @param {Number} Index of the selected item
 */
function makeSelection(selectionNumber) {
  debug.trace("select: " + selectionNumber);
  wifiGadget.wifi.makeSelection(selectionNumber);
}

/**
 * Handle mouse events for selection area. (box nav buttons)
 * @param {String} Direction of move 'up' or 'down'
 */
function moveSelection(direction) {
  debug.trace("move " + direction);
  wifiGadget.wifi.moveSelection(direction);
}
