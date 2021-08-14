const pool = require('../modules/pool');

const main = {
    getMainInfo : async(userIdx) => {
        const nameQuery = `SELECT name FROM user WHERE userIdx = ?`;
        const deceasedQuery = `		SELECT ild.islandIdx, ild.deceasedName, ild.deceasedProfileImg, IF(usr_ild.userIdx = ild.userIdx, true, false) AS madeByMyself
                                    FROM island ild
                                    JOIN user_island usr_ild ON usr_ild.islandIdx = ild.islandIdx 
                                    WHERE usr_ild.userIdx = ?`;
        
        try {
            let result = {};
            let nameResult = await pool.queryParamArr(nameQuery, [userIdx]);
            let deceasedResult = await pool.queryParamArr(deceasedQuery, [userIdx]);

            result.name = nameResult[0].name;
            result.deceasedInfo = deceasedResult;
            return result;
        } catch(err) {
            console.log('getMainInfo err: ', err);
            throw err;
        }
    }
}

module.exports = main;