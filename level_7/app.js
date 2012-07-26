var redis 		= require('redis');
var redisClient = redis.createClient();

var express = require('express');
var app 	= express();
var server 	= require('http').createServer(app);
var io 		= require('socket.io').listen(server);

io.sockets.on('connection', function(client) {
	console.log('client connected');

	client.on('join', function(data) {
		client.set('nickname', data);

		// notify all user
		client.broadcast.emit('add chatter', data);

		redisClient.smembers('chatters', function(err, names) {
			console.log(names);
			names.forEach(function(name) {
				client.emit('add chatter', name);
			});
		});

		redisClient.sadd('chatters', data);
	});

	client.on('disconnect', function(name) {
		client.get('nickname', function(err, name) {
			console.log('++chatter leaved : ' + name);
			client.broadcast.emit('remove chatter', name);

			redisClient.srem('chatters', name);	
		});
	});


	// handle messages
	client.on('messages', function(data) {
		client.broadcast.emit('messages', data);
	});
});

// serve index.html
app.get('/', function(req, res) {
	res.sendfile(__dirname + '/index.html');
});

server.listen(8080);