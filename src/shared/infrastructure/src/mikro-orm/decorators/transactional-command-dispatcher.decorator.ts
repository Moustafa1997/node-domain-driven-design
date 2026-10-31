import { Command, CommandDispatcher } from "@travelhoop/abstract-core";
import { DbConnection } from "../db-connection";

interface TransactionalCommandDispatcherDecoratorDependencies {
  commandDispatcher: CommandDispatcher;
  dbConnection: DbConnection;
}

/**
 * Wraps command handling in a single database transaction (unit of work).
 *
 * All repositories resolve their EntityManager from the request-scoped
 * `RequestContext` fork (see the `requestContext` middleware), which is the same
 * instance exposed here as `dbConnection.em`. Opening the transaction on that
 * fork therefore makes every `persistAndFlush` performed by a handler
 * participate in one atomic transaction: it commits only if the whole command
 * succeeds, and rolls back entirely on any error.
 */
export class TransactionalCommandDispatcherDecorator implements CommandDispatcher {
  constructor(private readonly deps: TransactionalCommandDispatcherDecoratorDependencies) {}

  async execute(command: Command<unknown>): Promise<void> {
    const { em } = this.deps.dbConnection;

    await em.begin();

    try {
      await this.deps.commandDispatcher.execute(command);
      await em.commit();
    } catch (error) {
      await em.rollback();
      throw error;
    }
  }
}
