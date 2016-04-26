var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var mongoConfig = require('./config/mongo');
var cloudinary = require('cloudinary');
var cloudinaryConfig = require('./config/cloudinary');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var router = express.Router();
var commentRoutes = require('./routes/comments');
var postRoutes = require('./routes/posts');

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

var Post = mongoose.model('Post', { username: String, datetime: String, image: String, likes: Number });
var Comment = mongoose.model('Comment', { postid: String, username: String, datetime: String, comment: String });

commentRoutes(router, Comment);
postRoutes(router, multipartMiddleware, cloudinary, io, Post);

app.get('/', function (req, res) {
  res.json({ env: 'testing' });
});

server.listen(port, function () {
  console.log('Server running on port %s', port);
});
