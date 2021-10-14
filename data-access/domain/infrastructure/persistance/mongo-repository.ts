import { Repository } from "../../shared/repository";
import { AggregateRoot } from "../../shared/aggregate-root";
import { Model, ClientSession,Document } from "mongoose";
import { TypeConverter } from "../../shared/type-converter";
import { EntityProps } from "../../shared/entity";
import { EventBus } from "../../shared/event-bus";
import { DomainEvent } from "../../shared/domain-event";

export abstract class MongoRepositoryBase<MongoType,PropType extends EntityProps,DomainType extends AggregateRoot<PropType>> implements Repository<DomainType> {
  protected itemsInTransaction:DomainType[] = [];
  constructor(
    protected eventBus: EventBus,
    protected model : Model<MongoType>, 
    protected typeConverter:TypeConverter<Document<MongoType>,DomainType>, 
    protected session:ClientSession) {}
  
  async get(id: string): Promise<DomainType> {
    return this.typeConverter.toDomain(await this.model.findById(id,null,{session:this.session}).exec());
  }

  async save(item: DomainType): Promise<DomainType> {
   
    console.log("saving item");
    for await (let event of item.getDomainEvents()) {
      console.log(`Repo dispatching DomainEvent : ${JSON.stringify(event)}`);
      await this.eventBus.dispatch(event as any,event['payload'])
    }
    item.clearDomainEvents();
    this.itemsInTransaction.push(item);
    return this.typeConverter.toDomain(await this.typeConverter.toMongo(item).save({session:this.session}));
  }

  async getIntegrationEvents(): Promise<DomainEvent[]> {
    var integrationEventsGroup = this.itemsInTransaction.map(item => {
      var integrationEvents = item.getIntegrationEvents();
      item.clearIntegrationEvents(); 
      return integrationEvents});
    return integrationEventsGroup.reduce((acc,curr) => acc.concat(curr),[]);
  }

  static create<MongoType,PropType extends EntityProps, DomainType extends AggregateRoot<PropType>, RepoType extends MongoRepositoryBase<MongoType,PropType,DomainType>>(
    bus: EventBus,
    model: Model<MongoType>, 
    typeConverter:TypeConverter<Document<MongoType>,DomainType>, 
    session:ClientSession,
    repoClass: new(bus:EventBus,model:Model<MongoType>,typeConverter:TypeConverter<Document<MongoType>,DomainType>,session:ClientSession) =>RepoType ): RepoType {
      return new repoClass(bus,model,typeConverter,session);
  }
}

export class MongoFactory{
  static create<MongoType,PropType extends EntityProps, DomainType extends AggregateRoot<PropType>, RepoType extends MongoRepositoryBase<MongoType,PropType,DomainType>>(
    bus: EventBus,
    model: Model<MongoType>, 
    typeConverter:TypeConverter<Document<MongoType>,DomainType>, 
    session:ClientSession,
    repoClass: new(bus:EventBus, model:Model<MongoType>,typeConverter:TypeConverter<Document<MongoType>,DomainType>,session:ClientSession) =>RepoType ): RepoType {
      return new repoClass(bus,model,typeConverter,session);
  }
}