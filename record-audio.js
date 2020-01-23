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

// Check if jQuery is loaded
if (typeof(jQuery)==='function'){
  jQuery(function($){
    recordButton = document.getElementById('record');
    stopButton = document.getElementById('stop');
    // First we check if the connection is secure (if not, typeof mediaDevices will be undefined)
    if (navigator.mediaDevices!==undefined) {
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
      })
      .catch(function (err){
        console.log(err);
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
      console.log(e.data);
      var audioBlobSrc = window.URL.createObjectURL(e.data);
      audio.src = audioBlobSrc;
      audio.play();
      // Convert blob to base64, send it to server to save, on response - make a request to Audd.io API
      var reader = new FileReader();
      reader.readAsDataURL(e.data); 
      reader.onloadend = function() {
        var base64data = reader.result;    
        $.post("audioparser.php", {"audio" : base64data}, function(){
          let auddata = {
            'url': 'https://host.ishchukdev.com/jinn/upload/1579626267.mp3',
            'return': 'timecode,apple_music,deezer,spotify',
            'api_token': '8fb2705870b9e8291b72fbbe6b679a06'
          }
          $.getJSON('https://api.audd.io/?jsonp=?', auddata, function(result){
              console.log(result);
          });
        });
      }
      
    }

  });
}
else{
  console.log('Error! Jquery is not loaded')
}
