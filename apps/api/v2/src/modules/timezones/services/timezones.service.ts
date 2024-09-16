import { Injectable } from "@nestjs/common";

import { cityTimezonesHandler } from "@calcom/platform-libraries";
import type { CityTimezones } from "@calcom/platform-libraries";

import { RedisService } from "../../redis/redis.service";

@Injectable()
export class TimezonesService {
  constructor(private readonly _redisService: RedisService) {}
  async getCityTimeZones(): Promise<CityTimezones> {
    const timezones = await cityTimezonesHandler();

    return timezones;
  }
}
