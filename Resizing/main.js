/*
Copyright (C) 2008 Google Inc.

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

function onSize() {
  // Determine the gadget's new width and height.
  var width = view.width;
  var height = view.height;

  // No need to reposition the top left corner.

  // Top right corner.
  frameTopRight.x = width - frameTopRight.width;

  // Bottom left corner.
  frameBottomLeft.y = height - frameBottomLeft.height;

  // Bottom right corner.
  frameBottomRight.x = width - frameBottomRight.width;
  frameBottomRight.y = height - frameBottomRight.height;

  // Position and resize the edges.
  frameTop.width = width - frameTopLeft.width - frameTopRight.width;
  frameBottom.width = width - frameBottomLeft.width - frameBottomRight.width;
  frameBottom.y = height - frameBottom.height;
  frameLeft.height = height - frameTopLeft.height - frameBottomLeft.height;
  frameRight.height = height - frameTopRight.height - frameBottomRight.height;
  frameRight.x = width - frameRight.width;

  // Resize the center.
  frameMiddle.width = width - frameLeft.width - frameRight.width;
  frameMiddle.height = height - frameTop.height - frameBottom.height;
}
