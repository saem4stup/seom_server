const util = require('../modules/util');
const resMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const mainModel = require('../models/main');

module.exports = {
    getMainInfo : async(req, res) => {
        let userIdx = req.params.user_idx;

        if(!userIdx) {
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));   
        }

        let mapInfo = await mainModel.getMainInfo(userIdx);
        return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.GET_MAP_INFO_SUCCESS, mapInfo));
    },

    deleteIsland : async(req, res) => {
        let userIdx = req.params.user_idx;
        let islandIdx = req.params.island_idx;

        let result = await mainModel.deleteIsland(userIdx, islandIdx);
        if(result == -1) {
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.DELETE_ISLAND_FAIL));
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.DELETE_ISLAND_SUCCESS, {deleteIslandIdx : islandIdx}));
    }
}