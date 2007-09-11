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

var GOOGLE_LOGO_URL = "http://www.google.com/intl/en/images/logo.gif";

var logoRequest_ = null;

function onOpen() {
  // Start to download the Google logo
  logoRequest_ = new XMLHttpRequest();
  try {
    logoRequest_.open("GET", GOOGLE_LOGO_URL, true);
  } catch (e) {
    // Catch invalid URLs
    statusLabel.innerText = FAILED;
    logoRequest_ = null;
    return;
  }

  // Set the callback for when the downloading is completed (or failed)
  logoRequest_.onreadystatechange = onLogoData;

  // Start the download
  try {
    logoRequest_.send();
  } catch (e) {
    // Catch errors sending the request
    statusLabel.innerText = FAILED;
    logoRequest_ = null;
    return;
  }
}

function onLogoData() {
  // Verify that the download completed
  if (logoRequest_.readyState != 4)
    return;

  // Verify that the download was successful
  if (logoRequest_.status != 200) {
    statusLabel.innerText = FAILED;
    logoRequest_ = null;
    return;
  }

  // Obtain the stream of image data and set it as the image. If you were
  // just downloading text, you could use .responseText to get the text content
  // of the URL you specified.
  imageControl.src = logoRequest_.responseStream;
  imageControl.visible = true;
  statusLabel.visible = false;

  // Destroy the XMLHttpRequest object since it isn't being used anymore
  logoRequest_ = null;
}
