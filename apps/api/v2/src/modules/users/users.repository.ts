import { Injectable } from "@nestjs/common";
import type { Profile, Team, User } from "@prisma/client";

import { supabase } from "../../config/supabase";
import { CreateManagedUserInput } from "../users/inputs/create-managed-user.input";
import { UpdateManagedUserInput } from "../users/inputs/update-managed-user.input";

export type UserWithProfile = User & {
  movedToProfile?: (Profile & { organization: Pick<Team, "isPlatform" | "id" | "slug" | "name"> }) | null;
  profiles?: (Profile & { organization: Pick<Team, "isPlatform" | "id" | "slug" | "name"> })[];
};

@Injectable()
export class UsersRepository {
  // TODO: PrismaWriteService
  async create(
    user: CreateManagedUserInput,
    username: string,
    oAuthClientId: string,
    isPlatformManaged: boolean
  ) {
    // this.formatInput(user);
    // return this.dbWrite.prisma.user.create({
    //   data: {
    //     ...user,
    //     username,
    //     platformOAuthClients: {
    //       connect: { id: oAuthClientId },
    //     },
    //     isPlatformManaged,
    //   },
    // });
  }
  async addToOAuthClient(userId: number, oAuthClientId: string) {
    const { data, error } = await supabase
      .from("users")
      .update({
        platformOAuthClients: [oAuthClientId],
      })
      .eq("id", userId)
      .select("*");

    return error || data;
  }
  // TODO: PrismaReadService
  async findById(userId: number) {
    // return this.dbRead.prisma.user.findUnique({
    //   where: {
    //     id: userId,
    //   },
    // });
  }

  async findByIdWithinPlatformScope(userId: number, clientId: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .eq("isPlatformManaged", true)
      .contains("platformOAuthClients", clientId)
      .single();

    return error || data;
  }
  // TODO: PrismaReadService
  async findByIdWithProfile(userId: number): Promise<UserWithProfile | null> {
    // console.log("findByIdWithProfile");
    // return this.dbRead.prisma.user.findUnique({
    //   where: {
    //     id: userId,
    //   },
    //   include: {
    //     movedToProfile: {
    //       include: { organization: { select: { isPlatform: true, name: true, slug: true, id: true } } },
    //     },
    //     profiles: {
    //       include: { organization: { select: { isPlatform: true, name: true, slug: true, id: true } } },
    //     },
    //   },
    // });

    // tirar essa linha
    return new Promise((resolve) => resolve({} as UserWithProfile));
  }
  // TODO: PrismaReadService
  async findByIdsWithEventTypes(userIds: number[]) {
    // return this.dbRead.prisma.user.findMany({
    //   where: {
    //     id: {
    //       in: userIds,
    //     },
    //   },
    //   include: {
    //     eventTypes: true,
    //   },
    // });
  }
  // TODO: PrismaReadService
  async findByIds(userIds: number[]) {
    // return this.dbRead.prisma.user.findMany({
    //   where: {
    //     id: {
    //       in: userIds,
    //     },
    //   },
    // });
  }
  // TODO: PrismaReadService
  async findByIdWithCalendars(userId: number) {
    // return this.dbRead.prisma.user.findUnique({
    //   where: {
    //     id: userId,
    //   },
    //   include: {
    //     selectedCalendars: true,
    //     destinationCalendar: true,
    //   },
    // });
  }

  async findByEmail(email: string) {
    const { data: user } = await supabase.from("users").select("*").eq("email", email).limit(1).single();
    return user;
  }

  // TODO: PrismaReadService
  async findByEmailWithProfile(email: string) {
    // return this.dbRead.prisma.user.findUnique({
    //   where: {
    //     email,
    //   },
    //   include: {
    //     movedToProfile: {
    //       include: { organization: { select: { isPlatform: true, name: true, slug: true, id: true } } },
    //     },
    //     profiles: {
    //       include: { organization: { select: { isPlatform: true, name: true, slug: true, id: true } } },
    //     },
    //   },
    // });
  }
  // TODO: PrismaReadService
  async findByUsername(username: string) {
    // return this.dbRead.prisma.user.findFirst({
    //   where: {
    //     username,
    //   },
    // });
  }

  async findManagedUsersByOAuthClientId(oauthClientId: string, cursor: number, limit: number) {
    const range = (cursor ?? 0) + (limit ?? 10) - 1;
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("isPlatformManaged", true)
      .contains("platformOAuthClients", oauthClientId)
      .limit(limit)
      .range(cursor, range);

    return error || data;
  }

  async update(userId: number, updateData: UpdateManagedUserInput) {
    this.formatInput(updateData);

    return updateData;

    const { data, error } = await supabase.from("users").update(updateData).eq("id", userId);

    return error || data;
  }
  // TODO: PrismaWriteService
  async updateUsername(userId: number, newUsername: string) {
    // return this.dbWrite.prisma.user.update({
    //   where: { id: userId },
    //   data: {
    //     username: newUsername,
    //   },
    // });
  }
  // TODO: PrismaWriteService
  async delete(userId: number): Promise<User> {
    // return this.dbWrite.prisma.user.delete({
    //   where: { id: userId },
    // });

    // tirar essa linha
    return new Promise((resolve) => resolve({} as User));
  }

  formatInput(userInput: CreateManagedUserInput | UpdateManagedUserInput) {
    if (userInput.weekStart) {
      userInput.weekStart = userInput.weekStart;
    }
  }
  // TODO: PrismaWriteService
  setDefaultSchedule(userId: number, scheduleId: number) {
    // return this.dbWrite.prisma.user.update({
    //   where: { id: userId },
    //   data: {
    //     defaultScheduleId: scheduleId,
    //   },
    // });
  }

  async getUserScheduleDefaultId(userId: number) {
    // const user = await this.findById(userId);
    // if (!user?.defaultScheduleId) return null;
    // return user?.defaultScheduleId;
  }
  // TODO: PrismaReadService
  async getOrganizationUsers(organizationId: number) {
    // const profiles = await this.dbRead.prisma.profile.findMany({
    //   where: {
    //     organizationId,
    //   },
    //   include: {
    //     user: true,
    //   },
    // });
    // return profiles.map((profile) => profile.user);
  }
}
