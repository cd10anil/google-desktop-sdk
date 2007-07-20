// Copyright (c) 2006 Google Inc.
// All rights reserved
// 
// This file is part of the Google Desktop SDK and may be freely copied and used.
// To download the latest version of the SDK please visit 
// http://desktop.google.com/

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
