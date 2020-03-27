import {CustomLogger} from '../logger/logger';

export class HandlerError {

  private static fatalErrors(err: any, req: any, res: any, next: any): void {
    console.error(`Fatal error: ${err.message}`);
    console.error(`Fatal error: ${err.stack}`);
    process.exit(1);
  }

  public static errors(err: any, req: any, res: any, next: any): void {
    const logger = CustomLogger.bootstrap();
    logger.error(JSON.stringify(err));
    return res.status(500).send(JSON.stringify(err));
  }

  public static exceptionAndRejection(): void {
    process.on('uncaughtException', HandlerError.fatalErrors);
    process.on('unhandledRejection', HandlerError.fatalErrors);
  }

}
