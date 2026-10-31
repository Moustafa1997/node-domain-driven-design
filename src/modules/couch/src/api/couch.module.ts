import { standardAppModuleFactory, AppModule } from "@travelhoop/infrastructure";
import { createContainer } from "../infrastructure/container";

export const couchModule: AppModule = standardAppModuleFactory({
  basePath: "couch",
  name: "couch-module",
  createContainer,
});
