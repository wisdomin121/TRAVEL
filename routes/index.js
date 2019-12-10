var express = require('express');
    User = require('../models/user');
var router = express.Router();
const catchErrors = require('../lib/async-error');

/* GET home page. */
router.get('/search', catchErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  var query = {};
  const term = req.query.term;
  if (term) {
    query = {$or: [
      {title: {'$regex': term, '$options': 'i'}},
      {place: {'$regex': term, '$options': 'i'}},
      {i_info: {'$regex': term, '$options': 'i'}},
      {c_info: {'$regex': term, '$options': 'i'}}
    ]};
  }
  const items = await Item.paginate(query, {
    sort: {createdAt: -1}, 
    page: page, limit: limit
  });
  res.render('items/index', {items: items, query: req.query});
}));

router.get('/', catchErrors(async(req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  var query={};
  const term = req.query.term;
  
  if(term){
    query={$or: [
      {title: {'$regex': term, '$options': 'i'}},
      {price: {'$regex': term, '$options': 'i'}},
      {max_num: {'$regex': term, '$options': 'i'}},
      {view: {'$regex': term, '$options': 'i'}},
      {i_info: {'$regex': term, '$options': 'i'}},
      {c_info: {'$regex': term, '$options': 'i'}},
      {d_date: {'$regex': term, '$options': 'i'}},
      {a_date: {'$regex': term, '$options': 'i'}}
    ]};
  }
  const items = await Item.paginate(query, {
    sort: {view: -1},
    page: page, limit: limit
  });
  res.render('index', {items: items, query: req.query});
}));

router.get('/signin', function(req, res, next)  {
  res.render('signin');
});

router.post('/signin', function(req, res, next) {
  User.findOne({id: req.body.id}, function(err, user) {
    if (err) {
      res.render('error', {message: "Error", error: err});
    } else if (!user || user.password !== req.body.password) {  //비밀번호는 암호화 해서 넣어야 함 
      req.flash('danger', 'Invalid username or password.');
      res.redirect('back');
    } else {
      req.session.user = user;
      res.redirect('/');
    }
  });
});

router.get('/signout', function(req, res, next) {
  delete req.session.user;
  res.redirect('/');
});

module.exports = router;