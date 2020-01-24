jQuery(function($){
  $('#tostep2').click(()=>{toStep(2);});
  $('#tostep31').click(()=>{toStep(31);});
  $('#tostep32').click(()=>{toStep(32);});
});
function toStep(num){
  let selector = '#Step'+num;
  $('.jinn-step.active').fadeOut(200, ()=>{
    $('.jinn-step.active').removeClass('active');
    $(selector).fadeIn(200, ()=>{
      $(selector).addClass('active');
    });
  });  
}


var c = document.getElementById("myCanvas");

var check_if_done = false;

c.width = window.innerWidth;
c.height = window.innerHeight / 100 * 60;

var width = c.width;
var height = c.height;
var step = width / 7;

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


var previous_heights = [c.height, c.height, c.height, c.height, c.height, c.height, c.height, c.height];
var duration = 100;
var new_heights = [0, 0, 0, 0, 0, 0, 0, 0]

new_heights[0] = Math.floor(Math.random() * 180) + 3;
new_heights[1] = Math.floor(Math.random() * (220 - 100)) + 100;
new_heights[2] = Math.floor(Math.random() * 180) + 3;
new_heights[3] = Math.floor(Math.random() * (220 - 100)) + 100;
new_heights[4] = Math.floor(Math.random() * 180) + 3;
new_heights[5] = Math.floor(Math.random() * (220 - 100)) + 100;
new_heights[6] = Math.floor(Math.random() * 180) + 3;
new_heights[7] = Math.floor(Math.random() * (220 - 100)) + 100;


console.log(c.height);

async function anim(duration) {
  while (!check_if_done) {
    for(var j = 0; j < duration; j++) {
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.beginPath();
      ctx.moveTo(0, height / 2);

      var height_temp = 0;

      for (var i = 0; i < 8; i = i + 2) {
        var left_p = height_temp / height / 2 * step; 
        var height_q = previous_heights[i] + (new_heights[i] - previous_heights[i]) / duration * j;
        var right_q = height_q / height / 2 * step;
        height_temp = height_q;

        var height_b = previous_heights[i + 1] + (new_heights[i + 1] - previous_heights[i + 1]) / duration * j;
        var height_p = (1 - height_b / height) * step - (1 - height_b / height) * 100;
        
            
        ctx.bezierCurveTo(step * i + height_p + left_p, height * 1.5 - height_b, 
                  step * (i + 1) - height_p - right_q, height * 1.5 - height_b,
                  step * (i + 1), height / 2);

        ctx.quadraticCurveTo(step * (i + 2) - step / 2, - height / 2 + height_q, step * (i + 2), height / 2);
      }

    


      var gradient = ctx.createLinearGradient(0, 0, c.width, 0);
      gradient.addColorStop("0", "#D22280");
      gradient.addColorStop("0.5" ,"#621AD3");
      gradient.addColorStop("1.0", "#E52372");

      ctx.strokeStyle = gradient;

      ctx.lineWidth = 3;
      ctx.stroke();

      await sleep(1);
    }

    for (var i = 0; i < 8; i++) {
      previous_heights[i] = new_heights[i];

      if (i % 2 == 0) {
        new_heights[i] = Math.floor(Math.random() * (c.height - 100 - 10)) + 10;
      } else {
        new_heights[i] = Math.floor(Math.random() * (c.height - 80 - 200)) + 200;
      }
    }
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
      $(this).hide();
      $("#replay").hide();
    $("#done").hide();
      $("#stop").show();
      anim(60);

      $(".status").find("p").text("Слухаю...");

      run_timer();
    });

    $("#stop").click(function() {
      $(this).hide();
      $(".status").find("p").text("Готово!");
      $("#replay").show();
      $("#done").show();
      check_if_done = true;
    });

    $("#replay").click(function() {
      check_if_done = false;
      $("#record").click();
    });
});