import multer from "multer";

const MIME_TYPE = {
    "image/jpg": "jpg",
    "image/jpeg": "jpeg",
    "image/png": "png",
};

const upload = multer({
    limits: 500000,
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploads/img");
        },
        filename: (req, file, cb) => {
            const ext = MIME_TYPE[file.mimetype];
            cb(null, Date.now() + "." + ext);
        },
        fileFilter: (req, file, cb) => {
            const isValid = !!MIME_TYPE[file.mimetype];
            let error = isValid ? null : new Error("Can't upload an image!");

            cb(error, isValid);
        },
    }),
});

export default upload;
