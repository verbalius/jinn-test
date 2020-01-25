// This example uses MediaRecorder to record from a live audio stream,
// and uses the resulting blob as a source for an audio element.
//
// The relevant functions in use are:
//
// navigator.mediaDevices.getUserMedia -> to get audio stream from microphone
// MediaRecorder (constructor) -> create MediaRecorder instance for a stream
// MediaRecorder.ondataavailable -> event to listen to when the recording is ready
// MediaRecorder.start -> start recording
// MediaRecorder.stop -> stop recording (this will generate a blob of data)
// URL.createObjectURL -> to create a URL from a blob, which we can use as audio src

var recordButton, stopButton, recorder;
var record_permission = false;

window.onload = function () {
  recordButton = document.getElementById('record');
  stopButton = document.getElementById('stop');
  alert('Hello, we are not spies, we only use your mic to record your humming')
  navigator.mediaDevices.getUserMedia({
    audio: true
  })
  // get audio stream from user's mic
  .then(function (stream) {
    record_permission = true;
    recordButton.disabled = false;
    recordButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
    var options;
    recorder = new MediaRecorder(stream); 
    // listen to dataavailable, which gets triggered whenever we have
    // an audio blob available
    recorder.addEventListener('dataavailable', onRecordingReady);
  }).catch(function(err) {
    record_permission = false;
  });
};

function startRecording() {
  if (!record_permission) {
    alert("Please, allow microphone first!");
    return;
  }
  recordButton.disabled = true;
  stopButton.disabled = false;

  recorder.start();
}

function stopRecording() {
  recordButton.disabled = false;
  stopButton.disabled = true;

  // Stopping the recorder will eventually trigger the `dataavailable` event and we can complete the recording process
  recorder.stop();
}

function onRecordingReady(e) {
  var audio = document.getElementById('preview');
  var album = document.getElementsByClassName('album_img');
  // e.data contains a blob representing the recording
  var socket = io.connect('https://' + document.domain + ':' + location.port);             
  console.log(e.data);
  
  var blob = e.data;
  var reader = new FileReader();
  var base64data;
  reader.onload = function () {
    var b64 = reader.result.replace(/^data:.+;base64,/, '');
    socket.emit('audio', b64);
  };
  reader.readAsDataURL(blob);
  
  socket.on('api_results', function (res) {
    var jeison = JSON.parse(res);
    if (jeison.status === 'success') {
      document.getElementsByClassName('artist-results')[0].innerHTML = jeison.artist;
      document.getElementsByClassName('title-results')[0].innerHTML = jeison.title;
      album_img.src = jeison.album;
      audio.src = jeison.preview;
      audio.play();
    }
    else if (jeison.status === 'error') {
      document.getElementsByClassName('artist-result')[0].innerHTML = 'Not found';
      document.getElementsByClassName('title-result')[0].innerHTML = 'Sorry';
    }
    else {
      document.getElementsByClassName('artist-result')[0].innerHTML = 'Sorry';
      document.getElementsByClassName('title-result')[0].innerHTML = ' I\'ve crashed';
    }
  }
}