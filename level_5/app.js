var express = require('express');
var request = require('request');
var url = require('url');

var app = express.createServer();

app.get('/tweets/:username', function(req, res) {

	var username = req.params.username;

	options = {
		protocol: "http",
		host: "api.twitter.com",
		pathname: '/1/statuses/user_timeline.json',
		query: {screen_name: username, count: 10}
	}

	var twitterUrl = url.format(options);
	request(twitterUrl).pipe(res);
});

app.listen(8080);