var express = require('express');
var router = express.Router();

const UserController = require('../../controllers/user');

router.post('/v1/signup', UserController.signup);

module.exports = router;