import { MongoDataSource } from 'apollo-datasource-mongodb';
import * as Category from '../../../infrastructure/data-sources/cosmos-db/models/category';
import {Context} from '../../context';
import { CategoryConverter } from '../../../domain/infrastructure/persistance/adapters/category-domain-adapter';
import { CategoryEntityReference } from '../../../domain/contexts/listing/category';

export default class Categories extends MongoDataSource<Category.Category, Context> {

  async getCategory(categoryId : string): Promise<CategoryEntityReference> {
    return (new CategoryConverter).toDomain(await this?.findOneById(categoryId));
  }
  
  async getCategories(): Promise<CategoryEntityReference[]> {
    return (await this.model
      .find({})
      .exec())
      .map(category => (new CategoryConverter).toDomain(category));
  } 
   
}