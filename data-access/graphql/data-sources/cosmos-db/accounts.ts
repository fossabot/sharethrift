import { MongoDataSource } from 'apollo-datasource-mongodb';
import { Account } from '../../../infrastructure/data-sources/cosmos-db/models/account';
import { Context } from '../../context';

export class Accounts extends MongoDataSource<Account, Context> {
  
  async getAccount(accountId : string): Promise<Account> {
    return this.findOneById(accountId);
  }

  async getAccounts(): Promise<Account[]> {
    return this.model
      .find({})
      .exec();
  }
  
}