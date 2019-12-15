var express = require('express');
    User = require('../models/user')
var router = express.Router();
const catchErrors = require('../lib/async-error');

function needAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.flash('danger', 'Please signin first.');
    res.redirect('/signin');
  }
}

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

router.get('/list', needAuth, (req, res, next) => {
  User.find({}, function(err, users) {
    if (err) {
      return next(err);
    }
    res.render('users/list', {users: users});
  });
});

router.get('/:id/edit', function(req, res, next){
  User.findById(req.params.id, function(err, user) {
    if (err) {
      return next(err);
    }
    res.render('users/edit', {user: user});
  });
});

router.get('/:id/edit_pwd', function(req, res, next){
  User.findById(req.params.id, function(err, user) {
    if (err) {
      return next(err);
    }
    res.render('users/edit_pwd', {user: user});
  });
});

router.get('/user_page', function(req, res, next){
  res.render('users/user_page');
});

router.get('/signup_guide/:id', function(req, res, next){
  User.findById(req.params.id, function(err, user) {
    if (err) {
      return next(err);
    }
    res.render('users/signup_guide', {user: user});
  });
});

router.get('/:id', (req, res, next) => {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      return next(err);
    }
    res.render('users/user_page', {user: user});
  });
});

router.delete('/:id', function(req, res, next){
  User.findOneAndRemove({_id: req.params.id}, function(err) {
    if (err) {
      return next(err);
    }
  });
  delete req.session.user;
  res.redirect('/');
});

router.delete('/list/:id', needAuth, (req, res, next) => {
  User.findOneAndRemove({_id: req.params.id}, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/users/list');
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

router.post('/edit/:id', catchErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if(!user){
    req.flash('danger', 'Not exist user');
    return res.redirect('back');
  }

  user.name = req.body.name;
  user.id = req.body.id;

  await user.save();
  res.redirect('/');

}));

router.post('/edit_pwd/:id', catchErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    req.flash('danger', 'Not exist user.');
    return res.redirect('back');
  }

  if (user.password !== req.body.current_password) {
    req.flash('danger', 'Password is incorrect');
    return res.redirect('back');
  }

  if (req.body.password) {
    user.password = req.body.password;
  }

  user.save(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });

}));

router.post('/signup_guide/:id', catchErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if(!user){
    req.flash('danger', 'Not exist user');
    return res.redirect('back');
  }

  user.intro = req.body.intro;
  user.group = 2;

  await user.save();
  res.redirect('/');

}));


module.exports = router;
