var http = require('http');

http.createServer(function(request, response) {
	response.writeHead(200);
	request.on('data', function(chunk) {
		console.log(chunk.toString());
	});
	request.on('end', function() {
		console.log("data end");
	});
}).listen(8080);