import { Command } from "@travelhoop/abstract-core";

interface CreateCouchCommandPayload {
  hostId: string;
  name: string;
  description: string;
  quantity: number;
}

export class CreateCouchCommand implements Command<CreateCouchCommandPayload> {
  constructor(public payload: CreateCouchCommandPayload) {}
}
