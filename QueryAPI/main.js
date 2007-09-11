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

var QUERY = "filetype:mp3";

function onOpen() {
  // Please note that <queryAPI></queryAPI> must be in your gadget.gmanifest or
  // else the Query API will not be loaded.

  // The query is immediately executed when using .Query. If we were to use
  // .QueryEx, the query would only be executed after doing a .Execute. The
  // advantage to using .QueryEx is that you can set the "async" option to
  // true and have an async query instead of freezing the gadget like what
  // happens in this sample gadget.
  var results = queryAPI.Query(QUERY, null, null);

  // Loop through all results (up to a maximum of 5 different artists)
  var curResult = null;
  var finalText = "";
  var takenCount = 0;
  var lastArtist = "";

  while ((curResult = results.Next()) && (takenCount < 5)) {
    // Double check that this is a media file
    if (curResult.schema == "Google.Desktop.MediaFile") {
      // Every schema has different properties. For a media file we're just
      // going to use the artist and title of the song, but there is much other
      // metadata that Google Desktop retrieves and makes available.
      var artist = "";
      var title = "";
      try {
        artist = curResult.GetProperty("artist");
        title = curResult.GetProperty("title");
      } catch (e) {
        // If failed to get either property, move on to the next song
      }

      // Lets not have songs all from the same artist, therefore, look for
      // another artist.
      if ((lastArtist != artist) && (title != "") && (artist != "")) {
        takenCount++;
        lastArtist = artist;
        finalText += title + " - " + artist + "\n";
      }
    }
  }

  // Set the value of the results label
  resultsLabel.innerText = finalText;
}
