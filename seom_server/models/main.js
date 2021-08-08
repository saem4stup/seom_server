const pool = require('../modules/pool');

const main = {
    getMainInfo : async(userIdx) => {
        const query = `	SELECT ild.deceasedName, ild.deceasedProfileImg
                        FROM user usr
                        JOIN user_island usr_ild ON usr.userIdx = usr_ild.userIdx
                        JOIN island ild ON ild.userIdx = usr.userIdx
                        WHERE usr.userIdx = ?`;
        
        try {
            let result = await pool.queryParamArr(query, [userIdx]);
            
            return result;
        } catch(err) {
            console.log('getMainInfo err: ', err);
            throw err;
        }
    }
}

module.exports = main;