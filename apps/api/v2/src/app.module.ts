import { Module } from "@nestjs/common";
import { EndpointsModule } from "src/modules/endpoints.module";

import { AppController } from "./app.controller";

@Module({
  imports: [EndpointsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
