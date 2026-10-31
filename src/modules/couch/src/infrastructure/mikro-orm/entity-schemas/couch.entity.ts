import { EntitySchema } from "@mikro-orm/core";
import { AggregateIdType, GuidType } from "@travelhoop/infrastructure";
import { Couch, CouchProps } from "../../../domain";

export const couchEntitySchema = new EntitySchema<CouchProps>({
  name: "Couch",
  class: Couch as any,
  properties: {
    id: { type: AggregateIdType, primary: true },
    hostId: { type: GuidType },
    name: { type: "string" },
    description: { type: "string" },
    quantity: { type: "number" },
    createdAt: { type: Date },
  },
});
