var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

mongoose.connect('mongodb://rajika:miyoungrae123@ds011389.mlab.com:11389/heroku_mk054pc0');

var Post = mongoose.model('Post', { username: String, datetime: String, image: String, likes: Number});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.get('/', function(req, res) {
  res.json({env: 'testing'});
});

//post to funny feed
app.post('/api/post/funnyfeed', multipartMiddleware, function(req, res) {
  var username = req.body.username;
  var time = new Date();
  var image = req.files.image;

  var tmpPath = image.path;
  var targetPath = 'feeds/funny/' + username + '_' + time + image.name;

  fs.rename(tmpPath, targetPath, function(err) {
    if (err) throw err;

    fs.unlink(tmpPath, function() {
      if (err) throw err;
    });
  });

  var post = {
    username: username,
    datetime: time,
    image: targetPath,
    likes: 0,
  };
  
  var newPost = new Post(post);
  newPost.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      Post.find(function(err, onePost) {
        if (err) console.log(err);

        onePost.map(function(item) {
          console.log(item._id + ' ' + item.username);
        });
      });

      res.json({done: true});
    }
  });
});

//retrieves post based on id (mongodb _id)
app.get('/api/post/funnyfeed/:id', function(req, res) {
  var id = req.params.id;

  //search query

  Post.find({_id: id}, function(err, userpost) {
    res.json({ post: userpost[0] });
  });

});

app.get('/api/feed/funny', function(req, res) {
  Post.find(function(err, posts) {
    if (err) console.log(err);

    res.json(posts);
  });
});

app.listen(port, function() {
  console.log('Server running on port %s', port);
});
