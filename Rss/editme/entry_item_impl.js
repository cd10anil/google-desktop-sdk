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

// ---------------------- Custom Code ------------------------

// There are three functions defined here that can be modified to implement
// custom entry items.
//
// 1) parseFeed: Responsible for parsing the feed.
//    Called with the response data after a feed is retrieved.
//    Parses the response text and returns an array of data objects.
//    The data objects will be the contents of the entry list.
//
// 2) EntryList.prototype.fillItem:
//    Responsible for filling in the entry item.
//
//    For example: if your 'listitem.xml' looks like this:
//      <div height="50" width="100%" enabled="true" >
//        <label width="100%" name="foo" />
//      </div>
//
//    Then "fillItem" should set the value of the label:
//      listitem.children('foo').innerText = 'some value';
//
// 3) EntryList.prototype.afterResize: Called after an entry item is added.
//    Typically used to manage layout of entry items.
//
// These functions and "listitem.xml" allow customization of the
// entry list items.

// Parses the feed into an array of data objects.
// Executes callback when finished.
function parseFeed(responseText, callback) {
  debug.trace('Parsing feed.');

  // Call default parsing function that will parse most ATOM and RSS feeds.
  // If you wish to parse manually, remove this line and replace with
  // your own code.  You may be able to copy and modify the code from
  // "parseAtom" or "parseRSS" from utils_js/parsers.js
  parseFeedDefault(responseText, callback);
}

// Fills in the contents of an entry item.
//
// Modify this function if you have entry items with non-standard
// UI elements or custom entry data.
EntryList.prototype.fillItem = function(listitem, item) {
  var title = listitem.children('title');
  var published = listitem.children('published');

  title.innerText = item.title;
  published.innerText = formatDate(item.published);
};

// Called after the EntryList is resized.
// Commonly used to layout entry items.
//
// For example, if you have elements that need to stretch or be positioned
// in a specific manner, you would adjust those elements according to
// the provided width and height.
//
// - width: EntryList width.
// - height: EntryList height.
EntryList.prototype.afterResize = function(width, height) {
};
