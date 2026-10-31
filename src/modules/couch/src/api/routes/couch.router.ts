import { makeInvoker } from "awilix-express";
import { validateOrReject } from "class-validator";
import { AggregateId } from "@travelhoop/shared-kernel";
import { CommandDispatcher } from "@travelhoop/abstract-core";
import { Request, Response } from "@travelhoop/infrastructure";
import asyncHandler from "express-async-handler";
import { CreateCouchDto } from "../../application/couch/dto/create-couch.dto";
import { UpdateCouchDto } from "../../application/couch/dto/update-couch.dto";
import { CreateCouchCommand } from "../../application/couch/handlers/create-couch/create-couch.command";
import { UpdateCouchCommand } from "../../application/couch/handlers/update-couch/update-couch.command";
import { CouchQueryService } from "../../application/couch/queries/couch-query.service";

interface CouchApiDependencies {
  commandDispatcher: CommandDispatcher;
  couchQueryService: CouchQueryService;
}

const api = ({ commandDispatcher, couchQueryService }: CouchApiDependencies) => ({
  create: asyncHandler(async (req: Request, res: Response) => {
    const dto = new CreateCouchDto({ ...req.body, hostId: req.user?.id! });
    await validateOrReject(dto);
    const command = new CreateCouchCommand({
      hostId: dto.hostId,
      name: dto.name,
      description: dto.description,
      quantity: dto.quantity,
    });
    res.json(await commandDispatcher.execute(command));
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    const dto = new UpdateCouchDto({ id: req.params.id, hostId: req.user?.id!, ...req.body });
    await validateOrReject(dto);
    const command = new UpdateCouchCommand({
      id: dto.id,
      name: dto.name,
      description: dto.description,
      quantity: dto.quantity,
    });
    res.json(await commandDispatcher.execute(command));
  }),
  getByUserId: asyncHandler(async (req: Request, res: Response) => {
    res.json(await couchQueryService.getByHostId(req.user?.id!));
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    res.json(await couchQueryService.getById(AggregateId.parse(req.params.couchId)));
  }),
});

export const couchApi = makeInvoker(api);
