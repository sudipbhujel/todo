import { Module } from '@nestjs/common';
import { UsersModule } from '@modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { PrismaService } from '@modules/database/prisma.service';
import { DatabaseModule } from '@modules/database/database.module';
import { TodosModule } from './modules/todos/todos.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        BASE_URL: Joi.string().required(),
        PORT: Joi.number().default(4000),
        NODE_ENV: Joi.string().default('development'),
        DATABASE_URL: Joi.string().required(),
        CORS: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
      envFilePath: '.env',
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'uploads'),
    // }),
    UsersModule,
    DatabaseModule,
    TodosModule,
    AuthModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
