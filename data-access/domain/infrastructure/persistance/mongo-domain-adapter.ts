import { Base } from "../../../infrastructure/data-sources/cosmos-db/models/interfaces/base";
import { EntityProps } from "../../shared/entity";

export abstract class MongooseDomainAdapater<T extends Base> implements MongooseDomainAdapaterType<T>{
  constructor(public readonly props: T) { }
  get id() {return this.props.id;}
  get createdAt() {return this.props.createdAt;}
  get updatedAt() {return this.props.updatedAt;}
  get schemaVersion() {return this.props.schemaVersion;}
}

export interface MongooseDomainAdapaterType<T extends Base> extends EntityProps {
  readonly props: T;
}