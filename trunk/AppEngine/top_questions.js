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

// Keeps track of total amount of height needed for all the questions to be
// displayed.
var total_height = 0;
var num_items = 0;

// When user clicks on Ok, close the details view.
function onOkClicked() {
  var closeDetailsView = detailsViewData.getValue('closeDetailsView');
  closeDetailsView();
}

// Get the list of top questions from the server.
function getTopQuestions() {
  var req = new XMLHttpRequest();

  // Append a random number to the url so that we do not get the list from the
  // cache.
  req.open('GET', 'http://desktopgadgetsample.appspot.com/top?' +
           Math.random(), true);
  req.onreadystatechange = function() {
    if (req.readyState == 4) {
      if (req.status == 200) {
        onTopQuestionsData(req.responseText);
      } else {
        getTopQuestions();
      }
      req = null;
    }
  };
  req.send();
}

function view_onOpen() {
  getTopQuestions();
}

// Called when the list of top questions is received from the server.
function onTopQuestionsData(response_text) {
  var data = response_text.split('\n');
  var n_items = Math.round(data.length / 4);
  for (i = 0; i < n_items; i++) {
    var offset = i * 4;
    addNewItem(data[offset + 0], data[offset + 1], data[offset + 2]);
  }
}

// Adds a new entry into the list of questions that will be displayed.
function addNewItem(question, yes_cnt, no_cnt) {
  var y_pos = total_height + 10;
  num_items++;
  var edit = display_div.appendElement('<edit width="160" wordwrap="true" \
      multiline="true" x="10" y="' + y_pos + '" align="left" \
      background="#DDDDFF" size="8" editable="false" enabled="false" \
      value="' + num_items + ') '+ question + '"/>');
  edit.height = edit.idealBoundingRect.height;
  total_height = y_pos + edit.height;
  display_div.appendElement('<label height="15" width="80" x="170" y="' +
      y_pos + '" align="right"> ' + yes_cnt + ' </label>');
  display_div.appendElement('<label height="15" width="80" x="250" y="' +
      y_pos + '" align="right"> ' + no_cnt + ' </label>');
}