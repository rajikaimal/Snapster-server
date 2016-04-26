var express = require('express');

var hallOfFameRouter = function (router, multipartMiddleware, Post) {
  router.get('/api/hall/funny', function (req, res) {
    console.log(postId);
    Post.findOne(function (err, docs) {
      if (err)

      console.log(docs);
      res.json(docs);
    });
  });

};

module.exports = hallOfFameRouter;
