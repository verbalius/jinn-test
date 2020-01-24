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
