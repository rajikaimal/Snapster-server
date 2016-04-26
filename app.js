var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var cloudinary = require('cloudinary');
var cloudinaryConfig = require('./config/cloudinary');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var router = express.Router();
var commentRoutes = require('./routes/comments');

app.use(router);

cloudinary.config({
  cloud_name: 'rajikaimal',
  api_key: '815914566295234',
  api_secret: 'H9x3nzJKnwgxCP7arhR6LNa82s4',
});

mongoose.connect('mongodb://rajikaimal:sicasica123@ds021681.mlab.com:21681/snapster');

var Post = mongoose.model('Post', { username: String, datetime: String, image: String, likes: Number});
var Comment = mongoose.model('Comment', { postid: String, username: String, datetime: String, comment: String});

commentRoutes(router, Comment);


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

  cloudinary.uploader.upload(tmpPath, function(result) {
    console.log(result);
    var post = {
      username: username,
      datetime: time,
      image: 'v' + result.version + '/' + result.public_id,
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
        io.emit('newfunnypost', post);
        res.json({done: true});
      }
    });
  });

  


});

//retrieves post based on id (mongodb _id)
app.get('/api/post/funnyfeed/:id', function(req, res) {
  console.log('Funny feed');
  var id = req.params.id;

  //search query

  Post.find({_id: id}, function(err, userpost) {
    res.json({ post: userpost[0] });
  });

});

app.post('/api/post/funnyfeed/comment', function(req, res) {
  var postid = req.body.postid;
  var username = req.body.username;
  var time = new Date();
  var comment = req.body.comment;

  var comment = {
      postid: postid,
      username: username,
      datetime: time,
      comment: comment
  };

  console.log(comment);

  var newComment = new Comment(comment);
  newComment.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      Comment.find(function(err, onePost) {
        if (err) console.log(err);

        onePost.map(function(item) {
          console.log(item._id + ' ' + item.username);
        });
      });
      res.json({done: true});
    }
  });
});


app.get('/api/feed/funny', function(req, res) {
  Post.find(function(err, posts) {
    if (err) console.log(err);

    res.json(posts);
  });
});

server.listen(port, function() {
  console.log('Server running on port %s', port);
});