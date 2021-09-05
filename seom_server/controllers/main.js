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
    },

    addIsland : async(req, res) => {
        const {userIdx, deceasedName, deceasedBirth, deceasedDeath, relation} = req.body;
        const deceasedProfileImg = req.files;
        const imgLocation = deceasedProfileImg.map(profile => profile.location);

        if(!userIdx || !deceasedName || !deceasedBirth || !deceasedDeath || !relation || deceasedProfileImg === undefined) {
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        } 

        const type = req.files[0].mimetype.split('/')[1];
        if(type !== 'jpeg' && type !== 'jpg' && type !== 'png') {
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.UNSUPPORTED_TYPE));
        }

        const result = await mainModel.addIsland(userIdx, deceasedName, deceasedBirth, deceasedDeath, relation, imgLocation);
        
        if(result == -1) {
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.ADD_ISLAND_FAIL));
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.ADD_ISLAND_SUCCESS, {addIslandIdx : result}));        
    },

    searchIsland : async(req, res) => {
        let deceasedName = req.query.deceased_name;

        if(!deceasedName) {
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        } 

        const result = await mainModel.searchIsland(deceasedName);
        
        if(result.length === 0) {
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.NO_RESULT_SEARCH_ISLAND));
        }
        
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SEARCH_ISLAND_SUCCESS, result));
    },

    bookmarkIsland : async(req, res) => {
        let userIdx = req.params.user_idx;
        let islandIdx = req.params.island_idx;
        
        if(!userIdx || !islandIdx) {
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));   
        }

        function Func1() {
            let isBookmark = mainModel.isBookmark(userIdx, islandIdx);
            return isBookmark;
        };

        let data;
        let result = {};

        async function Func2(isBookmark) {
            if(!isBookmark) {
                data = await mainModel.deleteBookmark(userIdx, islandIdx);
            } else {
                data = await mainModel.addBookmark(userIdx, islandIdx);
            }

            result.isBookmark = isBookmark;
            result.bookmarkCount = data[0].bookmarkCount;

            return result;
        };

        await Func1(async(elem) => {}).then((res) => Func2(res));

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.ISLAND_BOOKMARK_SUCCESS, result));
    }
}