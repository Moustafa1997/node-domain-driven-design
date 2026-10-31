import { Guid } from "guid-typescript";
import { AggregateId } from "@travelhoop/shared-kernel";
import { CouchProps } from "../../../domain";

export class CouchDto {
  id: AggregateId;

  hostId: Guid;

  name: string;

  description: string;

  quantity: number;

  createdAt: Date;

  constructor(props: CouchProps) {
    Object.assign(this, props);
  }
}
