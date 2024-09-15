import { Controller, Get, Version, VERSION_NEUTRAL } from "@nestjs/common";
import { ApiTags as DocsTags } from "@nestjs/swagger";
import * as fs from "fs";

// import { getEnv } from "src/env";

@Controller()
@DocsTags("Health - development only")
// @DocsExcludeController(getEnv("NODE_ENV") === "production")
export class AppController {
  @Get("health")
  @Version(VERSION_NEUTRAL)
  getHealth(): string {
    // retorna todos os arquivos desta pasta
    const path = JSON.stringify(fs.readdirSync(__dirname));

    return path;
  }
}
