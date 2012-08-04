var express = require('express');
var app 	= express();
var server 	= require('http').createServer(app);
var io 		= require('socket.io').listen(server);
var fs 		= require('fs');

var clientFile	= {};
var clientOtp	= {};

// serve static files(css, image)
app.configure(function() {
	app.use(express.bodyParser({
		uploadDir: __dirname + '/data',
		keepExtensions: true
  	}));
	app.use('/css', 		express.static(__dirname + '/css'));
	app.use('/img', 		express.static(__dirname + '/img'));
	app.use('/data', 		express.static(__dirname + '/data'));
	app.use('/template', 	express.static(__dirname + '/template'));
	app.use('/js', 			express.static(__dirname + '/js'));
});

var cacheClient = function(client, clientCache) {
	clientCache[client.id] = client;

	client.on('disconnect', function() {
		delete clientCache[client.id];
	});	
}

// emit 'uploaded' event to all connected clients
var emitUploadedEvent = function(clientCache, data) {
	for(clientId in clientCache) {
		clientCache[clientId].emit('uploaded', data);
	}	
}

var saveUploadedData = function(path, data) {
	var uploadedData = JSON.stringify(data);

	// save uploaded data to a 'otp_data' file
	fs.appendFile(path, uploadedData + '\n', function(err) {
		if (err) throw err;
	});

	return uploadedData;
}

// handle file_view.html socket event
io.of('/file_socket').on('connection', function(client) {
	console.log('file view client connected!!!');

	cacheClient(client, clientFile);
});

// handle otp_view.html socket event
io.of('/otp_socket').on('connection', function(client) {
	console.log('otp view client connected!!!');

	cacheClient(client, clientOtp);
});

// serve file_view.html
app.get('/file_view', function(req, res) {
	res.sendfile(__dirname + '/file_view.html');

	// 'data' directory does not exists, create it.
	if (!fs.existsSync('./data')) {
		fs.mkdirSync('./data', '0755');
	}
});

// serve otp_view.html
app.get('/otp_view', function(req, res) {
	res.sendfile(__dirname + '/otp_view.html');

	// 'data' directory does not exists, create it.
	if (!fs.existsSync('./data')) {
		fs.mkdirSync('./data', '0755');
	}
});

// handle post reuqest
// this method can be tested with '$curl -F "time=999" -F "appname=bugs" -F "packagename=com.bugs.pc" -F "tel=01036248618" -F "email=chitacan@gmail.com" -F "location=http://maps.google.com/?q=kkkkkkkkk" -F "image=@auto.png" http://localhost:8080/file_upload' 
app.post('/file_upload', function(req, res) {
	console.log('file post requested');

	imageName = req.files.image.name;
	imagePath = __dirname + '/data/' + imageName;

	// rename tempfile to original file name
	fs.rename(req.files.image.path, imagePath);

	var params = {
		time 		: req.param('time'),
		appname 	: req.param('appname'),
		packagename : req.param('packagename'),
		tel 		: req.param('tel'),
		email 		: req.param('email'),
		location 	: req.param('location'),
		imagePath 	: '/data/' + imageName
	};

	var uploadedData = saveUploadedData('./data/file_data', params);

	emitUploadedEvent(clientFile, uploadedData);

	res.send();
});

// handle post reuqest
// this method can be tested with '$curl -d "time=999&appname=bugs&packagename=com.bugs.pc&content=this is content&imei=0000&model=ipad&tel=01036248618&email=chitacan@gmail.com&location=http://maps.google.com/?q=1912,123123" http://localhost:8080/otp_upload'
app.post('/otp_upload', function(req, res) {
	console.log('otp post requested');

	var params = {
		time 		: req.param('time'),
		appname 	: req.param('appname'),
		packagename : req.param('packagename'),
		content 	: req.param('content'),
		imei 		: req.param('imei'),
		model 		: req.param('model'),
		tel 		: req.param('tel'),
		email 		: req.param('email'),
		location 	: req.param('location')
	};

	var uploadedData = saveUploadedData('./data/otp_data', params);

	emitUploadedEvent(clientOtp, uploadedData);

	res.send();
});

server.listen(8080);