var express = require('express');

var commentRouter = function(router,Comment) {
	router.get('/api/feed/funny/comments/:id', function(req, res) {
	  var postId = req.params.id;
	  Comment.find({postid: postId}, function(err, posts) {
	    if (err) console.log(err);

	    res.json(posts);
	  });
	})

	.post('/api/post/funnyfeed/comment', function(req, res) {
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
};

module.exports = commentRouter;