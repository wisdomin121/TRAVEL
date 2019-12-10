var express = require('express');
    Reservation = require('../models/reservation');
var router = express.Router();
const catchErrors = require('../lib/async-error');

router.get('/form/:id', catchErrors(async (req, res, next) =>{
  const item = await Item.findById(req.params.id);

  if(item.now_num >= item.max_num){
    req.flash('danger', "인원 수가 다 찼습니다.");
    return res.redirect('back');
  }

  res.render('reservations/form', {item: item});
}));

router.get('/', catchErrors(async(req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  var query={};
  const term = req.query.term;
  if(term){
    query={$or: [
      {res_num: {'$regex': term, '$options': 'i'}},
      {res_date: {'$regex': term, '$options': 'i'}}
    ]};
  }
  const reservations = await Reservation.paginate(query, {
    sort: {p_date: 1},
    populate: ['user', 'item'], 
    page: page, limit: limit
  });
  res.render('reservations/index', {reservations: reservations, query: req.query});
}));

router.post('/form/:id', catchErrors(async(req, res, next) => {
  const user = req.session.user; 
  const item = await Item.findById(req.params.id);

  if(item.now_num >= item.max_num){
    req.flash('danger', "인원 수가 다 찼습니다.");
    return res.redirect('back');
  }

  var reservation = new Reservation({
    user: user._id,
    item: item._id,
    res_num: req.body.res_num
  });
  item.now_num = parseInt(req.body.res_num) + parseInt(item.now_num);
  
  if(item.now_num > item.max_num){
    req.flash('danger', "인원 수가 다 찼습니다.");
    return res.redirect('/items');
  }else{
    await reservation.save();
    await item.save();

    res.redirect('/');
  }
}));

module.exports = router;