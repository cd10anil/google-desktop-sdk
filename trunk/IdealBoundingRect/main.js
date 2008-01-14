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

function onButtonClick(index) {
  var editbox;
  var statusLabel;

  switch (index) {
    case 1:
      editbox = edit1;
      statusLabel = label1;
      break;
    case 2:
      editbox = edit2;
      statusLabel = label2;
      break;
    case 3:
      editbox = edit3;
      statusLabel = label3;
      break;
  }

  var rect = editbox.idealBoundingRect;
  editbox.width = rect.width;
  editbox.height = rect.height;

  statusLabel.innerText = editbox.width + " x " + editbox.height;
}
