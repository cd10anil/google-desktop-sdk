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

// "colorMultiply" is a property of 'img', which can be set at runtime.
//
// You can use "colorMultiply" to add another dimension of customization
// to your gadget.
//
// For example, say you're writing a new clock gadget.
// You can use "colorMultiply" to change the appearance of the clock faces
// or hands.

function multiplyColor() {
  var source = event.srcElement;

  if (source.value) {
    switch (source.name) {
      case 'redButton':
        bkgImage.colorMultiply = '#FF0000';
        break;
      case 'greenButton':
        bkgImage.colorMultiply = '#00FF00';
        break;
      case 'blueButton':
        bkgImage.colorMultiply = '#0000FF';
        break;
    }
  }
}
