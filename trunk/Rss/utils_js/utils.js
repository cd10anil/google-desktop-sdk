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

// ---------------------- Utilities ------------------------

// Converts an RFC3339 date time into local time JS Date.
// Returns null on error.
function parseRFC3339(date) {
  var newDate = new Date();

  // Parse date portion.
  // first 10 chars 'XXXX-XX-XX'
  var datePart = date.substring(0, 10);
  datePart = datePart.split("-");

  if (datePart.length != 3) {
    return null;
  }

  newDate.setUTCFullYear(datePart[0]);
  newDate.setUTCMonth(datePart[1] - 1);
  newDate.setUTCDate(datePart[2]);

  // Check for 'T'.
  var tPart = date.substring(10, 11);

  if (tPart != 'T' && tPart != 't') {
    return null;
  }

  // Parse time portion.
  // 'XX:XX:XX'
  var timePart = date.substring(11, 19);
  timePart = timePart.split(":");

  if (timePart.length != 3) {
    return null;
  }

  newDate.setUTCHours(timePart[0]);
  newDate.setUTCMinutes(timePart[1]);
  newDate.setUTCSeconds(timePart[2]);

  var index = 19;
  var dateLen = date.length;

  if (date.charAt(index) == '.') {
    // Consume fractional sec.
    do {
      ++index;
    } while (date.charAt(index) >= '0' &&
             date.charAt(index) <= '9' &&
             index < date.length);
  }

  if (index >= date.length) {
    // No zone to parse;
    return newDate;
  }

  if (date.charAt(index) == 'Z') {
    // No offset.
    return newDate;
  }

  var offsetSign = date.charAt(index);

  if (offsetSign != '+' && offsetSign != '-') {
    return null;
  }

  ++index;

  // Parse offset.
  var offsetPart = date.substring(index, index + 5);

  if (offsetPart.length == 4) {
    // Assume colon-less format.
    var tempOffsetPart = [];
    tempOffsetPart[0] = offsetPart.substr(0, 2);
    tempOffsetPart[1] = offsetPart.substr(2, 2);
    offsetPart = tempOffsetPart;
  } else {
    offsetPart = offsetPart.split(":");
  }

  if (offsetPart.length != 2) {
    return null;
  }

  var offsetSeconds = (Number(offsetPart[0]) * 60) + Number(offsetPart[1]);
  var offsetMs = offsetSeconds * 60 * 1000;

  // Adjust for offset.
  if (offsetSign == '+') {
    newDate.setTime(newDate.getTime() - offsetMs);
  } else {
    newDate.setTime(newDate.getTime() + offsetMs);
  }

  return newDate;
}

// Formats date object similar to how contentarea displays dates, i.e.:
//   - 15 min ago
//   - 3 hrs ago
//   - 5 days ago
//
// Returns empty string on error.
function formatDate(date) {
  if (!date) {
    return '';
  }

  var now = new Date();
  var value;

  // Difference between now and supplied date in ms.
  var diff = now.getTime() - date.getTime();

  // Convert to min.
  diff = diff / (60 * 1000);

  // Less than an hour.
  if (diff < 60) {
    value = Math.floor(diff);
    return value + ' ' + (value > 1 ? strings.MINS_AGO : strings.MIN_AGO);
  }

  // Convert to hours.
  diff = Math.floor(diff / 60);

  // Less than a day.
  if (diff < 24) {
    value = Math.floor(diff);
    return value + ' ' + (value > 1 ? strings.HRS_AGO : strings.HR_AGO);
  }

  // Convert to days.
  value = Math.floor(diff / 24);

  // Default unit is day.
  return value + ' ' + (value > 1 ? strings.DAYS_AGO : strings.DAY_AGO);
}

// Retrieves an online image and executes callback with the response datastream
// as an argument.
function retrieveImage(url, callback) {
  if (!url) {
    debug.warning('Invalid image url: ' + url);
    return;
  }

  debug.trace('Retrieving image: ' + url);

  try {
    var request = new XMLHttpRequest();    request.open('GET', url, true);
    request.onreadystatechange = onReadyStateChange;
    request.send();
  } catch (e) {
    debug.warn('Can\'t retrieve image: ' + url);
    return;
  }

  function onReadyStateChange() {
    if (request.readyState != 4) {
      return;
    }

    if (request.status == 200) {
      callback(request.responseStream);
    }
  }
}

// A shameful way to determine the dimensions (width/height) of an image.
// - path: Path to image.
//
// Returns an array with [width, height].
function getImageDimensions(path) {
  // NOTE: Uses a hidden "img" element defined in "main.xml".
  imgSizer.src = path;

  return [imgSizer.srcWidth, imgSizer.srcHeight];
}

// Strips HTML and decodes common entities.
function stripHtml(s) {
  s = s.replace(/(<([^>]*)>)/ig, '');

  return s;
}

// Determines whether file is present in gadget package.
function isFilePresent(path) {
  var result = gadget.storage.extract(path);
  
  return result !== '';
}

// "Pathify"s filename with given path.
function pathify(path, filename) {
  return path + '\\' + filename;
}

function SimpleXmlParser(xmlDoc) {
  this.xmlDoc = xmlDoc; 
  this.parseError = xmlDoc.parseError;
  if (this.parseError.errorCode !== 0) {
     debug.error("SimpleXmlParser ERROR: " + this.parseError.reason);
  }
}

SimpleXmlParser.prototype.getItems = function(key) {
  var xmlDoc = this.xmlDoc;
  var items = [];
  if (this.parseError.errorCode !== 0) {
     debug.error("SimpleXmlParser ERROR: " + this.parseError.reason);
  } else {
     var objNodeList = xmlDoc.getElementsByTagName(key);
     for (var i = 0; i < objNodeList.length; ++i) {
       var xmlItem = objNodeList.item(i);
       var item = {};
       var added = false;
       for (var j = 0; j < xmlItem.childNodes.length; ++j) {
         var child = xmlItem.childNodes.item(j);
         if (child.childNodes.length > 0) {
           var name = child.nodeName;
           var value = child.childNodes[0].nodeValue;
           item[name] = value;
           added = true;
         }
       }
       if (added) {
         items.push(item);     
       }
     }
  } 
  return items;
};
