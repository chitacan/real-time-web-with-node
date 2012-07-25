var express = require('express');

var app 	= express();
var server 	= require('http').createServer(app);
var io 		= require('socket.io').listen(server);

io.sockets.on('connection', function(client) {
	console.log('client connected');

	// client.emit('messages', {hello:'hello you!!'});
	client.on('messages', function(data) {
		client.broadcast.emit('messages', data);
	});
});

app.get('/', function(req, res) {
	res.sendfile(__dirname + '/index.html');
});

server.listen(8080);