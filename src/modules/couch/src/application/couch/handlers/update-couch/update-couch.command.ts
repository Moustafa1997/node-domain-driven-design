import { Command } from "@travelhoop/abstract-core";

interface UpdateCouchCommandPayload {
  id: string;
  name: string;
  description: string;
  quantity: number;
}

export class UpdateCouchCommand implements Command<UpdateCouchCommandPayload> {
  constructor(public payload: UpdateCouchCommandPayload) {}
}
