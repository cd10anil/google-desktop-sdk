// Copyright (c) 2007 Google Inc.
// All rights reserved
// 
// This file is part of the Google Desktop SDK 
// and may be freely copied and used.
//
// To download the latest version of the SDK please visit 
// http://desktop.google.com/
//
// Our developer support group is at:
// http://groups.google.com/group/Google-Desktop-Developer

/**
 * @fileoverview Fireworks Sample Gadget
 * 
 * UI Elements can be added and removed dynamically from a gadget.
 * The "view" and "div" elements have 
 * "addElement" and "removeElement" methods for this purpose
 *
 * These methods can be used to implement simple drawing and animations
 * as shown in this sample.
 * 
 * This gadget contains three primary objects:
 * 
 * Particle
 *   This object represents a particle that moves in a straight line over time
 *   The particle is actually "drawn" using "addElement" in the container div
 * 
 * Firework
 *   Coordinates the creation and animation of particles
 *   to create a fireworks-like animation 
 *
 * CompoundFirework
 *   Coordinates the animation of an arbritrary number of Firework objects
 */
 
// Firework object on the left
FW_leftFirework = null;
// Main firework object in the center
FW_mainFirework = null;
// Firework object on the right
FW_rightFirework = null;

/**
 * Called by view.onopen
 */
FW_onOpen = function() {
  // Create initial firework objects
  FW_mainFirework = FW_createFirework();  
  FW_leftFirework = FW_createSideFirework(true);  
  FW_rightFirework = FW_createSideFirework(false);  

  // Setup run-forever timer
  view.setInterval(FW_onStep, 250);
};


/**
 * Called by the timer to create Firework objects when neeeded and 
 * move all Firework objects to the next animation frame
 */
FW_onStep = function() {
  // If fireworks indicate they are finished
  // Create and assign brand new firework objects
  if (FW_mainFirework.done) {
    FW_mainFirework = FW_createFirework();  
  }
  if (FW_leftFirework.done) {
    FW_leftFirework = FW_createSideFirework(true);  
  }
  if (FW_rightFirework.done) {
    FW_rightFirework = FW_createSideFirework(false);  
  }
  
  // Clear all display objects
  FW_clear();
  
  // Call next step in animation
  FW_mainFirework.step();
  FW_leftFirework.step();
  FW_rightFirework.step();
};

/**
 * Clears all elements in the container div
 */
FW_clear = function() {
  // NOTE: This is the preferred way to enumerate children of an element
  var e = new Enumerator(sky.children);
  
  while (!e.atEnd()) {
    sky.removeElement(e.item());
    e.moveNext();
  }
};

/**
 * A fireworks factory!
 * 
 * @return {Object} A CompoundFirework object with randomly configured 
 * fireworks
 */
FW_createFirework = function() {
  // Available colors
  var colors = ['#FF0000',
                '#00FF00',
                '#0000FF',
                '#FFFFFF'];                
  
  // Available radii (in pixels)
  var sizes = [30,
               40,
               50,
               60];                

  // How many particles to explode to
  var particleCounts = [8,
                        12,
                        16];                                        

  var x = view.width / 2;
  var beginY = view.height;
  var size = sizes[Utils.getRandom(0, sizes.length)];
  var particleCount = particleCounts[Utils.getRandom(0, particleCounts.length)];    
  var explodeY = view.height - Utils.getRandom(100, 140);
  var steps = Utils.getRandom(12, 16);
  
  var numFireworks = Utils.getRandom(4, 6);
  var fireworks = [];
  
  for (var i = 0; i < numFireworks; ++i) {
    var color = colors[Utils.getRandom(0, colors.length)];
    fireworks.push(new Firework(x, 
                                beginY, 
                                color,
                                size - (i*5),
                                particleCount,
                                explodeY,
                                steps));
  }
  
  return new CompoundFirework(fireworks);  
};

/**
 * A fireworks factory for the side (right/left) fireworks
 * The side fireworks should be smaller and explode at a lower point than main
 * 
 * @param {Boolean} isLeft Specify to create either left or right side firework
 * @return {Object} A CompoundFirework object with randomly configured 
 * fireworks
 */
FW_createSideFirework = function(isLeft) {
  var colors = ['#FF0000',
                '#00FF00',
                '#0000FF',
                '#FFFFFF'];                
  
  var sizes = [20,
               30,
               40];                

  var particleCounts = [8,
                        12,
                        16];                
  
  var x = isLeft ? view.width / 4 : view.width * 3 / 4;
  var beginY = view.height;
  var size = sizes[Utils.getRandom(0, sizes.length)];
  var particleCount = particleCounts[Utils.getRandom(0, particleCounts.length)];  
  var explodeY = view.height - Utils.getRandom(80, 100);
  var steps = Utils.getRandom(12, 16);
  
  var numFireworks = Utils.getRandom(2, 4);
  var fireworks = [];
  
  for (var i = 0; i < numFireworks; ++i) {
    var color = colors[Utils.getRandom(0, colors.length)];
    
    fireworks.push(new Firework(x, 
                                beginY, 
                                color,
                                size - (i*5),
                                particleCount,
                                explodeY,
                                steps));
  }
                                                               
  return new CompoundFirework(fireworks);
};


/**
 * @constructor CompoundFirework
 * @param {Array} fireworks an Array of Firework objects
 */
function CompoundFirework(fireworks) {
  this.fireworks = fireworks;
  this.done = false;
}

/**
 * Animate the next step in the animation
 */
CompoundFirework.prototype.step = function() {
  if (this.done) {
    return;
  }
  
  var fireworksDone = true;
  
  for (var i = 0; i < this.fireworks.length; ++i) {
    var firework = this.fireworks[i];
    
    if (!firework.done) {
      firework.step();
      fireworksDone = false;
    }
  }
  
  if (fireworksDone) {
    this.done = true;
  }  
};


/**
 * @constructor Firework
 * @param {Number} x Initial x coor
 * @param {Number} y Initial y coor
 * @param {String} color Color (6 byte hex string, e.g. #FFFFFF)
 * @param {Number} radius Explosion radius in pixels
 * @param {Number} pieces Number of particles to explode to
 * @param {Number} explodeY Y coor to explode at
 * @param {Number} explodeSteps Number of steps in explosion animation
 */
function Firework(x, y, color, radius, pieces, explodeY, explodeSteps) {
  Firework.SHOOTING = 0;
  Firework.SHOOTING_SIZE = 2;
  Firework.SHOOTING_STEPS = 8;

  Firework.EXPLODING = 1;
  Firework.EXPLODING_SIZE = 2;
  
  this.x = x;
  this.y = y;  
  this.color = color;
  this.radius = radius;
  this.pieces = pieces;
  this.explodeY = explodeY;
  this.explodeSteps = explodeSteps;
  
  this.currentStep = 0;
  this.particles = [];
  this.done = false;
  this.state = Firework.SHOOTING;
  
  this.particles.push(new Particle(this.color, 
                                   Firework.SHOOTING_SIZE,
                                   this.x, 
                                   this.y, 
                                   this.x, 
                                   this.explodeY, 
                                   Firework.SHOOTING_STEPS));
}

/**
 * Animate the next step in the animation
 */
Firework.prototype.step = function() {
  if (this.done) {
    return;
  }
  
  var particlesDone = true;
  
  for (var i = 0; i < this.particles.length; ++i) {
    var particle = this.particles[i];
    
    if (!particle.done) {
      particle.step();
      particle.draw();
      particlesDone = false;
    }
  }
  
  if (particlesDone) {
    if (this.state == Firework.SHOOTING) {
      this.state = Firework.EXPLODING;
      this.explode();
    } else {
      this.done = true;
    }
  }
};

/**
 * Begin the explosion animation
 */
Firework.prototype.explode = function() {
  var radStep = Math.PI * 2 / this.pieces;
  var rad = 0;  
  
  for (var i = 0; i < this.pieces; ++i) {
    var x0 = this.radius;
    var y0 = 0;
    
    var x = Math.cos(rad)*x0 - Math.sin(rad)*y0;
    var y = Math.cos(rad)*y0 + Math.sin(rad)*x0;
    
    x += this.x;
    y += this.explodeY;
    
    this.particles.push(new Particle(this.color, 
                                     Firework.EXPLODING_SIZE, 
                                     this.x, 
                                     this.explodeY, 
                                     x, 
                                     y, 
                                     this.explodeSteps, 
                                     true));    
    rad += radStep;
  }  
};


/**
 * @constructor Particle
 * @param {String} color Color (6 byte hex string, e.g. #FFFFFF)
 * @param {Number} size Width/height of the particle
 * @param {Number} x Initial x coor
 * @param {Number} y Initial y coor 
 * @param {Number} toX Initial Final x coor
 * @param {Number} toY Initial Final y coor 
 * @param {Number} length Number of steps in the animation
 * @param {Boolean} explodeSteps Fade out while animating?
 */
function Particle(color, size, x, y, toX, toY, length, fadeOut) {
  this.color = color;
  this.size = size;
  this.x = x;
  this.y = y;
  this.toX = toX;
  this.toY = toY;
  this.length = length;
  
  this.fadeOut = fadeOut;
  
  this.xDelta = (this.toX - this.x) / this.length;
  this.yDelta = (this.toY - this.y) / this.length;
  
  this.done = false;
  this.currentStep = 0;
}

/**
 * Animate the next step in the animation
 */
Particle.prototype.step = function() {
  if (this.done) {
    return;
  }
  
  this.x += this.xDelta;
  this.y += this.yDelta;  
  this.draw();
  
  ++this.currentStep;
  
  if (this.currentStep >= this.length) {
    this.done = true;
  }
};

/**
 * Draw the particle
 */
Particle.prototype.draw = function() {
  sky.appendElement(this.createElement());
};

/**
 * Create the XML string for the element to be added to the sky
 * @return {String} The XML string
 */
Particle.prototype.createElement = function() {
  var s = '<div ';
  s += 'x="' + this.x + '" ';
  s += 'y="' + this.y + '" ';
  s += 'background="' + this.color + '" ';
  s += 'width="' + this.size + '" ';
  s += 'height="' + this.size + '" ';
  if (this.fadeOut) {
    s += 'opacity="' + (255 - 255*(this.currentStep/this.length)) + '" ';  
  }
  s += '/>';
  return s;
};


/**
 * Utils namespace
 */
var Utils = {};

/**
 * Returns a random integer between min (inclusive) and max (exclusive)
 * Max is exclusive because it's more convenient for our purposes
 * @param {Number} min
 * @param {Number} max
 */
Utils.getRandom = function(min, max) {
  var range = max - min;
  
  return min + Math.floor(Math.random() * range);
};
