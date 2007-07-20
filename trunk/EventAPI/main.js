// Copyright (c) 2006 Google Inc.
// All rights reserved
// 
// This file is part of the Google Desktop SDK and may be freely copied and used.
// To download the latest version of the SDK please visit 
// http://desktop.google.com/

function onLoad() {
  var eventSub = null;
  try {
    // Subscribe with the callback on onNewEvent whenever a new event that
    // matches the criteria comes up. Make sure that your gadget.gmanifest file
    // contains "<eventAPI></eventAPI>" within <about> or else this will cause
    // the subscription to fail.
    eventSub = eventPublisher.Subscribe(onNewEvent);
  } catch (e) {
    // If the subscription fails, eventSub will remain null and that is handled
    // below.
  }

  // If the subscription failed, report this failure
  if (eventSub == null) {
    view.alert(FAILED_EVENT_API);
    return;
  }
            
  // Add the filters (only one is used)
  var filterCollection = eventSub.AddFilter("GoogleDesktop.FilterCollection");
  filterCollection.filter_operator = 1;
  var schemaFilter = filterCollection.AddFilter("GoogleDesktop.SchemaFilter");

  // Monitor webpages
  schemaFilter.Allow("Google.Desktop.WebPage");

  // Start monitoring webpages
  eventSub.active = true;
}

function onNewEvent(data) {
  // The data can sometimes be null, ignore it in that case
  if (data == null)
    return;

  // Obtain the domain name of the webpage being visited
  var domain = getDomainName(data.GetProperty("uri"));

  // Set the content of the website label
  websiteLabel.innerText = domain;
}

// A simple function that uses regexp to get the domain name of the given URL
function getDomainName(url) {
  var matches = url.match(
    /^[^\/]+:\/\/(?:[^@]*@)?(?:www\.)?([\w-]+(?:\.[\w-]+)*)(?:[#\/:\?;].*)?$/
    );
  return matches && matches[1];
}
