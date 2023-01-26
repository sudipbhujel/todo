import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/main.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaService } from '@modules/database/prisma.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const logger = new Logger('Main');

  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');

  const whitelist = configService.get('CORS').split(',');

  app.set('trust proxy', 1);

  app.use(cookieParser());

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  logger.log('Whilelist', whitelist);

  app.enableCors({
    origin: function (origin: string, callback: any) {
      logger.log(`origin: ${origin}`);
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        logger.log(`Not allowed by CORS: ${origin}`);
        callback(null, false);
      }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Total-Count'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    preflightContinue: false,
    optionsSuccessStatus: 200,
  });

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  app.setGlobalPrefix('/v1');

  const config = new DocumentBuilder()
    .addServer('http://localhost:4000')
    .addBearerAuth()
    .addCookieAuth()
    .setTitle('Todo API')
    .setDescription('A simple todo API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(PORT, () => {
    logger.log(`Listening on port ${PORT}`);
  });
}
bootstrap();
