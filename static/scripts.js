jQuery(function($){

  $('#tostep2').click(()=>{toStep(2);});
  $('#tostep32').click(()=>{toStep(32);});
  $('#submit-lyrics').click(()=>{
    console.log('[+] Lyrics meta');
    socket.emit('lyrics', $('#lyrics-input').val());
    $('#loader').fadeIn(300);
  });
  $('#submit-lyrics').click(()=>{
    $('#loader').fadeIn(300);
  });
  $('button#reset').click(()=>{$('button#reset').hide();});
  $('.rec-audio, #tostep31').click(()=>{
    recordAudio();
    toStep(31);
  });
});
function toStep(num){
  let selector = '#Step'+num;
  $('.jinn-step.active').fadeOut(200, ()=>{
    $('.jinn-step.active').removeClass('active');
    $(selector).fadeIn(200, ()=>{
      $(selector).addClass('active');
      if ($('.jinn-step.active#Step1').length===0) {
        $('button#reset').show();
      }
    });
  });  
}

// ------------------ socketio section ---------------------
var socket = io.connect();

socket.on('debug', function (res) {
  console.log(res)
});

socket.on('api_results', function (res) {
  console.log('[+] Raw data')
  console.log(res)
  var jeison = JSON.parse(res);
  if (jeison.status === 'success') {
    $('.artist-results').text(jeison.artist);
    $('.title-results').text(jeison.title);
    $('.album-preview').css('background-image', "url('"+jeison.album+"')");
    $('#audio-preview').attr('src', jeison.preview);
    document.getElementById('audio-preview').play();
  }
  else if (jeison.status === 'error') {
    $('.artist-results').text('Not Found');
    $('.title-results').text('Sorry :(');
  }
  else {
    $('.artist-results').text('Internal Error');
    $('.title-results').text('Sorry :(');
  }
  $('#loader').fadeOut(300);
  toStep(4);
});

// ------------------ socketio section ---------------------  

var c = document.getElementById("myCanvas");

var check_if_done = false;

c.width = window.innerWidth;
c.height = window.innerHeight / 100 * 50;

var lines = 7;

var width = c.width;
var height = c.height;
var step = width / lines;

var ctx = c.getContext("2d");
ctx.moveTo(0, height / 2);
ctx.lineTo(width, height / 2);

var gradient = ctx.createLinearGradient(0, 0, c.width, 0);
gradient.addColorStop("0", "#D22280");
gradient.addColorStop("0.5" ,"#621AD3");
gradient.addColorStop("1.0", "#E52372");

ctx.strokeStyle = gradient;

ctx.lineWidth = 3;
ctx.stroke();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var pre_top_center = height / 2;
var pre_top_corner = 0;

async function draw_waves(duration) {
  pre_top_center = height / 2;
  pre_top_corner = 0;

  for (var j = 0; j < duration; j++) {
    for (var k = 0; k < 2; k++) {
        var mirror_coff = 1;
        var mirror_height = 0;

        if (k == 1) {
          mirror_coff = -1;
          mirror_height = c.height;
        }

      for (var i = 0; i < 2; i++) {
        if (i == 1) {
          ctx.setTransform(-1, 0, 0, mirror_coff, c.width, mirror_height);
        } else {
          ctx.setTransform(1, 0, 0, mirror_coff, 0, mirror_height);
        }

        ctx.beginPath();
        ctx.moveTo(0, height / 2);


        ctx.bezierCurveTo(step, height / 2,
                          step, height / 2 + (height / 4 - height / 2) / duration * j,
                          step * 2, height / 2 + (height / 8) / duration * j);


        ctx.bezierCurveTo(step * 3, height / 2 + (height - height / 2) / duration * j,
                          step * 3, height / 2,
                          step * 4 - step / 2, height / 2);

        var gradient = ctx.createLinearGradient(0, 0, c.width, 0);
        if (mirror_coff == 1) {
          gradient.addColorStop("0", "#D22280");
          gradient.addColorStop("0.5" ,"#621AD3");
          gradient.addColorStop("1.0", "#E52372");
        } else {
          gradient.addColorStop("0", "#621AD3");
          gradient.addColorStop("0.5" ,"#D9227B");
          gradient.addColorStop("1.0", "#450F93");
        }

        ctx.strokeStyle = gradient;

        ctx.lineWidth = 3;
        ctx.stroke();
      }

    }

    await sleep(1);
    ctx.clearRect(0, 0, c.width, c.height);
  }

  while (!check_if_done) {
    var top_center = Math.floor(Math.random() * (height / 2 - 3) + 3);
    var top_corner = Math.floor(Math.random() * (height / 2));

    for (var j = 0; j < duration; j++) {
      coff_corner = (top_corner - pre_top_corner) / duration * j;
      coff_center = (top_center - pre_top_center) / duration * j;

      for (var k = 0; k < 2; k++) {
        var mirror_coff = 1;
        var mirror_height = 0;

        if (k == 1) {
          mirror_coff = -1;
          mirror_height = c.height;
        }

        for (var i = 0; i < 2; i++) {
          if (i == 1) {
            ctx.setTransform(-1, 0, 0, mirror_coff, c.width, mirror_height);
          } else {
            ctx.setTransform(1, 0, 0, mirror_coff, 0, mirror_height);
          }

          ctx.beginPath();
          ctx.moveTo(0, height / 2);


          ctx.bezierCurveTo(step, height / 2,
                            step, height / 4 - (pre_top_corner + coff_corner),
                            step * 2, height / 2 + height / 8 - (pre_top_corner + coff_corner) / 2);


          ctx.bezierCurveTo(step * 3, height,
                            step * 3, pre_top_center + coff_center,
                            step * 4 - step / 2, pre_top_center + coff_center);

          var gradient = ctx.createLinearGradient(0, 0, c.width, 0);

          if (mirror_coff == 1) {
            gradient.addColorStop("0", "#D22280");
            gradient.addColorStop("0.5" ,"#621AD3");
            gradient.addColorStop("1.0", "#E52372");
          } else {
            gradient.addColorStop("0", "#621AD3");
            gradient.addColorStop("0.5" ,"#D9227B");
            gradient.addColorStop("1.0", "#450F93");
          }

          ctx.strokeStyle = gradient;

          ctx.lineWidth = 3;
          ctx.stroke();
        }
      }


      await sleep(1);
      ctx.clearRect(0, 0, c.width, c.height);
    }

    pre_top_corner = top_corner;
    pre_top_center = top_center;
  }
}

async function run_timer() {
  var time = 0;
  while (!check_if_done) {
    var minutes = Math.floor(time / 60);
    var seconds = time % 60;
    
    if (minutes < 10) {
      $("#t-minutes").text("0" + minutes);
    } else {
      $("#t-minutes").text(minutes);
    }

    if (seconds < 10) {
      $("#t-seconds").text("0" + seconds);
    } else {
      $("#t-seconds").text(seconds);
    }

    await sleep(1000);
    time++;
  }
}

async function run_loader_text() {
  while (true) {
    $("#loader-text").text("Loading.");
    await sleep(1000);
    $("#loader-text").text("Loading..");
    await sleep(1000);
    $("#loader-text").text("Loading...");
    await sleep(1000);
  }
}

run_loader_text();

$(document).ready(function(){

  $("#stop").hide();
  $("#replay").hide();
  $("#done").hide();

  $("#record").click(function() {
    if (record_permission) {
      $(this).hide();
      $("#replay").hide();
      $("#done").hide();
      $("#stop").show();

      draw_waves(60);

      $(".status").find("p").text("Listening...");

      run_timer();
    } else {
      alert("Please, allow microphone permission first!");
    }
  });

  $("#stop").click(function() {
    $(this).hide();
    $(".status").find("p").text("Done!");
    $("#replay").show();
    $("#done").show();
    check_if_done = true;
  });

  $("#replay").click(function() {
    check_if_done = false;
    $("#record").click();
  });

  if ($(window).width() <= 992) {
    if (!$("#step5-window1").hasClass("banner")) {
      $("#step5-window1").addClass("banner");
    }

    if($("#step5-window2").hasClass("banner")) {
      $("#step5-window2").removeClass("banner");
    }
  }
});


$(window).resize(function() {
  if ($(window).width() > 992) {
    if (!$("#step5-window2").hasClass("banner")) {
      $("#step5-window2").addClass("banner");
    }

    if($("#step5-window1").hasClass("banner")) {
      $("#step5-window1").removeClass("banner");
    }

  } else {
    if (!$("#step5-window1").hasClass("banner")) {
      $("#step5-window1").addClass("banner");
    }

    if($("#step5-window2").hasClass("banner")) {
      $("#step5-window2").removeClass("banner");
    }
  }
});

// ------------------ audio section ---------------------

var recordButton, stopButton, recorder;
var record_permission = false;

function recordAudio () {
  recordButton = document.getElementById('record');
  stopButton = document.getElementById('stop');
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
}

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
  // e.data contains a blob representing the recording           
  console.log('[+] Audio meta')
  console.log(e.data);
  
  var blob = e.data;
  var reader = new FileReader();
  var base64data;
  reader.onload = function () {
    var b64 = reader.result.replace(/^data:.+;base64,/, '');
    socket.emit('audio', b64);
  };
  reader.readAsDataURL(blob);
}