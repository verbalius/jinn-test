jQuery(function($){

  $('#tostep2').click(()=>{toStep(2);});
  $('#tostep31').click(()=>{toStep(31);});
  $('#tostep32').click(()=>{toStep(32);});
  $('button#reset').click(()=>{$('button#reset').hide();});

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
});