import { InProcEventBus } from '../events/in-proc-event-bus';
import { ListingPublishedEvent } from '../../events/listing-published';

export default () => { InProcEventBus.register(ListingPublishedEvent, async (payload) => {
  console.log(`ListingPublishedEvent in-proc handler called with payload: ${JSON.stringify(payload)} and listingId: ${payload.listingId}`);
 // throw new Error('ListingPublishedEvent Domain: Error');
  });
};