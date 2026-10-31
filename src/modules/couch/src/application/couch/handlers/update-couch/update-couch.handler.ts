import { AggregateId } from "@travelhoop/shared-kernel";
import { CommandHandler } from "@travelhoop/abstract-core";
import { CouchRepository } from "../../../../domain";
import { UpdateCouchCommand } from "./update-couch.command";

interface UpdateCouchCommandHandlerDependencies {
  couchRepository: CouchRepository;
}

export class UpdateCouchCommandHandler implements CommandHandler<UpdateCouchCommand> {
  constructor(private readonly deps: UpdateCouchCommandHandlerDependencies) {}

  async execute({ payload }: UpdateCouchCommand) {
    const couch = await this.deps.couchRepository.get(AggregateId.parse(payload.id));

    couch.update({
      name: payload.name,
      description: payload.description,
      quantity: payload.quantity,
    });

    await this.deps.couchRepository.save(couch);
  }
}
