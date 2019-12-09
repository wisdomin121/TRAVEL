var express = require('express');
    Reservation = require('../models/reservation');
var router = express.Router();
const catchErrors = require('../lib/async-error');

router.get('/form/:id', catchErrors(async (req, res, next) =>{
  const item = await Item.findById(req.params.id);
  res.render('reservations/form', {item: item});
}));

// router.get('/', catchErrors(async (req, res, next) =>{
//   const reservation = await Reservation.findById(req.params.id);
//   res.render('reservations/index', {reservation: reservation});
// }));

router.get('/', catchErrors(async(req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  var query={};
  const term = req.query.term;
  if(term){
    query={$or: [
      //{title: {'$regex': item.title, '$options': 'i'}},
      {res_num: {'$regex': term, '$options': 'i'}},
      {res_date: {'$regex': term, '$options': 'i'}}
    ]};
  }
  const reservations = await Reservation.paginate(query, {
    sort: {p_date: -1},
    populate: 'user',
    populate: 'item',
    page: page, limit: limit
  });
  res.render('reservations/index', {reservations: reservations, query: req.query});
}));

router.post('/form/:id', catchErrors(async(req, res, next) => {
  const user = req.session.user; 
  const item = await Item.findById(req.params.id);

  var reservation = new Reservation({
    user: user._id,
    item: item._id,
    res_num: req.body.res_num
  });
  item.now_num += req.body.res_num;

  await reservation.save();
  await item.save();
  res.redirect('/');
}));

module.exports = router;