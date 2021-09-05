const { LakeFormation } = require('aws-sdk');
const pool = require('../modules/pool');

const memory = {
    getMemories : async(userIdx, islandIdx) => {
        let getIslandInfo = `SELECT ild.islandIdx, ild.deceasedProfileImg, ild.deceasedName, ild.deceasedBirth, ild.deceasedDeath, ild.bookmark
                            FROM island ild
                            WHERE ild.islandIdx = ${islandIdx}`;
        let getContents = `SELECT contentsIdx, contentsImg, likes, date_format(timestamp, '%Y/%m/%d') AS createDate, commentCount
                            FROM contents
                            WHERE contents.islandIdx = ${islandIdx}`;
        let checkBookmark = `    SELECT COUNT(*) AS count FROM bookmark WHERE userIdx = ${userIdx} AND islandIdx = ${islandIdx}`;
        

        try {
            let islandInfoResult = await pool.queryParam(getIslandInfo);
            if(islandInfoResult.length === 0) {
                return 0;
            }

            let contentsResult = await pool.queryParam(getContents);
            let isAlreadyBookmark = await pool.queryParam(checkBookmark);

            let result = {};
            result.islandInfo = islandInfoResult;
            result.contentsInfo = contentsResult;

            if(isAlreadyBookmark[0].count == 1) {
                result.islandInfo[0].isAlreadyBookmark = true;
            } else {
                result.islandInfo[0].isAlreadyBookmark = false;
            }

            return result;
        } catch(err) {
            console.log('getMemories Err: ', err);
            throw err;
        }
    },

    addMemory : async(imageLocation, userIdx, islandIdx, memo) => {
        let fields = `contentsImg, userIdx, islandIdx, memo`;
        let question = `?,?,?,?`;
        let values = [imageLocation, userIdx, islandIdx, memo];

        let insertContentsQuery = `INSERT INTO contents(${fields}) VALUES(${question})`;

        try{
            let insertContentsResult = await pool.queryParamArr(insertContentsQuery, values);
            let contentsIdx = insertContentsResult.insertId;

            let insertIslandContentQuery = `INSERT INTO island_contents(islandIdx, contentsIdx) VALUES(${islandIdx}, ${contentsIdx})`;
            await pool.queryParam(insertIslandContentQuery);

            let selectContents = `SELECT contentsIdx, contentsImg, likes, date_format(timestamp, '%Y/%m/%d') AS createDate, commentCount, memo
                                    FROM contents
                                    WHERE contentsIdx = ${contentsIdx}`;
            let selectContentsResult = await pool.queryParam(selectContents);

            return selectContentsResult;
        } catch(err) {
            console.log('addMemory err: ', err);
            throw err;
        }
    },

    getContents : async(userIdx, contentsIdx) => {
        let selectContentsQuery = ` SELECT cnt.contentsIdx, cnt.contentsImg, date_format(cnt.timestamp, '%Y.%m.%d') AS createDate, cnt.memo, count(usr_cnt_lik.contentsIdx) AS likes
                                    FROM contents cnt
                                    JOIN user_contents_like usr_cnt_lik ON cnt.contentsIdx = usr_cnt_lik.contentsIdx
                                    WHERE cnt.contentsIdx = ${contentsIdx}`;
        
        try {
            let selectContentsResult = await pool.queryParam(selectContentsQuery);
            return selectContentsResult;
        } catch(err) {
            console.log('getContents err : ', err);
            throw err;
        }
    },

    isLike : async(userIdx, contentsIdx) => {
        let query = `SELECT COUNT(*) as cnt FROM user_contents_like WHERE userIdx = ${userIdx} and contentsIdx = ${contentsIdx}`;
        try{
            const result = await pool.queryParam(query);
            if(result[0].cnt === 0){
                return true;
            }
            else{
                return false;
            }
        }catch(err){
            console.log('isLike err: ', err);
        }throw err;
    },

    deleteLike : async(userIdx, contentsIdx) =>{
        let query1 = `DELETE FROM user_contents_like WHERE userIdx = ${userIdx} and contentsIdx = ${contentsIdx}`;
        let query2 = `UPDATE contents SET likes = likes-1 WHERE contentsIdx = ${contentsIdx}`;
        let query3 = `SELECT likes FROM contents WHERE contentsIdx = ${contentsIdx}`;
        try{
            let result1 = await pool.queryParam(query1);
            let result2 = await pool.queryParam(query2);
            let result3 = await pool.queryParam(query3);
            return result3;
        }catch(err){
            console.log('deleteLike err: ', err);
        }throw err;
    },

    addLike : async(userIdx, contentsIdx) =>{
        const fields = `userIdx, contentsIdx`;
        const question = `?,?`;
        const values = [userIdx, contentsIdx];

        let query1 = `INSERT INTO user_contents_like(${fields}) VALUES(${question})`;
        let query2 = `UPDATE contents SET likes = likes+1 WHERE contentsIdx = ${contentsIdx}`;
        let query3 = `SELECT likes FROM contents WHERE contentsIdx = ${contentsIdx}`;
        try{
            const result1 = await pool.queryParamArr(query1, values);
            const result2 = await pool.queryParam(query2);
            const result3 = await pool.queryParam(query3);
            return result3;
        }catch(err){
            console.log('addLike err: ', err);
        }throw err;
    }
}

module.exports = memory;