var express = require('express');

var postRouter = function (router, multipartMiddleware, cloudinary, io, Post) {
  router.get('/api/feed/funny', function (req, res) {
    Post.find({'type': 'funny'}, function (err, posts) {
      if (err) console.log(err);
      // posts.forEach(function(post) {
      //   Like.where({ 'postid': post._id }).count(function(err,count) {
          
      //     posts.forEach(function(onePost) {
      //       onePost.concat({ 'likes': count });
      //       console.log(onePost);
      //     });
      //   });
      // });
      res.json(posts);
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
