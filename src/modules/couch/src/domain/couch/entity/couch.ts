import { Guid } from "guid-typescript";
import { AggregateId, AggregateRoot } from "@travelhoop/shared-kernel";

export interface CouchProps {
  id: AggregateId;
  hostId: Guid;
  name: string;
  description: string;
  quantity: number;
  createdAt: Date;
}

export type CreateCouch = Omit<CouchProps, "createdAt">;

export interface UpdateCouch {
  name: string;
  description: string;
  quantity: number;
}

export class Couch extends AggregateRoot {
  private hostId: Guid;

  private name: string;

  private description: string;

  private quantity: number;

  private createdAt: Date;

  private constructor(props: CouchProps) {
    super();
    this.id = props.id;
    this.hostId = props.hostId;
    this.name = props.name;
    this.description = props.description;
    this.quantity = props.quantity;
    this.createdAt = props.createdAt;
  }

  static create(props: CreateCouch) {
    return new Couch({ ...props, createdAt: new Date() });
  }

  update({ name, description, quantity }: UpdateCouch) {
    this.name = name;
    this.description = description;
    this.quantity = quantity;
  }

  toDto(): CouchProps {
    return {
      id: this.id,
      hostId: this.hostId,
      name: this.name,
      description: this.description,
      quantity: this.quantity,
      createdAt: this.createdAt,
    };
  }
}
