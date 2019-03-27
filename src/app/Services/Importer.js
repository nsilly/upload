import { ActionHandle } from './ActionHandlers/ActionHandle';
import { ReadFile } from './ReadFile/ReadFile';
import { App } from '@nsilly/container';
export class Importer extends ActionHandle {
  async import(file, handlers) {
    const rows = App.make(ReadFile).read(file);
    rows.map(async item => {
      item = await this.handle(item, handlers);
      return item;
    });
    return rows;
  }

  // handle(row, handlers) {
  //   handlers.forEach(handler => {
  //     let data = handler['before'](row);
  //     switch (handler['action']['handler']) {
  //       case 'FIRST':
  //         const repo = handler['action']['where'];
  //         console.log(repo);
  //         break;
  //       case 'CREATE':
  //         const a = new handler['action']['repository']();
  //         a.create(data);
  //         break;
  //     }
  //     data = handler['after'](data);
  //     return data;
  //   });
  // }
}
