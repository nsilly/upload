import _ from 'lodash';
export class ActionHandle {
  async handle(row, handlers) {
    let data;
    handlers.forEach(async handler => {
      // for (const handler of handlers) {
      if (_.has(handler, 'before')) {
        row = handler['before'](row);
      }
      switch (handler['action']['handler']) {
        case 'FIRST':
          const repo = new handler['action']['repository']();
          const obj = handler['action']['where'];
          const key = Object.keys(obj)[0];
          const value = obj[key];
          data = await repo.where(key, value).first();
          break;
        case 'CREATE':
          const repository = new handler['action']['repository']();
          data = await repository.create(row);
          break;
      }
      if (_.has(handler, 'merge_result')) {
        row = handler['merge_result'](row, data);
      }
      if (_.has(handler, 'after')) {
        row = handler['after'](row);
      }
      return row;
    });
  }
}
