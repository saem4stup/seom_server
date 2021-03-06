var express = require('express');
var router = express.Router();

const userController = require('../../controllers/user');
const upload = require('../../modules/multer');

router.post('/v1/signup', upload.array('profileImg',1), userController.signup);
router.post('/v1/signin', userController.signin);
router.post('/v1/check_id', userController.check_id);

module.exports = router;