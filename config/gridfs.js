const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');

const conn = mongoose.createConnection(process.env.MONGO_URI);

// open a another connection to the database
conn.once('open', () => {
    const gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads'
    });
    console.log('Connected to GridFS bucket 🚀');
});

/*
 Create storage engine
 Note : The bucketName option is the name of the bucket your files will be stored in and
    it should be the same as the one you used when creating the GridFSBucket instance.
*/
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
                    _id: new mongoose.Types.ObjectId()
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({ storage });

module.exports = upload;
