import { Injectable } from "@nestjs/common";

import { supabase } from "../../config/supabase";

@Injectable()
export class SelectedCalendarsRepository {
  // TODO: PrismaWriteService
  createSelectedCalendar(externalId: string, credentialId: number, userId: number, integration: string) {
    // return this.dbWrite.prisma.selectedCalendar.upsert({
    //   create: {
    //     userId,
    //     externalId,
    //     credentialId,
    //     integration,
    //   },
    //   update: {
    //     userId,
    //     externalId,
    //     credentialId,
    //     integration,
    //   },
    //   where: {
    //     userId_integration_externalId: {
    //       userId,
    //       integration,
    //       externalId,
    //     },
    //   },
    // });
  }
  // TODO: PrismaReadService
  getUserSelectedCalendars(userId: number) {
    // return this.dbRead.prisma.selectedCalendar.findMany({
    //   where: {
    //     userId,
    //   },
    // });
  }

  async addUserSelectedCalendar(
    userId: number,
    integration: string,
    externalId: string,
    credentialId: number
  ) {
    return await supabase.from("SelectedCalendar").upsert({
      where: {
        userId_integration_externalId: {
          userId,
          integration,
          externalId,
        },
      },
      create: {
        userId,
        integration,
        externalId,
        credentialId,
      },
      // already exists
      update: {},
    });
  }

  async removeUserSelectedCalendar(userId: number, integration: string, externalId: string) {
    return await supabase
      .from("SelectedCalendar")
      .delete()
      .eq("userId", userId)
      .eq("integration", integration)
      .eq("externalId", externalId);
  }
}
