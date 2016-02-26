var express = require('express');
var app = express();
var port = 3000;

app.get('/', function(req,res) {
	res.send('sample route');
});

app.get('/snap', function(req,res) {
	res.send('Got it !');
});

app.listen(port, function() {
	console.log('Server running on port %s', port);
});