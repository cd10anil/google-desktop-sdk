// Copyright (c) 2006 Google Inc.
// All rights reserved
// 
// This file is part of the Google Desktop SDK and may be freely copied and used.
// To download the latest version of the SDK please visit 
// http://desktop.google.com/

// Interval for updating the friends list
var UPDATE_FRIENDS_INTERVAL = 10000;  // 10 seconds

function onOpen() {
  // Set up Google Talk data handler
  googleTalk.onReceiveTalkData = onTalkDataArrival;

  // Update friends list for the first time
  updateFriends();
  
  // Continue updating the friends list every 10 seconds
  setInterval(updateFriends, UPDATE_FRIENDS_INTERVAL);
}

// Update the list of friends in the UI
function updateFriends() {  
  // Delete all friends from the element list in the UI. container is a div
  // element that was created in the xml.
  var count = container.children.count;
  while (count--) {
    var child = container.children(count);
    container.removeElement(child);
  }

  // Get an array of friends
  var friends = googleTalk.friends.toArray();

  // Loop through all friends and dynamically create a seperate element 
  // for each one.
  for (var i = 0; i <= friends.length - 1; i++) {
    var friend = friends[i];

    var element = container.appendElement("<a x=\"0\" " +
      "y=\"" + (i * 15) + "\" " +
      "color=\"#000080\" font=\"Tahoma\" size=\"8\" " +
      "onClick=\"onClick('" + friend.user_id + "');\" " +
      "onDblClick=\"onDblClick('" + friend.user_id + "');\" />");
    element.tooltip = SEND_MESSAGE_PREFIX + friend.user_id;

    // The status property of the friend object is an integer. Concatenating
    // it to a set prefix results in a string such as "TALK_STATUS_1". Then,
    // this string is used to look up an internationalized string in the
    // strings.xml file (represented by the strings global object).
    element.innerText = friend.name + " (" + strings["TALK_STATUS_" + 
      friend.status] + ")";
  }
}

// Handler for incoming Google Talk data
function onTalkDataArrival(talkFriend, data) {
  alert(DATA_FROM + " " + talkFriend.name +
    " (" + talkFriend.user_id + "):\n\n" + data);
}

// Handler for clicks on the user links
function onClick(talkUserID) {
  // This sends arbitrary data to the counterpart gadget on a friend's sidebar.
  // Note that if the sidebar is closed, or the gadget isn't active, the user
  // is prompted to open the sidebar or install the gadget. In most cases,
  // such as sending a news item, this is desirable. If, however, you wish
  // message delivery to fail silently, you can use the following syntax:
  //  googleTalk.SendTalkDataEx(talk_user_id, 'Data here...',
  //    gddSendDataFlagSilent);
  googleTalk.SendTalkData(talkUserID, DATA);
}

// Handler for double-clicks on the user links
function onDblClick(talkUserID) {
  // This opens a Google Talk conversation window with the specified friend
  googleTalk.SendTalkText(talkUserID, SENT_FROM_GADGET);
}
