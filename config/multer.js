const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        const fileExt = file.originalname.split('.').pop();
        const filename = `${file.fieldname}-${Date.now()}.${fileExt}`;
        cb(null, filename);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Sorry the file type is not supported'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

!module.exports = upload;
