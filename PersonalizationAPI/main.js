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

// NOTE: personalizationAPI must be declared in gadget.gmanifest.
// The user will see the "Advanced API" warning message in the install dialog.

function onOpen() {
  // Human readable names for the topics.
  var topicNames = {};
  topicNames[gddTopicIdRealestate] = strings.UNKNOWN;
  topicNames[gddTopicIdBusiness] = strings.BUSINESS;
  topicNames[gddTopicIdFinance] = strings.FINANCE;
  topicNames[gddTopicIdNews] = strings.NEWS;
  topicNames[gddTopicIdKids] = strings.KIDS;
  topicNames[gddTopicIdGames] = strings.GAMES;
  topicNames[gddTopicIdHealth] = strings.HEALTH;
  topicNames[gddTopicIdTravel] = strings.TRAVEL;
  topicNames[gddTopicIdScience] = strings.SCIENCE;
  topicNames[gddTopicIdShopping] = strings.SHOPPING;
  topicNames[gddTopicIdComputers] = strings.COMPUTERS;
  topicNames[gddTopicIdTechnology] = strings.TECHNOLOGY;
  topicNames[gddTopicIdProgrammer] = strings.PROGRAMMER;
  topicNames[gddTopicIdWeblogs] = strings.BLOGS;
  topicNames[gddTopicIdSocial] = strings.SOCIAL;
  topicNames[gddTopicIdSports] = strings.SPORTS;
  topicNames[gddTopicIdEntertainment] = strings.ENTERTAINMENT;
  topicNames[gddTopicIdMovies] = strings.MOVIES;
  topicNames[gddTopicIdTV] = strings.TV;
  topicNames[gddTopicIdCareers] = strings.CAREERS;
  topicNames[gddTopicIdWeather] = strings.WEATHER;
  topicNames[gddTopicIdRealestate] = strings.REAL_ESTATE;

  // Retrieve zip code.
  var zipCode = google.pers.data.getZipCode();
  // Retrieve top three topics.
  var topics = google.pers.data.getPopularTopics(3);

  var summary = strings.YOUR_ZIP_LABEL + ' ' + zipCode + '\n' +
      '\n';

  summary += strings.TOPICS_LABEL + '\n';

  if (topics === undefined) {
    // If Google Desktop has no topic IDs for this user,
    // the return value is undefined.
    summary += strings.UNKNOWN;
  } else {
    // Must call toArray to convert to JavaScript array.
    topicsArray = topics.toArray();

    for (var i = 0; i < topicsArray.length; ++i) {
      summary += topicNames[topicsArray[i]] + '\n';
    }
  }

  textLabel.innerText = summary;
}
