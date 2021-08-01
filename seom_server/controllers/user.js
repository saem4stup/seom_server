const util = require('../modules/util');
const resMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const userModel = require('../models/user');

module.exports = {
    signup : async(req, res) => {
        const {id, password, name, birth} = req.body;
        const profile = req.files;
        const imgLocation = profile.map(profile => profile.location);
        if(!id || !password || !name || !birth || profile === undefined) {
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        } 

        const type = req.files[0].mimetype.split('/')[1];
        if(type !== 'jpeg' && type !== 'jpg' && type !== 'png') {
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.UNSUPPORTED_TYPE));
        }

        const idx = await userModel.signup(id, password, name, imgLocation, birth);
        
        if(idx == -1) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATED_USER, {userIdx:idx}));
    },

    signin : async(req, res) => {
        const {id, password} = req.body;

        if(!id || !password) {
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));   
        }

        const user = await userModel.getUserById(id);

        if(user.length === 0) {
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
        }

        if(user[0].password != password) {
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.MISS_MATCH_PW));
        }
        
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS, {userId: id}));
    }
}