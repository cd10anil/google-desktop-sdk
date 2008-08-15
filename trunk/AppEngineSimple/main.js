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
  question.innerText = 'Loading question...';
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
  var     data = response_text.split('\n');
  question_info = {};
  question_info.id = data[0];
  question_info.text = data[1];
  question_info.timestamp = data[2];

  question.innerText = question_info.text;
  is_loading = false;
}
