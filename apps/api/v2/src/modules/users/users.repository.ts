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
    const { data } = await supabase
      .from("users")
      .update({
        platformOAuthClients: {
          id: oAuthClientId,
        },
      })
      .eq("id", userId)
      .select("*");

    return data;
  }
  // TODO: PrismaReadService
  async findById(userId: number) {
    // return this.dbRead.prisma.user.findUnique({
    //   where: {
    //     id: userId,
    //   },
    // });
  }
  // TODO: PrismaReadService
  async findByIdWithinPlatformScope(userId: number, clientId: string) {
    // return this.dbRead.prisma.user.findFirst({
    //   where: {
    //     id: userId,
    //     isPlatformManaged: true,
    //     platformOAuthClients: {
    //       some: {
    //         id: clientId,
    //       },
    //     },
    //   },
    // });
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
  // TODO: PrismaReadService
  async findManagedUsersByOAuthClientId(oauthClientId: string, cursor: number, limit: number) {
    // return this.dbRead.prisma.user.findMany({
    //   where: {
    //     platformOAuthClients: {
    //       some: {
    //         id: oauthClientId,
    //       },
    //     },
    //     isPlatformManaged: true,
    //   },
    //   take: limit,
    //   skip: cursor,
    // });
  }

  async update(userId: number, updateData: UpdateManagedUserInput) {
    this.formatInput(updateData);

    const { data } = await supabase.from("users").update(updateData).eq("id", userId);

    return data;
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
