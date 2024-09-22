import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { supabase } from "../../config/supabase";

const credentialForCalendarRepositorySelect = Prisma.validator<Prisma.CredentialSelect>()({
  id: true,
  appId: true,
  type: true,
  userId: true,
  user: {
    select: {
      email: true,
    },
  },
  teamId: true,
  key: true,
  invalid: true,
});

@Injectable()
export class CalendarsRepository {
  async getCalendarCredentials(credentialId: number, userId: number) {
    const { data, error } = await supabase
      .from("Credential")
      .select("*")
      .eq("id", credentialId)
      .eq("userId", userId)
      .limit(1)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // TODO: PrismaWriteService
  async deleteCredentials(credentialId: number) {
    // return await this.dbWrite.prisma.credential.delete({
    //   where: {
    //     id: credentialId,
    //   },
    // });
  }
}
