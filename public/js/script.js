var noop = function () {};

function sendMessage (user, content, callback) {
  callback = callback || noop;
  $.post('/send', {user: user, content: content})
  .error(callback)
  .success(function (data) {
    callback(null, data);
  });
}

function getMessages (callback) {
  callback = callback || noop;
  $.get('/messages')
  .error(callback)
  .success(function (data) {
    callback(null, data);
  });
}

function messageTemplate (message) {
  return '<li>' + message.user + ': ' + message.content + '</li>';
}

function pollForChanges () {
  getMessages(function (err, messages) {
    if (err) { return console.log(err); }
    $('.messages').empty();
    messages.forEach(function(message) {
      $('.messages').append(messageTemplate(message));
    });
  });
}


$('#submit-message').submit(function (e) {
  e.preventDefault();
  var $contentInput = $(this).find('input[name="content"]');
  var user = $(this).find('input[name="user"]').val();
  var content = $contentInput.val();

  sendMessage(user, content, function (err) {
    if (err) { return console.log(err); }

    $contentInput.val('').focus();
    pollForChanges();
  });
});


var interval = setInterval(pollForChanges, 300);
