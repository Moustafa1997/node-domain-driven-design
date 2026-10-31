import { Guid } from "guid-typescript";
import { AggregateId } from "@travelhoop/shared-kernel";
import { MikroOrmRepository, MikroOrmRepositoryDependencies } from "@travelhoop/infrastructure";
import { Couch, CouchProps, CouchRepository, CouchNotFoundError } from "../../../domain";
import { couchEntitySchema } from "../entity-schemas/couch.entity";

export class MikroOrmCouchRepository extends MikroOrmRepository<Couch, CouchProps> implements CouchRepository {
  constructor({ dbConnection }: MikroOrmRepositoryDependencies) {
    super({ dbConnection, entitySchema: couchEntitySchema });
  }

  async add(couch: Couch) {
    await this.repo.persistAndFlush(couch);
  }

  async save(couch: Couch) {
    await this.repo.persistAndFlush(couch);
  }

  async get(id: AggregateId) {
    const couch = await this.repo.findOne({ id });

    if (!couch) {
      throw new CouchNotFoundError();
    }

    return (couch as unknown) as Couch;
  }

  async getByHostId(hostId: Guid) {
    return (this.repo.find({ hostId }) as unknown) as Promise<Couch[]>;
  }
}
