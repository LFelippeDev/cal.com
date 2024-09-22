import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { CreateAvailabilityInput_2024_04_15 } from "./inputs/create-availability.input";
import { CreateScheduleInput_2024_04_15 } from "./inputs/create-schedule.input";

@Injectable()
export class SchedulesRepository_2024_04_15 {
  // TODO: PrismaWriteService
  async createScheduleWithAvailabilities(
    userId: number,
    schedule: CreateScheduleInput_2024_04_15,
    availabilities: CreateAvailabilityInput_2024_04_15[]
  ) {
    // const createScheduleData: Prisma.ScheduleCreateInput = {
    //   user: {
    //     connect: {
    //       id: userId,
    //     },
    //   },
    //   name: schedule.name,
    //   timeZone: schedule.timeZone,
    // };
    // if (availabilities.length > 0) {
    //   createScheduleData.availability = {
    //     createMany: {
    //       data: availabilities.map((availability) => {
    //         return {
    //           days: availability.days,
    //           startTime: availability.startTime,
    //           endTime: availability.endTime,
    //           userId,
    //         };
    //       }),
    //     },
    //   };
    // }
    // const createdSchedule = await this.dbWrite.prisma.schedule.create({
    //   data: {
    //     ...createScheduleData,
    //   },
    //   include: {
    //     availability: true,
    //   },
    // });
    // return createdSchedule;
  }
  // TODO: PrismaReadService
  async getScheduleById(scheduleId: number) {
    // const schedule = await this.dbRead.prisma.schedule.findUnique({
    //   where: {
    //     id: scheduleId,
    //   },
    //   include: {
    //     availability: true,
    //   },
    // });
    // return schedule;
  }
  // TODO: PrismaReadService
  async getSchedulesByUserId(userId: number) {
    // const schedules = await this.dbRead.prisma.schedule.findMany({
    //   where: {
    //     userId,
    //   },
    //   include: {
    //     availability: true,
    //   },
    // });
    // return schedules;
  }
  // TODO: PrismaWriteService
  async deleteScheduleById(scheduleId: number) {
    // return this.dbWrite.prisma.schedule.delete({
    //   where: {
    //     id: scheduleId,
    //   },
    // });
  }
  // TODO: PrismaReadService
  async getUserSchedulesCount(userId: number) {
    // return this.dbRead.prisma.schedule.count({
    //   where: {
    //     userId,
    //   },
    // });
  }
}
