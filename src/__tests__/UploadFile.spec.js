import { UploadFile } from '../app/Services/UploadFile';
import _ from 'lodash';
let ul;

/* eslint-disable no-undef */
beforeEach(async () => {
  ul = new UploadFile();
});
afterEach(async () => {
  ul = undefined;
});

describe('UploadFile', () => {
  it('can uploadFile', async () => {
    const result = await ul.upload('test UploadFile');
    console.log(result);
    expect(result).toBeTruthy();
  });
});
