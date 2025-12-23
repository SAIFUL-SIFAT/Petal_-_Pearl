if (!global.crypto) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  global.crypto = require('crypto');
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
