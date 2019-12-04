var express = require('express');
    User = require('../models/user')
var router = express.Router();

function validateForm(form, options) {
  var id = form.id || "";
  var name = form.name || "";
  id = id.trim();
  name = name.trim();

  if (!id) {
    return 'ID is required.';
  }

  if (!name) {
    return 'NAME is required.';
  }

  if (!form.password && options.needPassword) {
    return 'Password is required.';
  }

  if (form.password !== form.check_pwd) {
    return 'Passsword do not match.';
  }

  return null;
}

/* GET users listing. */
router.get('/new', function(req, res, next) {
  res.render('users/new');
});

router.get('/user_page', function(req, res, next){
  res.render('users/user_page');
});

router.get('/:id', (req, res, next) => {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      return next(err);
    }
    res.render('users/user_page', {user: user});
  });
});

router.post('/', (req, res, next) => {
  var err = validateForm(req.body, {needPassword: true});
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }
  User.findOne({id: req.body.id}, function(err, user) {
    if (err) {
      return next(err);
    }
    if (user) {
      req.flash('danger', 'ID already exists.');
      return res.redirect('back');
    }
    var newUser = new User({
      id: req.body.id,
      name: req.body.name,
    });
    newUser.password = req.body.password;

    newUser.save(function(err) {
      if (err) {
        return next(err);
      } else {
        res.redirect('/');
      }
    });
  });
});


module.exports = router;
