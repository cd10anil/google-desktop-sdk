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

This gadget showcases two very useful image manipulation APIs:

1. img.cropMaintainAspect - Cropping can make images look great in slideshows.
Possible values of the cropMaintainAspect property are
 - "false" (the default)
 - "true"
 - "photo"

A value of "true" maintains the aspect ratio and crops all four sides
so that the image fits in the display rectangle.

The "photo" value is like "true", except that the top of the photo isn't
cropped, since important features such as faces are usually towards
the top of a photo.

2. img.colorMultiply - Permits changing the color of an image at runtime.
*/

function update() {
  cropStatus.innerText = 'crop=' + picbox.cropMaintainAspect;
  multiplyStatus.innerText = 'colorMultiply=' + picbox.colorMultiply;
}
