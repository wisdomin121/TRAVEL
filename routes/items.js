var express = require('express');
    Item = require('../models/item')
var router = express.Router();
const catchErrors = require('../lib/async-error');

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
      {i_info: {'$regex': term, '$options': 'i'}},
      {c_info: {'$regex': term, '$options': 'i'}},
      {d_date: {'$regex': term, '$options': 'i'}},
      {a_date: {'$regex': term, '$options': 'i'}}
    ]};
  }
  const items = await Item.paginate(query, {
    sort: {p_date: -1},
    page: page, limit: limit
  });
  res.render('items/index', {items: items, query: req.query});
}));

router.get('/registration', function(req, res, next){
  res.render('items/registration');
});

router.post('/', catchErrors(async(req, res, next) => {
  const user = req.session.user; 

  var item = new Item({
    title: req.body.title,
    price: req.body.price,
    max_num: req.body.max_num,
    i_info: req.body.i_info,
    c_info: req.body.c_info,
    d_date: req.body.d_date,
    a_date: req.body.a_date
  });

  await item.save();
  req.flash('success', 'Successfully posted');
  res.redirect('/items')
}));


module.exports = router;