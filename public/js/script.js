function sendMessage (user, content, callback) {
  $.post('/send', {user: user, content: content})
  .done(callback);
}

function getMessages (callback) {
  $.get('/messages')
  .done(callback);
}

function messageTemplate (message) {
  return '<li>' + message.user + ': ' + message.content + '</li>';
}

function pollForChanges () {
  getMessages(function (messages) {
    $('.messages').empty();
    messages.forEach(function(message) {
      $('.messages').append(messageTemplate(message));
    });
  });
}


$('#submit-message').submit(function (e) {
  e.preventDefault();
  var $contentInput = $('#submit-content');
  var user = $('#submit-user').val();
  var content = $contentInput.val();

  sendMessage(user, content, function () {
    $contentInput.val('').focus();
    pollForChanges();
  });
});


var interval = setInterval(pollForChanges, 300);
