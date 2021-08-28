const pool = require('../modules/pool');

const memory = {
    getMemories : async(userIdx, islandIdx) => {
        let getIslandInfo = `SELECT ild.islandIdx, ild.deceasedProfileImg, ild.deceasedName, ild.deceasedBirth, ild.deceasedDeath, ild.likes
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
    }

}

module.exports = memory;