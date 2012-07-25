var fs = require('fs');
var http = require('http');

http.createServer(function(request, response) {
	var currentTime = new Date();
	var newFile = fs.createWriteStream('uploaded_file' + currentTime.getSeconds());
	var fileBytes = request.headers['content-length'];
	var uploadedBytes = 0;
	
	request.pipe(newFile);

	request.on('data', function(chunk) {
		uploadedBytes += chunk.length;
		var progress = (uploadedBytes / fileBytes) * 100;
		response.write("progress : " + parseInt(progress, 10) + "%\n");
	});

	request.on('end', function() {
		response.end('uploaded!!');
	});
}).listen(8080);