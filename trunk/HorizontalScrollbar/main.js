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
 * This gadget demonstrates a horizontal scrollbar control.
 * 
 * Check out "main.xml" to see how the scrollbar is defined.
 * 
 * - The scrollbar must have the enabled property set to "true".
 * - The default scroll bar images are vertically oriented; they won't make sense
 *   for a horizontal scroll bar.  A horizonal scroll bar should define its own
 *   set of images.  Feel free to use the images in this sample for 
 *   your own gadget.
 * - When the scrollbar value changes, an "onchange" event will fire. 
 * - In this example, the image is offset depending on 
 *   the current value of the scrollbar. The scrollbar "max" is set to
 *   the width of the image minus the width of the visible scroll area, 
 *   which is the most the image would ever need to be offset.
 */

/*
 * React to the user manipulating the scroll bar.
 */
function sb_onchange() {
  // Offset the image
  oarfishImg.x = -sb.value;
}
