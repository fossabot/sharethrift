import { ListingProps } from "../../../contexts/listing";
import { Listing ,ListingModel} from "../../../../infrastructure/data-sources/cosmos-db/models/listing";
import { User } from "../../../../infrastructure/data-sources/cosmos-db/models/user";
import { LocationProps } from "../../../contexts/location";
import { PhotoProps } from "../../../contexts/photo";
import { UserProps } from "../../../contexts/user";
import { CategoryProps } from "../../../contexts/category";
import mongoose from "mongoose";
import { UserDomainAdapter } from "./user-domain-adapter";
import { MongooseDomainAdapater } from "../mongo-domain-adapter";
import { PhotoDomainAdapter } from "./photo-domain-adapter";
import { CategoryDomainAdapter } from "./category-domain-adapter";
import { LocationDomainAdapter } from "./location-domain-adapter";

export class ListingDomainAdapter extends MongooseDomainAdapater<Listing> implements ListingProps {
  constructor(props: Listing) { super(props); }
  
  public usersCurrentPublishedListingQuantity = async () => {
    if(!this.owner || !this.owner.id){ 
      return 0;
    }
    return ListingModel.countDocuments({"owner.id": this.owner.id}).exec();    
  }

  get title(): string {return this.props.title;}
  set title(value: string) {this.props.title = value;}

  get description(): string {return this.props.description;}
  set description(value: string) {this.props.description = value;}
  
  get version(): number {return this.props.version;}
  set version(value: number) {this.props.version = value;}

  get owner(): UserProps {
    if (!this.props.owner || !mongoose.isValidObjectId(this.props.owner.toString())) {
      return undefined;
    }
    return new UserDomainAdapter(this.props.owner as User);
  }
  set owner(value: UserProps) {
    if (value) {
      // @ts-ignore: TS2348
      this.props.owner = mongoose.Types.ObjectId(value.id);
    }
  }
  
  get photos(): PhotoProps[] {
    return this.props.photos.map((photo) => new PhotoDomainAdapter(photo));
  }

  get location(): LocationProps { return new LocationDomainAdapter(this.props.location); }
  get primaryCategory(): CategoryProps { return new CategoryDomainAdapter(this.props.primaryCategory); }
  set primaryCategory(value: CategoryProps) {
    if (value) {
      // @ts-ignore: TS2348
      this.props.primaryCategory = mongoose.Types.ObjectId(value.id);
    }
  }
}