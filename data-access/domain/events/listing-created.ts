import { ListingDomainObject } from '../contexts/listing';
import { DomainEventStaticProps, staticImplements,CustomDomainEventImpl } from '../shared/domain-event';

export interface ListingCreatedProps {
  listingId: string;
}

@staticImplements<DomainEventStaticProps>()
export class ListingCreatedEvent extends CustomDomainEventImpl<ListingCreatedProps>  {
  public static readonly eventId:string = "ListingPublished";
  constructor(aggregateRootId: string) {
    super(ListingCreatedEvent.eventId, aggregateRootId);
  }
}