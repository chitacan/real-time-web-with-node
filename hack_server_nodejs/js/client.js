(function() {
	// get DOM element with jquery
	var content 	= $('#content');
	var template 	= Handlebars.compile( $('#template').html() );

	var url,
		currentPath = window.location.pathname;

	if (currentPath === '/file_view') {
		url = 'http://' + window.location.host + '/file_socket';
	} else if (currentPath === '/otp_view') {
		url = 'http://' + window.location.host + '/otp_socket';
	}

	var showUploadedData = function(res) {
		console.log(res);

		data = JSON.parse(res);

		content.prepend( template(data) );
	}

	var server = io.connect(url);

	server.on('connect', function(res) {
		console.log('connected to ' + url);
	});

	server.on('disconnect', function(res) {
		console.log('disconnected to ' + url);
	});

	server.on('uploaded', function(res) {
		showUploadedData(res);
	});

})();