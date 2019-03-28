import { Importer } from '../app/Services/Importer';
import _ from 'lodash';
let im;

/* eslint-disable no-undef */
beforeEach(async () => {
  im = new Importer();
});
afterEach(async () => {
  im = undefined;
});

class FakeRepo {
  async create() {
    console.log('Record is created');
  }
}
class First {
  async first() {
    return {
      id: 1,
      name: 'son'
    };
    // return data;
  }
}

describe('Import', () => {
  it('can import data', async () => {
    const result = await im.import('/home/ngoson/Desktop/test.xlsx', [
      {
        before: row => {
          return _.assign(row, { son: 'before' });
        },
        action: {
          handler: 'FIRST',
          repository: First,
          where: {
            id: 1
          }
        },
        merge_result: (row, data) => {
          return _.assign(row, { id: data.id });
        },
        after: row => {
          return _.assign(row, { after: 'after' });
        }
      },
      {
        before: row => {
          console.log(row);
          return _.assign(row, { before: 'before' });
        },
        action: {
          handler: 'CREATE',
          repository: FakeRepo
        },
        after: row => {
          return _.assign(row, { after: 'after' });
        }
      }
    ]);
    // console.log(result);
    expect(result).toBeTruthy();
  });
});
