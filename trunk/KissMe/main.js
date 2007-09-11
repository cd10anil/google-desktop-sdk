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
 * @fileoverview Kiss Me! gadget
 *
 * This gadget lets the user drag an image into it. Afterward,
 * the gadget reacts when the user clicks the image.
 * 
 * POSSIBLE ENHANCEMENTS/FIXES:
 * - Reduce latency on first kiss.
 * - Use real (but pretty) text for instructions instead of an image.
 * - Add a sound when the picture is dropped onto the gadget. (sighing? harp?)
 * - Let the user disable sound.
 * - Enable erasing the kiss image.
 * - Enable multiple visible kiss images.
 * - Support alternate kiss images.
 * - Support alternate picture frames.
 * - Support alternate sounds.
 * - Enable Photos gadget-style switching between multiple pictures.
 *   (You'd need to save separate kiss location data for each picture.)
 * - Enable image loading by browsing and by entering URLs,
 *   not just drag-and-drop.
 * - Integrate googletalk support -- send your sweetie
 *   a (customizable?) message whenever you kiss the picture!
 */

/* Gadget setup. */
function view_onOpen() {
  sweetiePic.src = options.getValue("picture");

  //If the user has already specified a picture,
  //hide instructions.
  if (sweetiePic.src != '') {
    instructions.src = '';
  }
}

/* Executed when the user clicks the picture. */
function onClick() {
  //Make kissy sound.
  framework.audio.play(strings.KISS_SOUND); //XXX: open then play?

  //Update kiss image location.
  plantKiss(event.x, event.y);
}

/* Puts a kiss image at the specified location. */
function plantKiss(x, y) {
  //Make the kisses a bit askew.
  if (!kiss.visible) { //first time only
    kiss.visible = true;
    kiss.rotation = 15;
  } else {
    kiss.rotation = -kiss.rotation;
  }
    
  //Make the kiss more or less under x,y.
  kiss.pinX = kiss.width/2;
  kiss.pinY = kiss.height/2;
  kiss.x = x + kiss.pinX;
  kiss.y = y + kiss.pinY + 2;
}

/*
 * Executed when the user drags an object over this image.
 * If the object isn't an image file, then this method sets
 * the return value of the event to false so that the object
 * can't be dropped.
 */
function onDragOver() {
  var image = getDraggedImageFile(event.dragFiles);

  //No image found; cancel the default event.
  if (image == null) {
    event.returnValue = false;
    return;
  }
}

/*
 * Executed when the user drops an object.
 * Sets the image, adds a frame around it, and hides the
 * instructions and any visible kiss.
 */
function onDragDrop() {
  sweetiePic.src = getDraggedImageFile(event.dragFiles);
  options.putValue("picture", sweetiePic.src);
  instructions.visible = false;
  kiss.visible = false;
}

/*
 * Used by the onDragOver & onDragDrop methods, this method
 * returns the file that the user just dragged. In the case of
 * a multi-file drag, this method ignores everything but the
 * first file.
 */
function getDraggedImageFile(obj) {
  var file = null;
  
  if (!obj) {
    return file;
  }

  var e = new Enumerator(obj);

  var validExtensions = {
    png: true,
    tif: true,
    tiff: true,
    gif: true,
    jpg: true,
    jpeg: true };
    
  file = e.item();
  var extension = extractExtension(file).toLowerCase();
    
  if (validExtensions[extension] == true) {
    return file;
  }
    
  return null;
}

/* Used by the getDraggedImageFile method. */
function extractExtension(s) {
  return s.substring(s.lastIndexOf('.') + 1); 
}
