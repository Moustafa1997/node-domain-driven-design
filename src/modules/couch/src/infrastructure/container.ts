import { ContainerBuilder, StandardCreateContainerDependencies } from "@travelhoop/infrastructure";
import { asClass, AwilixContainer } from "awilix";
import { createRouter } from "../api/routes/router";
import { CreateCouchCommandHandler } from "../application/couch/handlers/create-couch/create-couch.handler";
import { UpdateCouchCommandHandler } from "../application/couch/handlers/update-couch/update-couch.handler";
import { CouchQueryService } from "../application/couch/queries/couch-query.service";
import { couchModuleConfigFactory } from "./config";
import { MikroOrmCouchRepository } from "./mikro-orm/repositories/couch.repository";

export const createContainer = ({ dbConnection, redis }: StandardCreateContainerDependencies): AwilixContainer<any> => {
  const config = couchModuleConfigFactory(process.env as any);
  return new ContainerBuilder()
    .addCommon()
    .addAuth({ secretKey: config.jwt.secretKey })
    .addRedis(redis)
    .addRouting(createRouter)
    .addDbConnection(dbConnection)
    .register({
      couchRepository: asClass(MikroOrmCouchRepository),
      couchQueryService: asClass(CouchQueryService),
    })
    .addCommandHandlers({
      commandHandlers: [CreateCouchCommandHandler, UpdateCouchCommandHandler],
    })
    .addEventSubscribers({
      messageBrokerQueueName: config.queues.messageBroker,
      eventSubscribers: [],
    })
    .build();
};
