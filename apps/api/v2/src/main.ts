import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { WinstonModule } from "nest-winston";
import type { AppConfig } from "src/config/type";

import { AppModule } from "./app.module";
import { loggerConfig } from "./lib/logger";

const run = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger(loggerConfig()),
    bodyParser: false,
  });

  const logger = new Logger("App");

  try {
    // bootstrap(app);
    const port = app.get(ConfigService<AppConfig, true>).get("api.port", { infer: true });
    // void generateSwagger(app);
    await app.listen(port);
    logger.log(`Application started on port: ${port}`);
  } catch (error) {
    console.error(error);
    logger.error("Application crashed", {
      error,
    });
  }
};

run().catch((error: Error) => {
  console.error("Failed to start Cal Platform API", { error: error.stack });
  process.exit(1);
});
