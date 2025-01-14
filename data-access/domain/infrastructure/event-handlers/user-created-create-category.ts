import { NodeEventBus } from '../events/node-event-bus';
import { UserCreatedEvent } from '../../events/user-created';
import { CategoryUnitOfWork } from '../persistance/repositories';

export default () => { NodeEventBus.register(UserCreatedEvent, async (payload) => {

  console.log(`UserCreatedEvent -> CreateCategory Handler - Called with Payload: ${JSON.stringify(payload)} and UserId: ${payload.userId}`);

  await CategoryUnitOfWork.withTransaction(async(repo) => {
    var newCategory = repo.getNewInstance();
    newCategory.name = payload.userId;
    repo.save(newCategory);
  });

})};