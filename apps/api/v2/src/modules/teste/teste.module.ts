import { Module } from "@nestjs/common";

import { SupabaseModule } from "../supabase/supabase.module";
import { TesteController } from "./teste.controller";

@Module({
  imports: [SupabaseModule],
  controllers: [TesteController],
})
export class TesteModule {}
