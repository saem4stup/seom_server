const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
aws.config.loadFromPath(__dirname + '/../config/s3.json');

const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'saem4stup',
        acl: 'public-read',
        ContentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function(req, file, cb){
            cb(null, Date.now() + '.' + file.originalname.split('.').pop()); // 이름 설정
        }
    })
});
module.exports = upload;