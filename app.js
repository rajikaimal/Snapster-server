var express = require('express');
var app = express();
var jsonfile = require('jsonfile');
var appendjson = require('appendjson');
var file = './snaps.json';
var port = process.env.PORT || 80;
var fs = require('fs');

app.get('/', function(req, res) {
  console.log('log ...');
  res.send('sample route');
});

app.get('/snap', function(req, res) {
  res.send('Got it !');
});

app.get('/posts', function(req, res) {
  jsonfile.readFile(file, function(err, obj) {
    if (err) throw err;
    var names = obj.posts.map(function(item) {
      return item;
    });

    res.json(names);
  });
});

app.post('/api/post', function(req, res) {
  var post = {
    name: 'Kendall Jenner',
    datetime: '2016-03-19 08-08',
    image: 'imagepath',
    comments: {
      username: 'rajika',
      comment: 'sample comment',
    },
  };
  var posts = fs.readFileSync('./snaps.json');
  var config = JSON.parse(posts);

  config.push(post);

  var configJSON = JSON.stringify(config);

  fs.writeFileSync('./snaps.json', configJSON);
});

app.listen(port, function() {
  console.log('Server running on port %s', port);
});
