var express = require('express');
var router = express.Router();

const memoryController = require('../../controllers/memory');
const upload = require('../../modules/multer');

router.get('/v1/memories/:user_idx/:island_idx', memoryController.getMemories);
router.post('/v1/memories', upload.array('memoryImage',1), memoryController.addMemory);

module.exports = router;