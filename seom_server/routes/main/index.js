var express = require('express');
var router = express.Router();

const mainController = require('../../controllers/main');
const upload = require('../../modules/multer');

router.get('/v1/:userIdx', mainController.getMainInfo);

module.exports = router;