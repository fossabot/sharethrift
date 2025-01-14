import { Schema, model, Model, PopulatedDoc, ObjectId } from 'mongoose';
import { Base, BaseOptions} from './interfaces/base';
import * as Category  from './category';
import * as Location from './location';
import * as User from './user';
import * as Account from './account'

export interface Photo {
  id: string,
  order: number,
  documentId: string
}

export interface Listing extends Base {
  account: Account.Account | ObjectId;
  title: string;
  description: string;
  primaryCategory?: PopulatedDoc<Category.Category> | ObjectId;
  photos?: Photo[];
  location?: PopulatedDoc<Location.Location>;
}

export const ListingModel = model<Listing>('Listing',new Schema<Listing, Model<Listing>, Listing>(
  {
    schemaVersion: {
      type: String,
      default: '1.0.0',
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: Account.AccountModel.modelName,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    primaryCategory: {
      type: Schema.Types.ObjectId,
      ref: Category.CategoryModel.modelName,
      required: false,
      index: true,
    },
    photos: [{
      order: {
        type: Number,
        required: true,
      },
      documentId: {
        type: String,
        required: true
      }
    }],
    location: Location.LocationModel.schema,
  },
  {
    ...BaseOptions,
  }
));