var express = require('express');
var router = express.Router();

const UserController = require('../../controllers/user');
const upload = require('../../modules/multer');

router.post('/v1/signup', upload.array('profile',1), UserController.signup);

module.exports = router;