import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: "dfdmp3sal",
  api_key: "954637855583194",
  api_secret: "XKFSvqmMh3_ggmVWbi3avwYteMc",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'MyLocal', // A folder name in your Cloudinary account
    allowed_formats: ['jpeg', 'png', 'jpg'],
  },
});

const upload = multer({ storage: storage });

export default upload;