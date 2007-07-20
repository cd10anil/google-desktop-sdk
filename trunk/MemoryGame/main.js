// Copyright (c) 2006 Google Inc.
// All rights reserved
// 
// This file is part of the Google Desktop SDK 
// and may be freely copied and used.
// To download the latest version of the SDK please visit 
// http://desktop.google.com/downloadsdksubmit
 
/**
 * @fileoverview MemoryGame gadget
 * 
 * Implements a simple memory game where a sequence of colors 
 * is displayed to the player, and the player must repeat the sequence.
 */
 
/**
 * Handles game state and logic
 * @constructor
 */
function MG_Game() {
  this.listeners_ = [];
  this.sequence_ = [];

  this.reset_();
}

/**
 * Delay in ms between consecutive notifications
 * @type Number
 */
MG_Game.NOTIFICATION_DELAY = 600;

// Color constants
// 
// These constants are used to represent a color
MG_Game.NOCOLOR = null;
MG_Game.BLUE = 0;
MG_Game.RED = 1;
MG_Game.YELLOW = 2;
MG_Game.GREEN = 3;

MG_Game.NUM_COLORS = 4;

// Game state constants

// The game is off
MG_Game.OFF_STATE = 0;

// The game is sending notifications to listeners
// Will ignore incoming color selections
MG_Game.SEND_STATE = 1;

// The game is ready to receive color selections
MG_Game.RECEIVE_STATE = 2;


/**
 * Adds a listener that will be notified of game updates
 * @param {Object} listener Untyped Object, instead must implement this method:
 *      function sendGameUpdate(GameState gameState)
 */
MG_Game.prototype.addListener = function(listener) {
  this.listeners_.push(listener);
};

/**
 * Starts a new game.
 * Will end any current game in progress.
 */
MG_Game.prototype.start = function() {
  this.reset_();
  this.startNextSequence_();
};

/**
 * Sends a color selection to the game
 * @param {Number} color The selected color, (see constants above)
 */
MG_Game.prototype.sendColor = function(color) {
  // Process this color based on current state
  // See state constants above

  if (this.state_ == MG_Game.OFF_STATE) {
    // Start a new game
    this.start();
  } else if (this.state_ == MG_Game.SEND_STATE) {
    // Ignore the color, the game is busy sending notifications
  } else if (this.state_ == MG_Game.RECEIVE_STATE) { 
    if (this.isCorrectColor_(color)) {
      // Advance and listen for the next step
      this.advanceStep_();
      // Notify listeners of accepted color
      this.notify_(new MG_GameState(color));
    } else {
      // Failure!
      this.processDefeat_();
    }
  }
};


// Private methods, hereon

/**
 * Test whether the selected color matches the current color in 
 * the sequence
 * 
 * @param {Number} color The color to test (see constants above)
 * @return {Boolean} The color matches the current color in sequence
 * @private
 */
MG_Game.prototype.isCorrectColor_ = function(color) {
  return this.sequence_[this.step_] == color;
};

/**
 * Resets the game state
 * @private
 */
MG_Game.prototype.reset_ = function() {
  this.step_ = 0;
  this.sequence_.length = 0;
  this.state_ = MG_Game.OFF_STATE;
};

/**
 * Advances the current step to match in the sequence.
 * If the sequence is complete, a new sequence will begin.
 * @private
 */
MG_Game.prototype.advanceStep_ = function() {
  ++this.step_;

  // Check if this sequence is complete
  if (this.step_ >= this.sequence_.length) {
    // Start the next sequence
    this.startNextSequence_();
  }
};

/**
 * Handles defeat
 * @private
 */
MG_Game.prototype.processDefeat_ = function() {
  this.state_ = MG_Game.OFF_STATE;
  this.notifyDefeat_();
};

/**
 * Notifies listeners of defeat
 * @private
 */
MG_Game.prototype.notifyDefeat_ = function() {
  var gameState = new MG_GameState(MG_Game.NO_COLOR);
  gameState.isDefeat = true;
  this.notify_(gameState);
};

/**
 * Increases the sequence and begins notifying listeners.
 * @private
 */
MG_Game.prototype.startNextSequence_ = function() {
  this.state_ = MG_Game.SEND_STATE;
  this.step_ = 0;
  this.increaseSequence_();

  // Wait a specified delay before starting the notification process.
  // The renderer is really dumb, so this is necessary.
  var game = this;
  this.wait_(MG_Game.NOTIFICATION_DELAY, 
             function() { game.notifySequence_(); });
};

/**
 * Increase the sequence by adding a new color
 * @private
 */
MG_Game.prototype.increaseSequence_ = function() {
  this.sequence_.push(this.pickRandomColor_());
};

/**
 * Sends listeners updated game state
 * @param {GameState} gameState The GameState object to send
 * @private
 */
MG_Game.prototype.notify_ = function(gameState) {
  for (var i = 0; i < this.listeners_.length; ++i) {
    var listener = this.listeners_[i];
    listener.sendGameUpdate(gameState);
  }
};

/**
 * Begin notifcation of current sequence
 * @private
 */
MG_Game.prototype.notifySequence_ = function() {
  // Calls this recursive function to handle iteration through the sequence
  this.notifySequenceItem_(0);
};

/**
 * Recursive implementation for notifySequence_
 * Notify listeners of a color in sequence.
 * Calls itself with the next sequence index, if not at the end.
 * If it is at the end, set game to receive state.
 * 
 * @param {Number} index Index into the sequence
 * @private
 */
MG_Game.prototype.notifySequenceItem_ = function(index) {
  this.notify_(new MG_GameState(this.sequence_[index]));

  ++index;

  if (index < this.sequence_.length) {
    // Notify next color in the sequence
    var game = this;
    this.wait_(MG_Game.NOTIFICATION_DELAY, function() { 
      game.notifySequenceItem_(index); 
    });
  } else {
    // We're done, now let's see what the human has in store
    this.state_ = MG_Game.RECEIVE_STATE;
  }
};

/**
 * Picks a color, any color
 * @return {Number} The random color
 * @private
 */ 
MG_Game.prototype.pickRandomColor_ = function() {
  return Math.floor(Math.random() * MG_Game.NUM_COLORS);
};

/**
 * Helper method that waits a specified amount of time 
 * before calling a callback
 * @param {Number} ms Amount of time to wait in ms
 * @param {Function} callback Callback function
 * @private
 */
MG_Game.prototype.wait_ = function(ms, callback) {
  view.setTimeout(callback, ms);
};


/**
 * Packages a game update to be sent to game listener
 * @param {Nummber} activeColor Color that is active, i.e. "turned on"
 * @constructor
 */ 
function MG_GameState(activeColor) {
  this.activeColor = activeColor;
  this.isDefeat = false;
}


/**
 * Renders the game state using the gadget's controls
 * @constructor
 */ 
function MG_Renderer() {
  this.blueButtonControl = new MG_ButtonControl(blueButton, 'blue');
  this.redButtonControl = new MG_ButtonControl(redButton, 'red');
  this.yellowButtonControl = new MG_ButtonControl(yellowButton, 'yellow');
  this.greenButtonControl = new MG_ButtonControl(greenButton, 'green');
  this.buzzerClip = framework.audio.open('buzzer.wav');
}

/**
 * Called by MG_Game to notify of a game update
 */
MG_Renderer.prototype.sendGameUpdate = function(gameState) {
  this.render(gameState);
};

/**
 * Render the game update
 * @see GameState
 */
MG_Renderer.prototype.render = function(gameState) {
  if (gameState.isDefeat) {
    this.buzzerClip.play();
    // Turn on the opaque mask
    mask.visible = true; 
    return;
  }

  mask.visible = false;

  if (gameState.activeColor == MG_Game.BLUE) {
    this.blueButtonControl.play();
  } else if (gameState.activeColor == MG_Game.RED) {
    this.redButtonControl.play();
  } else if (gameState.activeColor == MG_Game.YELLOW) {
    this.yellowButtonControl.play();
  } else if (gameState.activeColor == MG_Game.GREEN) {
    this.greenButtonControl.play();
  } else {
    gadget.debug.warning('No color');
  }
};

/**
 * Controls button rendering
 * @constructor
 */ 
function MG_ButtonControl(button, id) {
  this.button = button;
  this.id = id;  
  this.audioClip = framework.audio.open(this.getSoundFilename()); 
}

/**
 * How long to keep the button turned on (milliseconds)
 * @type Number
 */
MG_ButtonControl.ON_LENGTH = 200;

/**
 * Play (turn-on) the button.
 */ 
MG_ButtonControl.prototype.play = function() {
  this.button.image = this.getOnImage();
  
  var offImage = this.getOffImage();
  var button = this.button;
    
  this.audioClip.stop();
  this.audioClip.play();  

  // Wait to turn button off
  view.setTimeout(function() { 
    button.image = offImage; 
  }, MG_ButtonControl.ON_LENGTH);
};

/**
 * Get the "off" image filename
 * @return {String} The filename
 */
MG_ButtonControl.prototype.getOffImage = function() {
  return this.id + '_off.gif';
};

/**
 * Get the "on" image filename
 * @return {String} The filename
 */
MG_ButtonControl.prototype.getOnImage = function() {
  return this.id + '_on.gif';
};

/**
 * Get the sound filename
 * @return {String} The filename
 */
MG_ButtonControl.prototype.getSoundFilename = function() {
  return this.id + '.wav';
};

// Global MG_game object, instance of MG_Game
var MG_game;

// MG_Gadget "namespace" object
// Contains methods for interacting with the Gadget API
var MG_Gadget = {};

/**
 * View 'onopen' handler.
 * Main entry point.
 */
MG_Gadget.onOpen = function() {
  pluginHelper.onAddCustomMenuItems = MG_Gadget.onAddCustomMenuItems;

  // Create a new Game object
  MG_game = new MG_Game();
  
  // Create the renderer
  var renderer = new MG_Renderer();
  
  // Add the renderer as a listener to the game 
  MG_game.addListener(renderer);

  // Setup game button images
  blueButton.image = 'blue_off.gif';
  redButton.image = 'red_off.gif';
  yellowButton.image = 'yellow_off.gif';
  greenButton.image = 'green_off.gif';

  // Setup button click handlers 
  blueButton.onclick = MG_Gadget.onBlueButtonClick;
  redButton.onclick = MG_Gadget.onRedButtonClick;
  yellowButton.onclick = MG_Gadget.onYellowButtonClick;
  greenButton.onclick = MG_Gadget.onGreenButtonClick;
};

// Gadget button click handlers below

MG_Gadget.onBlueButtonClick = function() {
  MG_game.sendColor(MG_Game.BLUE);
};

MG_Gadget.onRedButtonClick = function() {
  MG_game.sendColor(MG_Game.RED);
};

MG_Gadget.onYellowButtonClick = function() {
  MG_game.sendColor(MG_Game.YELLOW);
};

MG_Gadget.onGreenButtonClick = function() {
  MG_game.sendColor(MG_Game.GREEN);
};

/**
 * Adds a "New Game" menu item to the gadget menu
 * @param {Object} menu Gadget Menu object
 */
MG_Gadget.onAddCustomMenuItems = function(menu) {
  menu.AddItem(NEW_GAME, 0, function() { MG_game.start(); });
};
  
