const util = require('../modules/util');
const resMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const memoryModel = require('../models/memory');
const memory = require('../models/memory');

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
    },

    addMemory : async(req, res) => {
        let memoryImage = req.files;
        let {userIdx, islandIdx, memo} = req.body;

        if((!memoryImage && !memo) || (!userIdx || !islandIdx)) {
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));   
        }

        let imgLocation = "default";
        if(memoryImage.length !== 0) {
            let type = req.files[0].mimetype.split('/')[1];
            if(type !== 'jpeg' && type !== 'jpg' && type !== 'png') {
                return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.UNSUPPORTED_TYPE));
            }
            
            imgLocation = memoryImage.map(image => image.location);   
        }

        let result = await memoryModel.addMemory(imgLocation, userIdx,islandIdx, memo);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.ADD_CONTENTS_SUCCESS, result));
    }
}