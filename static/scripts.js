jQuery(function($){
  // Step 1 => Step 2
  $('#step1ok').click(function(){
    $('#Step1').fadeOut('slow', ()=>{
      $('#Step1').removeClass('d-flex');
      $("#Step2").css("display", "flex").hide().fadeIn();
    })   
  });
  // Step 2 => Step 3
  $('#tostep31').click(function(){
    $("#Step2").fadeOut('slow', ()=>{
      $('#step3-1').fadeIn('slow');
    });
  });
  $('#tostep32').click(function(){
    $("#Step2").fadeOut('slow', ()=>{
      $('#step3-2').fadeIn('slow');
    });
  });
});