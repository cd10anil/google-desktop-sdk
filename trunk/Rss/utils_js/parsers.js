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

// ---------------------- Default Parsers ------------------------

// Generates sequential IDs.
//
// Some feeds do not provide entry IDs, however the gadget needs each entry
// to have a unique ID. When parsing a feed and encountering an ID-less entry,
// use this to create an ID.
var IdGenerator = new function() {
  this.nextId = 0;

  this.getNextId = function() {
    return ++this.nextId;
  };
};

// Attempts to automatically parse feed.
// So far can detect and parse basic ATOM and RSS.
//
// A parsed entry is a JS object and contains these fields:
//
// title - The entry title.
// content - The description or summary.
// link - The link to the entry.
//
// And may contain values for these fields:
//
// published - Published date.
// id - Unique identifier for the entry.
//
// When finished, executes callback with array of parsed entries.
function parseFeedDefault(responseText, callback) {
  debug.trace('Default feed parsing.');

  var doc;

  try {
    doc = new DOMDocument();
    doc.loadXML(responseText);
  } catch(e) {
    debug.error('Could not load XML.');
    return;
  }

  // Get the top-level tag name.
  var rootTagName = doc.documentElement.tagName;

  var entries;

  if (rootTagName == 'rss' || rootTagName =='channel') {
    entries = parseRSS20(doc, CONFIG_MAX_ENTRIES);
  } else if (rootTagName == 'rdf:RDF') {
    entries = parseRSS10(doc, CONFIG_MAX_ENTRIES);
  } else if (rootTagName == 'feed') {
    // ATOM has top level "feed" element.
    entries = parseATOM(doc, CONFIG_MAX_ENTRIES);
  } else {
    debug.error('Unrecognized feed type.');
    return;
  }

  callback(entries);
}

// Generic RSS 1.0 parser.
// Returns array of data objects.
function parseRSS10(doc, maxEntries) {
  debug.trace('Parsing RSS 1.0 feed.');
  var entries = [];

  try {
    var entryElements = doc.getElementsByTagName('item');

    for (var i = 0; i < entryElements.length && i < maxEntries; ++i) {
      var entry = entryElements[i];
      var entryData = {};

      // ID.
      entryData['id'] = entry.getAttribute('rdf:about');

      // Entry title.
      entryData['title'] = entry.getElementsByTagName('title')[0].text;

      // Strip any possible HTML from title.
      entryData['title'] = stripHtml(entryData['title']);

      // Publish date.
      if (entry.getElementsByTagName('dc:date').length > 0) {
        var pubDate = entry.getElementsByTagName('dc:date')[0].text;
        entryData['published'] = parseRFC3339(pubDate);
      }

      // Entry content (optional).
      if (entry.getElementsByTagName('description').length > 0) {
        entryData['content'] =
            entry.getElementsByTagName('description')[0].text;
      } else {
        entryData['content'] = entryData['title'];
      }

      // Link.
      entryData['link'] = entry.getElementsByTagName('link')[0].text;

      entries.push(entryData);
    }
  } catch(e) {
    debug.error('Error parsing RSS 1.0 feed: ' + e.message);
    return;
  }

  debug.trace('Successfully parsed ' + entries.length + ' entries.');

  return entries;
}

// Generic RSS 2.0 parser.
// Returns array of data objects.
function parseRSS20(doc, maxEntries) {
  debug.trace('Parsing RSS 2.0 feed.');
  var entries = [];

  try {
    var entryElements = doc.getElementsByTagName('item');

    for (var i = 0; i < entryElements.length && i < maxEntries; ++i) {
      var entry = entryElements[i];
      var entryData = {};

      // ID.
      if (entry.getElementsByTagName('guid').length > 0) {
        entryData['id'] = entry.getElementsByTagName('guid')[0].text;
      } else {
        entryData['id'] = IdGenerator.getNextId();
      }

      // Entry title.
      entryData['title'] = entry.getElementsByTagName('title')[0].text;

      // Strip any possible HTML from title.
      entryData['title'] = stripHtml(entryData['title']);

      // Publish date.
      if (entry.getElementsByTagName('pubDate').length > 0) {
        var pubDate = entry.getElementsByTagName('pubDate')[0].text;
        entryData['published'] = new Date(pubDate);
      }

      // Entry content.
      entryData['content'] = entry.getElementsByTagName('description')[0].text;

      // Link.
      entryData['link'] = entry.getElementsByTagName('link')[0].text;

      entries.push(entryData);
    }
  } catch(e) {
    debug.error('Error parsing RSS 2.0 feed: ' + e.message);
    return;
 }

  debug.trace('Successfully parsed ' + entries.length + ' entries.');

  return entries;
}

// Generic ATOM parser.
// Returns array of data objects.
function parseATOM(doc, maxEntries) {
  debug.trace('Parsing ATOM feed.');
  var entries = [];

  try {
    var entryElements = doc.getElementsByTagName('entry');

    for (var i = 0; i < entryElements.length && i < maxEntries; ++i) {
      var entry = entryElements[i];
      var entryData = {};

      // ID.
      entryData['id'] = entry.getElementsByTagName('id')[0].text;

      // Entry title.
      entryData['title'] = entry.getElementsByTagName('title')[0].text;

      // Strip any possible HTML from title.
      entryData['title'] = stripHtml(entryData['title']);

      // Published.
      var published = entry.getElementsByTagName('published')[0].text;
      entryData['published'] = parseRFC3339(published);

      // Entry content (optional).
      if (entry.getElementsByTagName('content').length > 0) {
        entryData['content'] = entry.getElementsByTagName('content')[0].text;
      } else {
        // Set content to the title.
        entryData['content'] = entryData['title'];
      }

      // Get the alt link.
      var linkElements = entry.getElementsByTagName('link');

      for (var j = 0; j < linkElements.length; ++j) {
        var link = linkElements[j];
        var rel = link.getAttribute('rel');

        if (rel == 'alternate') {
          entryData['link'] = link.getAttribute('href');
        }
      }

      entries.push(entryData);
    }
  } catch(e) {
    debug.error('Error parsing ATOM feed: ' + e.message);
    return;
  }

  debug.trace('Successfully parsed ' + entries.length + ' entries.');

  return entries;
}
