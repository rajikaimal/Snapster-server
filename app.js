var express = require('express');
var app = express();
var jsonfile = require('jsonfile');
var appendjson = require('appendjson');
var port = process.env.PORT || 3000;
var fs = require('fs');
var bodyParser = require('body-parser');
var file = './snaps.json';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.get('/', function(req, res) {
  res.json({env: 'testing'});
});

app.get('/posts', function(req, res) {
  // jsonfile.readFile(file, function(err, obj) {
  //   if (err) throw err;
  //   var names = obj.posts.map(function(item) {
  //     return item;
  //   });

  //   res.json(names);
  // });
});

app.post('/api/post', function(req, res) {
  var username = req.body.username;
  var time = new Date();
  var image = req.body.image;
  console.log(username);
  var post = {
    name: username,
    datetime: time,
    image: image,
  };
  var posts = fs.readFileSync('./snaps.json');
  var config = JSON.parse(posts);

  config.push(post);

  var configJSON = JSON.stringify(config);

  fs.writeFileSync('./snaps.json', configJSON);
  jsonfile.readFile(file, function(err, obj) {
    if (err) throw err;
    var names = obj.map(function(item) {
      return item;
    });

    res.json(names);
  });
});

app.get('/api/post/:id', function(req, res) {
  var id = req.params.id;
  var posts = fs.readFileSync('./snaps.json');
  var config = JSON.parse(posts);

  config.map(function(post) {
    if (post.name == id) {
      res.json(post);
    }
  });

  //search query
});

app.listen(port, function() {
  console.log('Server running on port %s', port);
});
