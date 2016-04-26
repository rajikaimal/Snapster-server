var express = require('express');

var challengeRouter = function (router, multipartMiddleware, Challenge, Post) {
  router.post('/api/challenge/create', function (req, res) {
    console.log(postId);

    var postId = req.body.postid;
    var username = req.body.username;
    var time = new Date();
    var image = req.files.image;

    Post.findOne({ postid: postId }, 'username', function (err, challengee) {
      console.log(challengee);
      var challenge = {
        challengeid: postId,
        challenger: username,
        challengee: challengee,
        datetime: time,
        done: false,
      };
      var newChallenge = new Challenge(challenge);
      newChallenge.save(function (err, docs) {
        if (err) console.log(err);

      });
    });
  })

  .post('/api/challenge/remove', function (req, res) {
    var postId = req.body.postid;
    Challenge.find({ challengeid: postId }).remove(function (err, docs) {
      if (err) {
        res.json({ done: false });
      } else {
        res.json({ done: true });
      }

    });
  })

  .get('/api/challenge/my', function (req, res) {
    var username = req.query.username;

    Challenge.find({ challengee: username, done: false }, function (err, challenges) {
      if (err) console.log(err);

      res.json(challenges);
    });

  })

  .get('/api/challenge/byme', function (req, res) {
    var username = req.query.username;

    Challenge.find({ challenger: username, done: false }, function (err, challenges) {
      if (err) console.log(err);

      res.json(challenges);
    });
  });
};

module.exports = challengeRouter;
