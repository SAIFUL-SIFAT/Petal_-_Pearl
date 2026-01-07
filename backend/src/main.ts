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
import { existsSync, mkdirSync } from 'fs';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Trust proxy for accurate req.protocol and req.get('host') in deployed environments
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  // Ensure static directories exist
  const publicPath = join(process.cwd(), 'public');
  const assetsPath = join(publicPath, 'assets');
  if (!existsSync(publicPath)) mkdirSync(publicPath, { recursive: true });
  if (!existsSync(assetsPath)) mkdirSync(assetsPath, { recursive: true });

  // Serve static files from public directory
  app.useStaticAssets(publicPath, {
    prefix: '/',
    setHeaders: (res) => {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    }
  });

  // Security
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  }));

  const allowedOrigins = [
    // Production Frontend
    'https://petalpearl.netlify.app',

    // Development / Localhost
    'http://localhost:8080',
    'http://localhost:5173',
    'http://localhost:3000',

    // Dynamic Environment Variable (if set)
    process.env.FRONTEND_URL,
  ].filter((origin): origin is string => !!origin);

  app.enableCors({
    origin: allowedOrigins,
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
