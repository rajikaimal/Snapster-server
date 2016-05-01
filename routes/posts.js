var express = require('express');

var calls = [];

var postRouter = function (router, multipartMiddleware, cloudinary, io, Post, Like, async) {
  router.get('/api/feed/funny', function (req, res) {
    var username = req.query.username;
    console.log('requesting ' + username);
    Post.find({ type: 'funny' }, function (err, posts) {
      if (err) console.log(err);

      calls = [];

      posts.forEach(function(post) {
        calls.push(function(callback) {
          Like.find({ postid: post._id, username: username }, function (err, userLike) {
            if (err) {
              console.log(err);
            } else {
              if(userLike != '') {
                post.set('likestate', true, { strict: false });
                //res.json(post);
                
              }
              else {
                post.set('likestate', false, { strict: false });
                
              }
              callback(null, post);
            }
          });   
        });
      });
      async.parallel(calls, function(err, result) {
        if (err)
            return console.log(err);
        
        res.json(result);
      });

    });
  })

  .get('/api/post/funnyfeed/:id', function (req, res) {
    console.log('Funny feed');
    var id = req.params.id;

    //search query

    Post.find({ _id: id }, function (err, userpost) {
      res.json({ post: userpost[0] });
    });

  })

  .post('/api/post/funnyfeed', multipartMiddleware, function (req, res) {

    var username = req.body.username;
    var description = req.body.description;
    var time = new Date();
    var image = req.files.image;
    var type = 'funny';

    var tmpPath = image.path;

    cloudinary.uploader.upload(tmpPath, function (result) {
      console.log(result);
      var post = {
        username: username,
        description: description,
        datetime: time,
        image: 'v' + result.version + '/' + result.public_id,
        type: type,
      };

      var newPost = new Post(post);
      newPost.save(function (err) {
        if (err) {
          console.log(err);
        } else {
          Post.find(function (err, onePost) {
            if (err) console.log(err);

            onePost.map(function (item) {
              console.log(item._id + ' ' + item.username);
            });
          });

          io.emit('newfunnypost', post);
          res.json({ done: true });
        }
      });
    });
  });

};

module.exports = postRouter;
