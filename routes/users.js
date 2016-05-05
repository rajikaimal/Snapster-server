var express = require('express');

var likesRouter = function (router, User, multipartMiddleware) {
  router.post('/api/user/register', multipartMiddleware, function (req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var time = new Date();

    var user = {
      firstname: firstname,
      lastname: lastname,
      username: username,
      email: email,
      password: password,
      datetime: time,
    };
    console.log(like);

    var newUser = new User(user);

    newUser.save(function (err, docs) {
      if (err) console.log(err);

      console.log(docs);
      res.json({
        status: 'done',
      });
    });

  })

  .get('/api/user/login', function (req, res) {
    var username = req.query.username;
    var email = req.query.email;


    User.find({ postid: postId }, function (err, docs) {
      if (err)

      if(docs != null) {
        res.json({ 'status': 'authorized' });
      }
      else {
        res.json({ 'status': 'unauthorized' });
      }
    });
  });

};

module.exports = likesRouter;
