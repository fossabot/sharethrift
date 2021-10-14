

# Domain Event Handlers fire before
In this project - events raised are assumed to not be in the same transactional scope as the Aggregate root.

Decision Reasoning:

- This project relies on MongoDB as the data-store - which supports embeded data models - and all tightly related data in the model is by default in the same transaction: [MongoDB Docs](https://docs.mongodb.com/manual/core/data-model-design/#std-label-data-modeling-embedding)