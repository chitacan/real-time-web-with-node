var http = require('http');

http.createServer(function(req, res) {
	var chunks = [];

	req.addListener('data', function(chunk) {
		chunks.push(chunk);
	});

	req.addListener('end', function() {
		console.log(chunks.toString());
	});
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end();
}).listen(8080);

console.log('Server Started!!');

