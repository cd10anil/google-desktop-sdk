// Copyright (c) 2007 Google Inc.
// All rights reserved
// This file is part of the Google Desktop SDK and may be freely copied and used.
// To download the latest version of the SDK please visit
// http://desktop.google.com/
//
// This example shows a simple XML parser that can gracefully 
// handles XML parsing and missing tag errors and also provides 
// easy access to items in the XML via a map-style interface.
//
// NOTE: this parser doesn't get attribute data like attrib1 in this example:
//   <tag attrib1="bob"></tag>
// and it only goes one level deep within an element (so elements with nested nodes
// will not have their data returned below the first level).

function SimpleXmlParser(xmlDoc) {
  this.xmlDoc = xmlDoc;  
  this.parseError = xmlDoc.parseError;
  if (this.parseError.errorCode != 0) {
    debug.error("SimpleXmlParser ERROR: " + this.parseError.reason);
  }
}

SimpleXmlParser.prototype.getItems = function(key) {
  var xmlDoc = this.xmlDoc;
  var items = [];
  if (this.parseError.errorCode != 0) {
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
      } else {
        debug.trace("item " + i + " did not have any child elements. Omitted.")
      }
    }
  }  
  return items;
}

var output = '';
var FEED_URL = 'http://events.berkeley.edu/index.php/rss/sn/pubaff/type/day/tab/all_events.html';

function onOpen() {
  // fetch an RSS feed and parse it
  // NOTE: we do a blocking request here for simplicity (by setting the 3rd argument to false), 
  // but you should NEVER do this in a real gadget, since it will block all other 
  // requests and freeze the sidebar.
  var request = new XMLHttpRequest();
  request.open("GET", FEED_URL, false);
  request.send();
  
  function displayItems(theItems) {
    output += '\n========================================';
    output += '\ngot ' + theItems.length + ' results. Parse errors: ' + parser.parseError.reason;
    for (var i = 0; i < theItems.length; ++i) {
      for (var key in theItems[i]) {
        output += '\nItem ' + i + ' has name:value pair ' + key + ': ' + theItems[i][key];
      }
    }
  }

  if (request.status == 200) {
    var parser = new SimpleXmlParser(request.responseXml);
    
    // get the channel information
    var items = parser.getItems("channel");
    displayItems(items);
    
    // get the items
    items = parser.getItems("item");
    displayItems(items);
  } else {
    debug.error("Request failed. HTTP error code: " + request.status);
  }
  
  // now parse some malformed XML from text 
  var xmlDoc = new DOMDocument();
  xmlDoc.async = false;
  // NOTE: a correct version of this would have </firstname> after Miki
  xmlDoc.loadXML('<name><firstname>Miki<lastname><![CDATA[<sender>Smith</sender>]]></lastname></name>');
  
  var parser = new SimpleXmlParser(xmlDoc);
  
  // since the data is malformed, the parser will output a debug.trace error and return
  // a list of 0 items. you can access the parse error information in parser.parseError
  items = parser.getItems("name");
  displayItems(items);  
}

function onDetailsClick() {
  var htmlDetailsView = new DetailsView();
  htmlDetailsView.html_content = false;
  htmlDetailsView.setContent("", undefined, output, false, 0);

  plugin.showDetailsView(htmlDetailsView, "SimpleXmlParser Output", 0, null);  
}