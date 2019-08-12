import _ from 'lodash';

export class Response {
  constructor(data) {
    this.bind(data);
  }

  bind(data) {
    const attributes = this.map(data);
    for (const property in attributes) {
      if (!this.hasOwnProperty(property)) {
        this[property] = attributes[property];
      }
    }
  }

  map(data) {
    const result = {
      original_filename: data.originalname,
      original_extension: data.mimetype,
      original_size: data.size,
      extension: data.mimetype,
      size: data.size,
      filename: '',
      url: ''
    };

    if (data.filename) {
      _.assign(result, { filename: data.filename });
    } else if (data.key) {
      _.assign(result, { filename: data.key });
    } else {
      _.assign(result, { filename: 'test' });
    }

    if (data.filename) {
      _.assign(result, { url: process.env.API_URL + '/uploads/' + data.filename });
    } else if (data.location) {
      _.assign(result, { url: data.location });
    } else {
      _.assign(result, { url: 'test' });
    }

    return result;
  }
}
