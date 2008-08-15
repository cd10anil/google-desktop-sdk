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

var question_info;  // contains the response from the AppEngine server.
var is_loading = true;

function view_onOpen() {
  getNextQuestion();
}

// Fetches a new question from the server and displays it.
function getNextQuestion() {
  is_loading = true;
  question.value = 'Loading question...';
  var req = new XMLHttpRequest();

  // Append a random number to the url so that we do not get the question from
  // the cache.
  req.open('GET', 'http://desktopgadgetsample.appspot.com/question?' +
           Math.random(), true);
  req.onreadystatechange = function() {
    if (req.readyState == 4) {
      if (req.status == 200) {
        onQuestionData(req.responseText);
      } else {
        getNextQuestion();
      }
      req = null;
    }
  };
  req.send();
}

// When user clicks on yes or no, send the information to the server.
function answerQuestion(val) {
  if (is_loading)
    return;

  // Append a random number to the url so that we do not get the question from
  // the cache.
  var vote_url = 'http://desktopgadgetsample.appspot.com/vote?qid=' +
                 question_info.id + '&vote=' + val + '&' + Math.random();
  var req = new XMLHttpRequest();
  req.open('POST', vote_url, true);
  req.onreadystatechange = function() {
    if (req.readyState == 4)
      req = null;
  };
  req.send();

  getNextQuestion();
}

// Called when the question is received from the server.
function onQuestionData(response_text) {
  var data = response_text.split('\n');
  question_info = {};
  question_info.id = data[0];
  question_info.text = data[1];
  question_info.timestamp = data[2];

  question.value = question_info.text;
  resizeGadget();
  is_loading = false;
}

// Reposition the controls to suit the new height and width.
function resizeGadget() {
  question.height = question.IdealBoundingRect.height;
  view.height = question.height + 140;
  yes.y = no.y = skip.y = question.height + 20;
  ask_question.y = top_questions.y = question.height + 55;

  // Determine the gadget's new width and height.
  var width = view.width;
  var height = view.height;

  imgLeft.height = height - (imgTopLeft.height + imgBottomLeft.height);
  imgRight.height = height - (imgTopRight.height + imgBottomRight.height);
  imgTop.width = width - (imgTopRight.width + imgTopLeft.width);
  imgBottom.width = width - (imgBottomRight.width + imgBottomLeft.width);

  // Resize the center.
  frameMiddle.width = width - imgLeft.width - imgRight.width;
  frameMiddle.height = height - imgTop.height - imgBottom.height;
}

var detailsView;

// Create and open a custom details view.
function onTopQuestionsClicked() {
  detailsView = new DetailsView();

  // Create the details view and set its content.
  detailsView.SetContent(
      '',
      undefined,      // Time created
      'top_questions.xml',  // The XML file
      false,          // Whether time is shown as absolute time
      0);             // Content layout flags

  // Set a reference to the "closeDetailsView" function in the detailsViewData
  detailsView.detailsViewData.putValue('closeDetailsView', closeDetailsView);

   // Show the details view
  plugin.ShowDetailsView(detailsView,  // The DetailsView object
      'Top rated questions',      // The title
      gddDetailsViewFlagNone,  // Flags
      onDetailsViewFeedback);  // The handler to call when details view closes
}

function onAskQuestionClicked() {
  detailsView = new DetailsView();

  // Create the details view and set its content.
  detailsView.SetContent(
      '',
      undefined,      // Time created
      'ask_question.xml',  // The XML file
      false,          // Whether time is shown as absolute time
      0);             // Content layout flags

  // Set a reference to the "closeDetailsView" function in the detailsViewData
  detailsView.detailsViewData.putValue('closeDetailsView', closeDetailsView);

   // Show the details view
  plugin.ShowDetailsView(detailsView,  // The DetailsView object
      'Ask question',      // The title
      gddDetailsViewFlagNone,  // Flags
      onDetailsViewFeedback);  // The handler to call when details view closes
}

// Hide and destroy the currently visible details view
function closeDetailsView() {
  plugin.CloseDetailsView();
}

function onDetailsViewFeedback() {
}
