import { Guid } from "guid-typescript";
import { AggregateId } from "@travelhoop/shared-kernel";
import { Couch } from "../entity/couch";

export interface CouchRepository {
  add: (couch: Couch) => Promise<void>;
  save: (couch: Couch) => Promise<void>;
  get: (id: AggregateId) => Promise<Couch>;
  getByHostId: (hostId: Guid) => Promise<Couch[]>;
}
