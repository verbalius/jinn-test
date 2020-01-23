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

window.onload = function () {
  recordButton = document.getElementById('record');
  stopButton = document.getElementById('stop');

  // get audio stream from user's mic
  navigator.mediaDevices.getUserMedia({
    audio: true
  })
  .then(function (stream) {
    recordButton.disabled = false;
    recordButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
    var options;
    recorder = new MediaRecorder(stream);
    // listen to dataavailable, which gets triggered whenever we have
    // an audio blob available
    recorder.addEventListener('dataavailable', onRecordingReady);
  });
};

function startRecording() {
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
  var audio = document.getElementById('audio');
  // e.data contains a blob representing the recording
  var socket = io.connect('https://' + document.domain + ':' + location.port);             
  console.log(e.data);
  
  var blob = e.data
  var reader = new FileReader();
  var base64data
  reader.onload = function () {
    var b64 = reader.result.replace(/^data:.+;base64,/, '');
    socket.emit('audio', b64);
  };
  reader.readAsDataURL(blob);
  
  socket.on('audio_results', function (res) {
    console.log(res)
    if (res.status==='success') {
      document.getElementsByClassName('artist')[0].innerHTML = res.artist;
      document.getElementsByClassName('title')[0].innerHTML = res.title;
    }
    else{
      document.getElementsByClassName('artist')[0].innerHTML = 'error';
      document.getElementsByClassName('title')[0].innerHTML = 'error';
    }
  });

  socket.on('info', function (res) {
    console.log(res);
  });
  
  audio.src = URL.createObjectURL(e.data);
  audio.play();
}
