import { Response } from './Response/Response';
import multer from 'multer';
import _ from 'lodash';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import path from 'path';
import fs from 'fs';

export class UploadFile {
  constructor() {
    let path;
    this.storage_driver = process.env.FILE_STORAGE;
    if (process.env.APP_ENV === 'local') {
      this.folder = 'public/uploads';
      path = process.cwd() + '/public/uploads';
    } else {
      this.folder = 'dist/public/uploads';
      path = process.cwd() + '/dist/public/uploads';
    }
    try {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
    } catch (err) {
      console.error(err);
    }
    this.type = [];
    this.limit = 1;
  }

  destination(folder) {
    this.folder = folder;
    return this;
  }

  setStorageDriver(driver) {
    this.storage_driver = driver;
    return this;
  }

  typeFile(type) {
    this.type = type;
    return this;
  }

  limitFileUpload(num) {
    this.limit = num;
    return this;
  }

  uploadSingleFile(data) {
    if (data.driver) {
      this.setStorageDriver(data.driver);
    }
    if (data.type && !_.isEmpty(data.type)) {
      this.typeFile(data.type);
    }
    this.limitFileUpload(1);
    return this.setUpMulter().single(data.name ? data.name : 'file');
  }

  uploadMultipleFile(data) {
    if (data.driver) {
      this.setStorageDriver(data.driver);
    }
    if (data.type && !_.isEmpty(data.type)) {
      this.typeFile(data.type);
    }
    if (data.limit) {
      this.limitFileUpload(data.limit);
    } else {
      this.limitFileUpload(10);
    }
    return this.setUpMulter().array(data.name ? data.name : 'files', this.limit);
  }

  setUpMulter() {
    let storage;
    if (this.storage_driver === 's3') {
      storage = multerS3({
        s3: new aws.S3({
          accessKeyId: process.env.S3_ACCESS_KEY,
          secretAccessKey: process.env.S3_SECRET_KEY,
          region: process.env.S3_REGION
        }),
        bucket: process.env.S3_BUCKET_NAME,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        cacheControl: 'max-age=31536000',
        key: function(res, file, cb) {
          cb(null, _.kebabCase(path.basename(file.originalname, path.extname(file.originalname)) + Date.now()) + path.extname(file.originalname));
        }
      });
    } else {
      storage = multer.diskStorage({
        destination: this.folder,
        filename: function(res, file, cb) {
          cb(null, _.kebabCase(path.basename(file.originalname, path.extname(file.originalname))) + new Date().getTime() + path.extname(file.originalname));
        }
      });
    }
    const upload = multer({
      storage: storage,
      fileFilter: (req, file, cb) => {
        const extension = file.mimetype.split('/')[0];
        if (this.type.indexOf(extension) === -1) {
          return cb(new Error('type not accepted'), false);
        }
        cb(null, true);
      }
    });

    return upload;
  }

  fileTransformer(data) {
    let transformer;
    if (this.limit === 1) {
      transformer = new Response(data);
    } else {
      transformer = _.map(data, item => new Response(item));
    }
    return transformer;
  }
}
