var express = require('express');

var usersRouter = function (router, User, multipartMiddleware) {
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
    var password = req.query.password;

    console.log(username);

    User.find({ username: username, password: password }, function (err, docs) {
      if (err) console.log(err);

      if (docs) {
        res.json(docs);
      } else {
        res.json({ status: 'unauthorized' });
      }
    });
  });

};

module.exports = usersRouter;
