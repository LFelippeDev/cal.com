import { supabase } from "@/config/supabase";
import { API_VERSIONS_VALUES } from "@/lib/api-versions";
import { Controller, Get } from "@nestjs/common";

@Controller({
  path: "/v2/teste",
  version: API_VERSIONS_VALUES,
})
export class TesteController {
  @Get("/")
  async getBookings(): Promise<any> {
    const { data, error } = await supabase.from("Booking").select("*");

    if (error) {
      throw new Error(error.message);
    }

    return { message: "Dados obtidos com sucesso!", data };
  }
}
