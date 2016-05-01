var express = require('express');

var likesRouter = function (router, multipartMiddleware, io, Like) {
  router.post('/api/post/like', multipartMiddleware, function (req, res) {

    console.log(req.params);

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

    newLike.save(function (err, docs) {
      if (err) console.log(err);

      console.log(docs);
      res.json({
        status: 'done',
      });
    });

  })

  .get('/api/post/likes', function (req, res) {
    var postId = req.query.postid;
    console.log(postId);
    Like.find({'postid': postId}, function (err, docs) {
      if (err)

      console.log(docs);
      res.json(docs);
    });
  });

};

module.exports = likesRouter;
