const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');

const conn = mongoose.createConnection(process.env.MONGO_URI);

conn.once('open', () => {
    const gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads',
    });
    console.log('Connected to GridFS', gfs);
});

const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = file.originalname;
                const fileInfo = {
                    filename,
                    bucketName: 'uploads',
                    _id: new mongoose.Types.ObjectId(),
                };
                resolve(fileInfo);
            });
        });
    },
});

const upload = multer({ storage });

module.exports = upload;
