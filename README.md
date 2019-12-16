# Vicoders NodeJS Upload File

- [Vicoders NodeJS Upload File](#vicoders-nodejs-upload-file)
  - [Installing](#installing)
  - [Config environment](#config-environment)
  - [Use](#use)

## Installing

```
npm i @vicoders/nodejs-uploadfile
```
Or
```
yarn add @vicoders/nodejs-uploadfile
```


## Config environment

```
APP_ENV=local (local for local environment & null for prod enviroment)
API_URL=http://api.example.local

FILE_STORAGE="local" ('local' or 's3') 
MEDIA_PREFIX="*********"
S3_REGION="*********"
S3_BUCKET_NAME="*********"
S3_ACCESS_KEY="*********"
S3_SECRET_KEY="*********"
```


## Use

```javascript
import { VicodersUpload } from '@vicoders/nodejs-uploadfile';


router.post('/upload-file', VicodersUpload.uploadSingleFile({
    driver: 'local', // 's3'
    type: ['image']
  }),
  (req, res) => {
    res.json({ data: VicodersUpload.fileTransformer(req.file) });
  }
);

router.post('/upload-file', VicodersUpload.uploadMutipleFile({
    driver: 'local', // 's3'
    type: ['image'],
    limit: 5 // default 10
  }),
  (req, res) => {
    res.json({ data: VicodersUpload.fileTransformer(req.files) });
  }
);

```