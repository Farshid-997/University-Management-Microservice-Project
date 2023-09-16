import { Server } from 'http';
import app from './app';
import { errorlogger, logger } from './shared/logger';
import { RedisClient } from './shared/redis';

const port = 5001;
async function bootstrap() {
  await RedisClient.connect();
  const server: Server = app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('Server closed');
      });
    }
    process.exit(1);
  };

  const unexpectedErrorHandler = (error: unknown) => {
    errorlogger.error(error);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  // process.on('SIGTERM', () => {
  //   logger.info('SIGTERM received');
  //   if (server) {
  //     server.close();
  //   }
  // });
}

bootstrap();
