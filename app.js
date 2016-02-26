var express = require('express');
var app = express();
var port = process.env.PORT || 80;

app.get('/', function(req,res) {
	console.log('log ...');
	res.send('sample route');
});

app.get('/snap', function(req,res) {
	res.send('Got it !');
});

app.listen(port, function() {
	console.log('Server running on port %s', port);
});