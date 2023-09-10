import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from '@modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { PrismaService } from '@modules/database/prisma.service';
import { DatabaseModule } from '@modules/database/database.module';
import { TodosModule } from './modules/todos/todos.module';
import { AuthModule } from './modules/auth/auth.module';
import {
  PrometheusModule,
  makeCounterProvider,
  makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logging.interceptor';
import { ApiMetricsMiddleware } from './middlewares/api-metrics.middleware';

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
    // Prometheus
    PrometheusModule.register({
      path: '/metrics',
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'uploads'),
    // }),
    UsersModule,
    DatabaseModule,
    TodosModule,
    AuthModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    makeHistogramProvider({
      name: 'http_request_duration_milliseconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'code'],
      buckets: [100, 200, 300, 500, 800, 1000, 1500, 2000],
    }),
    makeHistogramProvider({
      name: 'http_request_size_bytes',
      help: 'Size of HTTP requests in bytes',
      labelNames: ['method', 'route', 'code'],
      buckets: [100, 200, 300, 500, 800, 1000, 1500, 2000],
    }),
    makeHistogramProvider({
      name: 'http_response_size_bytes',
      help: 'Size of HTTP responses in bytes',
      labelNames: ['method', 'route', 'code'],
      buckets: [100, 200, 300, 500, 800, 1000, 1500, 2000],
    }),
    makeCounterProvider({
      name: 'http_all_request_total',
      help: 'Total number of all HTTP requests',
      labelNames: ['method', 'route', 'code'],
    }),
    makeCounterProvider({
      name: 'http_all_success_total',
      help: 'Total number of all HTTP success',
      labelNames: ['method', 'route', 'code'],
    }),
    makeCounterProvider({
      name: 'http_all_errors_total',
      help: 'Total number of all HTTP errors',
      labelNames: ['method', 'route', 'code'],
    }),
    makeCounterProvider({
      name: 'http_all_client_error_total',
      help: 'Total number of all HTTP client errors',
      labelNames: ['method', 'route', 'code'],
    }),
    makeCounterProvider({
      name: 'http_all_server_error_total',
      help: 'Total number of all HTTP server errors',
      labelNames: ['method', 'route', 'code'],
    }),
    makeCounterProvider({
      name: 'http_request_total',
      help: 'Total number of all HTTP requests',
      labelNames: ['method', 'route', 'code'],
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // apply to all except /metrics
    consumer.apply(ApiMetricsMiddleware).forRoutes('*');
  }
}
