import * as crypto from 'crypto';

// Polyfill for Node.js < 20 where crypto is not global
if (!global.crypto) {
  (global as any).crypto = crypto;
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Request Logging Middleware
  app.use((req: any, res: any, next: any) => {
    console.log(`[Request] ${req.method} ${req.url}`);
    next();
  });

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Security
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  const frontendUrl = process.env.FRONTEND_URL;
  app.enableCors({
    origin: [
      frontendUrl,
      'http://localhost:8080',
      'http://localhost:5173',
      'http://localhost:3000',
    ].filter((origin): origin is string => !!origin),
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
