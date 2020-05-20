var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
  res.render('addUser');
});
router.post('/', (req, res) => {
  const usersCollection = req.app.db.collection('users');
  usersCollection
    .insertOne(req.body)
    .then((result) => {
      res.redirect('/');
    })
    .catch((error) => console.error(error));
});

module.exports = router;
