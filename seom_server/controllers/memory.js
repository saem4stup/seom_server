const util = require('../modules/util');
const resMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const memoryModel = require('../models/memory');

module.exports = {
    getMemories : async(req, res) => {
        let userIdx = req.params.user_idx;
        let islandIdx = req.params.island_idx;
        if(!userIdx || !islandIdx) {
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));   
        }
        
        let result = await memoryModel.getMemories(userIdx, islandIdx);

        if(result === 0) {
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.GET_MEMORY_FAIL));
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.GET_MEMORY_SUCCESS, result));
    }
}