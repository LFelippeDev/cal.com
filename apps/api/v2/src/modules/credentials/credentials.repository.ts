import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { APPS_TYPE_ID_MAPPING } from "@calcom/platform-constants";

import { supabase } from "../../config/supabase";

@Injectable()
export class CredentialsRepository {
  // TODO: PrismaWriteService
  async createAppCredential(
    type: keyof typeof APPS_TYPE_ID_MAPPING,
    key: Prisma.InputJsonValue,
    userId: number
  ) {
    // const credential = await this.getByTypeAndUserId(type, userId);
    // return this.dbWrite.prisma.credential.upsert({
    //   create: {
    //     type,
    //     key,
    //     userId,
    //     appId: APPS_TYPE_ID_MAPPING[type],
    //   },
    //   update: {
    //     key,
    //     invalid: false,
    //   },
    //   where: {
    //     id: credential?.id ?? 0,
    //   },
    // });
  }
  // TODO: PrismaWriteService
  getByTypeAndUserId(type: string, userId: number) {
    // return this.dbWrite.prisma.credential.findFirst({ where: { type, userId } });
  }

  getUserCredentialsByIds(userId: number, credentialIds: number[]) {
    return supabase
      .from("credentials")
      .select("id, type, key, userId, teamId, appId, invalid")
      .in("id", credentialIds)
      .eq("userId", userId);
  }
}

export type CredentialsWithUserEmail = Awaited<
  ReturnType<typeof CredentialsRepository.prototype.getUserCredentialsByIds>
>;
