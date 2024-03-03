const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');

const conn = mongoose.createConnection(process.env.MONGO_URI);

let gfs;

conn.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads', 
  });
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
          filename: filename,
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