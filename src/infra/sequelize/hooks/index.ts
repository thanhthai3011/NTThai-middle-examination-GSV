import models from "../models";
import { DomainEvents } from "../../../core/domain/events/DomainEvents";
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";

const dispatchEventsCallback = (model: any, primaryKeyField: string) => {
    const aggregateId = new UniqueEntityID(model[primaryKeyField]);
    DomainEvents.dispatchEventsForAggregate(aggregateId);
};

(async function createHooksForAggregateRoots() {})();
