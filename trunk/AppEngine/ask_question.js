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

// When the user clicks on submit, send the question to the server.
function onSubmitClicked() {
  if (question.value == '')
    return;

  var req = new XMLHttpRequest();
  req.open('POST', 'http://desktopgadgetsample.appspot.com/submit?question=' +
           question.value, true);
  req.onreadystatechange = function() {
    if (req.readyState == 4) {
      if (req.status == 200) {
        var closeDetailsView = detailsViewData.getValue('closeDetailsView');
        closeDetailsView();
      } else {
        onSubmitClicked();
      }
      req = null;
    }
  };
  req.send();
}
