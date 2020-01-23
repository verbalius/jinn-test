jQuery(function($){
  var socket = io();
  socket.on('connect', function() {
      socket.emit('my event', {data: 'I\'m connected!'});
  });
  socket.on('audio_results', function (res) {
    if (res.status==='success') {
      $('p.artist').text(res.artist);
      $('p.title').text(res.title);
    }
    else{
      $('p.artist, p.title').text('ERROR');
    }
  });
});