import { BullModule } from "@nestjs/bull";
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { seconds, ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { ThrottlerStorageRedisService } from "nestjs-throttler-storage-redis";

// import { AppLoggerMiddleware } from "src/middleware/app.logger.middleware";
// import { RewriterMiddleware } from "src/middleware/app.rewrites.middleware";
// import { JsonBodyMiddleware } from "src/middleware/body/json.body.middleware";
// import { RawBodyMiddleware } from "src/middleware/body/raw.body.middleware";
// import { ResponseInterceptor } from "src/middleware/request-ids/request-id.interceptor";
// import { RequestIdMiddleware } from "src/middleware/request-ids/request-id.middleware";
// import { AuthModule } from "src/modules/auth/auth.module";
// import { EndpointsModule } from "src/modules/endpoints.module";
// import { JwtModule } from "src/modules/jwt/jwt.module";
// import { PrismaModule } from "src/modules/prisma/prisma.module";
// import { RedisModule } from "src/modules/redis/redis.module";
// import { RedisService } from "src/modules/redis/redis.service";
import { AppController } from "./app.controller";
import appConfig from "./config/app";

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [appConfig],
    }),

    // RedisModule,
    BullModule.forRoot({
      redis: `${process.env.REDIS_URL}${process.env.NODE_ENV === "production" ? "?tls=true" : ""}`,
    }),
    // ThrottlerModule.forRootAsync({
    //   imports: [RedisModule],
    //   inject: [RedisService],
    //   useFactory: (redisService: RedisService) => ({
    //     throttlers: [
    //       {
    //         name: "long",
    //         ttl: seconds(60), // Time to live for the long period in seconds
    //         limit: 120, // Maximum number of requests within the long ttl
    //       },
    //     ],
    //     storage: new ThrottlerStorageRedisService(redisService.redis),
    //   }),
    // }),
    // PrismaModule,
    // EndpointsModule,
    // AuthModule,
    // JwtModule,
  ],
  controllers: [AppController],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ResponseInterceptor,
    // },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    // consumer
    //   .apply(RawBodyMiddleware)
    //   .forRoutes({
    //     path: "/api/v2/billing/webhook",
    //     method: RequestMethod.POST,
    //   })
    //   .apply(JsonBodyMiddleware)
    //   .forRoutes("*")
    //   .apply(RequestIdMiddleware)
    //   .forRoutes("*")
    //   .apply(AppLoggerMiddleware)
    //   .forRoutes("*")
    //   .apply(RewriterMiddleware)
    //   .forRoutes("/");
  }
}
