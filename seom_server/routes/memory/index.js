var express = require('express');
var router = express.Router();

const memoryController = require('../../controllers/memory');
const upload = require('../../modules/multer');

router.get('/v1/memories/:user_idx/:island_idx', memoryController.getMemories);

module.exports = router;