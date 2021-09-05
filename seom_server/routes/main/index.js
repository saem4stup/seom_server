var express = require('express');
var router = express.Router();

const mainController = require('../../controllers/main');
const upload = require('../../modules/multer');

router.get('/v1/island', mainController.searchIsland);
router.get('/v1/:user_idx', mainController.getMainInfo);
router.delete('/v1/:user_idx/:island_idx', mainController.deleteIsland);
router.post('/v1/island', upload.array('deceasedProfileImg',1), mainController.addIsland);
router.put('/v1/island/bookmark/:user_idx/:island_idx', mainController.bookmarkIsland);

module.exports = router;