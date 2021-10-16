import { NodeEventBus } from '../events/node-event-bus';
import { ListingPublishedEvent } from '../../events/listing-published';
import { ListingCreatedEvent } from '../../events/listing-created';

export default () => { NodeEventBus.register(ListingCreatedEvent, async (payload) => {
  console.log(`ListingPublishedEvent Send Email Integration: ${JSON.stringify(payload)} and ListingId: ${payload.listingId}`);
  throw new Error('ListingPublishedEvent Integration: Error');
  });
};