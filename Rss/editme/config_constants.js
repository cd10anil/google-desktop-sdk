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

// ---------------------- Configuration ------------------------

// Feed URL.
var CONFIG_FEED_URL = 'http://feeds.feedburner.com/GoogleDesktopApis';

// Set to true to add cache-buster (a random URL query parameter)
// to HTTP requests URLs.
//
// Some servers will not like this and your request shall fail.
var CONFIG_CACHE_BUSTER = false;

// Feed refresh interval in ms.
var CONFIG_REFRESH_FEED_MS = 60 * 60 * 1000;

// Maximum feed entries to parse and display.
var CONFIG_MAX_ENTRIES = 10;

// Timeout length for HTTP requests in ms.
var CONFIG_HTTP_REQUEST_TIMEOUT_MS = 5 * 1000;

// Offline mode retry interval in ms.
//
// The gadget enters offline mode when an HTTP request fails.
// When in offline mode, the gadget will retry requests to the server
// more frequently, as set by this configuration value.
//
// Highly recommended this value not be too small. One minute is probably
// the least it should be.
var CONFIG_RETRY_DELAY_MS = 5 * 60 * 1000;

// The directory that contains the theme to be used.
var CONFIG_THEME_DIR = 'default';
