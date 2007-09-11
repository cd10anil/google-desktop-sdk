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

var curAudioClip_ = null;

var AUDIO_CLIP_URI = "drums.mp3";

function onTextClick() {
  if (curAudioClip_ == null) {      // Not playing anything
    // Create a new clip and start playing immediately. Using
    // framework.audio.open, you can open a sound file but only play it when
    // you use the .play method on the returned object. The callback method
    // parameter is optional here and when using .open. One final note, the URI
    // can be a file in your GG package, a local file on your computer, or an
    // internet URL to download and play.
    curAudioClip_ = framework.audio.play(AUDIO_CLIP_URI, onAudioStateChange); 
    startedAudio();
  } else {                  // Already playing something
    curAudioClip_.stop();
    curAudioClip_ = null;
    stoppedAudio();
  }
}

function onAudioStateChange(audioClip, state) {
  // This function is called whenever the audio clip starts or stops. See
  // the gddSoundState enumeration for all possible states.
  if (state == gddSoundStateStopped) {
    stoppedAudio();
    curAudioClip_ = null;
  } else if (state == gddSoundStatePlaying) {
    startedAudio();
  }
}

function startedAudio() {
  playStopLabel.innerText = STOP;
}

function stoppedAudio() {
  playStopLabel.innerText = PLAY;
}
