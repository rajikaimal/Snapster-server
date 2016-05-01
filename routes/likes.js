var express = require('express');

var likesRouter = function (router, multipartMiddleware, io, Like, Post) {
  router.post('/api/post/like', multipartMiddleware, function (req, res) {

    console.log(req);

    var postId = req.body.postid;
    var username = req.body.username;
    var time = new Date();

    var like = {
      postid: postId,
      username: username,
      datetime: time,
    };
    console.log(like);

    var newLike = new Like(like);

    Post.findOneAndUpdate({ _id: like.postid }, { $inc: { likes: 1 } }, function (err, done) {
      if (err) console.log(err);
    });

    newLike.save(function (err, docs) {
      if (err) console.log(err);

      console.log(docs);
      res.json({
        status: 'done',
      });
    });

  })

  .post('/api/post/unlike', multipartMiddleware, function (req, res) {
    var postId = req.body.postid;
    var username = req.body.username;

    Post.findOneAndUpdate({ _id: postId }, { $inc: { likes: -1 } }, function (err, done) {
      if (err) console.log(err);
    });

    Like.remove({ postid: postId, username: username }, function (err, docs) {
      if (err) console.log(err);

      res.json({
        status: 'done',
      });
    });
  })

  .get('/api/post/likes', function (req, res) {
    var postId = req.query.postid;
    console.log(postId);
    Like.find({ postid: postId }, function (err, docs) {
      if (err)

      console.log(docs);
      res.json(docs);
    });
  });

};

module.exports = likesRouter;
