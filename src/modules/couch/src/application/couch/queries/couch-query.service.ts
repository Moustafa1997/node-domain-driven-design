import { Guid } from "guid-typescript";
import { AggregateId } from "@travelhoop/shared-kernel";
import { CouchRepository } from "../../../domain";
import { CouchDto } from "../dto/couch.dto";

interface CouchQueryServiceDependencies {
  couchRepository: CouchRepository;
}

export class CouchQueryService {
  constructor(private readonly deps: CouchQueryServiceDependencies) {}

  async getById(id: AggregateId): Promise<CouchDto> {
    const couch = await this.deps.couchRepository.get(id);
    return new CouchDto(couch.toDto());
  }

  async getByHostId(hostId: Guid): Promise<CouchDto[]> {
    const couches = await this.deps.couchRepository.getByHostId(hostId);
    return couches.map(couch => new CouchDto(couch.toDto()));
  }
}
