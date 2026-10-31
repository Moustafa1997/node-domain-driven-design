import { Guid } from "guid-typescript";
import { AggregateId } from "@travelhoop/shared-kernel";
import { CommandHandler } from "@travelhoop/abstract-core";
import { MessageBroker } from "@travelhoop/infrastructure";
import { Couch, CouchRepository } from "../../../../domain";
import { CouchCreated } from "../../events/couch-created.event";
import { CreateCouchCommand } from "./create-couch.command";

interface CreateCouchCommandHandlerDependencies {
  couchRepository: CouchRepository;
  messageBroker: MessageBroker;
}

export class CreateCouchCommandHandler implements CommandHandler<CreateCouchCommand> {
  constructor(private readonly deps: CreateCouchCommandHandlerDependencies) {}

  async execute({ payload }: CreateCouchCommand) {
    const couch = Couch.create({
      id: AggregateId.create(),
      hostId: Guid.parse(payload.hostId),
      name: payload.name,
      description: payload.description,
      quantity: payload.quantity,
    });

    await this.deps.couchRepository.add(couch);

    const { id, hostId, quantity } = couch.toDto();
    await this.deps.messageBroker.publish(new CouchCreated({ id: id.toString(), hostId: hostId.toString(), quantity }));
  }
}
