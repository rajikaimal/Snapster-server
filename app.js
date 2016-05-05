var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var async = require('async');
var mongoConfig = require('./config/mongo');
var cloudinary = require('cloudinary');
var cloudinaryConfig = require('./config/cloudinary');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var router = express.Router();

var userRoutes = require('./routes/users');
var commentRoutes = require('./routes/comments');
var postRoutes = require('./routes/posts');
var likeRoutes = require('./routes/likes');
var challengeRoutes = require('./routes/challenge');

app.use(router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

cloudinary.config({
  cloud_name: 'rajikaimal',
  api_key: '815914566295234',
  api_secret: 'H9x3nzJKnwgxCP7arhR6LNa82s4',
});

mongoose.connect(mongoConfig.user);

var User = mongoose.model('User', { firstname: String, lastname: String, username: String, email: String, password: String, datetime: String });
var Post = mongoose.model('Post', { username: String, description: String, datetime: String, image: String, likes: Number, type: String });
var Comment = mongoose.model('Comment', { postid: String, username: String, datetime: String, comment: String });
var Like = mongoose.model('Like', { postid: String, username: String, datetime: String });
var Challenge = mongoose.model('Challenge', { postid: String, challenger: String, challengee: String, challengeeUrl: String, challengerUrl: String, likes: Number, datetime: String, done: Boolean,
  createdAt: { type: Date, expires: 10 },
});

userRoutes(router, User, multipartMiddleware);
commentRoutes(router, Comment);
postRoutes(router, multipartMiddleware, cloudinary, io, Post, Like, async);
likeRoutes(router, multipartMiddleware, io, Like, Post);
challengeRoutes(router, multipartMiddleware, io, Challenge, Post, cloudinary);

var connectedUser = {};

io.on('connection', function (socket) {
  socket.on('connecteduser', function (data) {
    console.log(data in connectedUser);
    if ((data != null)) {
      //(!(data in connectedUser)) &&
      socket.username = data;
      connectedUser[socket.username] = socket.id;
      console.log(connectedUser);
    }
  });

  socket.on('like', function (data) {
    var postId = data.postid;
    var username = data.username;
    var time = new Date();

    var like = {
      postid: postId,
      username: username,
      datetime: time,
    };

    var newLike = new Like(like);

    newLike.save(function (err, docs) {
      if (err) console.log(err);

      console.log(docs);
      Like.find({ postid: like.postId }, function (err, docs) {
        if (err)

        console.log(docs);
        socket.broadcast.to(connectedUser[data.gotLikedUsername]).emit('notifylike', { content: docs });
      });
    });
  });

  socket.on('comment', function (data) {
    var postid = data.postid;
    var username = data.username;
    var time = new Date();
    var comment = req.body.comment;

    var comment = {
        postid: postid,
        username: username,
        datetime: time,
        comment: comment,
      };

    console.log(comment);

    var newComment = new Comment(comment);
    newComment.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        io.emit('newfunnycomment', comment);
      }
    });
  });
});

app.get('/', function (req, res) {
  res.json({ env: 'testing' });
});

server.listen(port, function () {
  console.log('Server running on port %s', port);
});
