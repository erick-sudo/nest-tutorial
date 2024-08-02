import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { User } from './user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(datasource: DataSource) {}

  listenTo(): string | Function {
    return User;
  }

  beforeInsert(event: InsertEvent<User>): void | Promise<any> {
    console.log('BEFORE USER INSERTED: ', event.entity);
  }
}
