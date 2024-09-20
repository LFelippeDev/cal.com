import { Controller, Get } from "@nestjs/common";

import { SupabaseService } from "../supabase/supabase.service";

@Controller("v2/teste")
export class TesteController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get()
  async getBookings(): Promise<any> {
    const data = await this.supabaseService.getData("Booking");
    return { message: "Dados obtidos com sucesso!", data };
  }
}
