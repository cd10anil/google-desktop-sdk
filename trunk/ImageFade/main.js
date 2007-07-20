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
 * @fileoverview Image Fading Sample
 * 
 * Fading one image or between images is quite a popular effect.
 * It's a subtle and attractive way to draw attention to your gadget.
 * 
 * This effect is typically achieved by employing
 * the "view.beginAnimation" function
 * to call a function that changes the "opacity" property 
 * of an element over time.
 * 
 * Though this example uses the "img" (image) element, 
 * any other gadget element that has "opacity" should suffice.
 * 
 * Please refer to the API documentation for more details.
 */

/**
 * How long the fade effect should last (in milliseconds)
 */
var FADE_DURATION = 3000;
/**
 * Interval (in milliseconds) between fades
 */
var FADE_INTERVAL = 6000;

/**
 * view "onopen" handler
 */
function View_onOpen() {
  // Must call initial fade effect ourselves.
  // "view.setInterval" does not perform an initial call.
  fadeImages();
  // Create run forever timer
  view.setInterval(fadeImages, FADE_INTERVAL);
}  

/**
 * Global variable used by "fadeImages",
 * to keep track of which image will be faded in
 */
var isPuppyTurn = true;

/**
 * Fade the next image in and the previous image out
 */
function fadeImages() {
  var outImage;
  var inImage;
  
  // Determine which image is out and which image is in
  if (isPuppyTurn) {
    outImage = kitty;
    inImage = puppy;    
  } else {
    outImage = puppy;
    inImage = kitty;
  }
  
  // Anonymous closures for the callbacks
  
  view.beginAnimation(function() { setElementOpacity(outImage); }, // callback
                      255, // start value, 255 = full opacity
                      0, // end value, 0 = no opacity or "hidden"
                      FADE_DURATION); // duration in milliseconds

  view.beginAnimation(function() { setElementOpacity(inImage); }, // callback
                      0, // start value 0 = no opacity or "hidden"
                      255, // end value, 255 = full opacity
                      FADE_DURATION); // duration in milliseconds  
                      
  // Setup the next turn                    
  isPuppyTurn = !isPuppyTurn;                   
}

/**
 * To be called by "view.beginAnimation".
 * "event.value" holds the interpolated value between
 * "view.beginAnimation"'s start value and end value parameters.
 * @param {view.BasicElement}
 */
function setElementOpacity(element) {
  element.opacity = event.value;
}

