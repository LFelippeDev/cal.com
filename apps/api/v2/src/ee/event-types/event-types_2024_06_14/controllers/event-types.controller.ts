import {
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Body,
  NotFoundException,
  Patch,
  HttpCode,
  HttpStatus,
  Delete,
  Query,
} from "@nestjs/common";
import { ApiTags as DocsTags } from "@nestjs/swagger";

import { ERROR_STATUS, EVENT_TYPE_READ, EVENT_TYPE_WRITE, SUCCESS_STATUS } from "@calcom/platform-constants";
import {
  CreateEventTypeInput_2024_06_14,
  UpdateEventTypeInput_2024_06_14,
  GetEventTypesQuery_2024_06_14,
} from "@calcom/platform-types";

import { supabase } from "../../../../config/supabase";
import { VERSION_2024_06_14_VALUE } from "../../../../lib/api-versions";
import { GetUser } from "../../../../modules/auth/decorators/get-user/get-user.decorator";
import { Permissions } from "../../../../modules/auth/decorators/permissions/permissions.decorator";
import { ApiAuthGuard } from "../../../../modules/auth/guards/api-auth/api-auth.guard";
import { PermissionsGuard } from "../../../../modules/auth/guards/permissions/permissions.guard";
import { UserWithProfile } from "../../../../modules/users/users.repository";
import { CreateEventTypeOutput_2024_06_14 } from "../outputs/create-event-type.output";
import { DeleteEventTypeOutput_2024_06_14 } from "../outputs/delete-event-type.output";
import { GetEventTypeOutput_2024_06_14 } from "../outputs/get-event-type.output";
import { GetEventTypesOutput_2024_06_14 } from "../outputs/get-event-types.output";
import { UpdateEventTypeOutput_2024_06_14 } from "../outputs/update-event-type.output";
import { EventTypesService_2024_06_14 } from "../services/event-types.service";

@Controller({
  path: "/v2/event-types",
  version: VERSION_2024_06_14_VALUE,
})
// @UseGuards(PermissionsGuard)
@DocsTags("Event types")
export class EventTypesController_2024_06_14 {
  constructor(private readonly eventTypesService: EventTypesService_2024_06_14) {}

  @Post("/")
  // @Permissions([EVENT_TYPE_WRITE])
  // @UseGuards(ApiAuthGuard)
  async createEventType(
    @Body() body: CreateEventTypeInput_2024_06_14
  ): Promise<CreateEventTypeOutput_2024_06_14> {
    // const existsWithSlug = await supabase.from("EventType").select("*").eq("slug", body.slug).limit(1).single();
    //  this.dbRead.prisma.eventType.findUnique({
    //   //   where: {
    //   //     userId_slug: {
    //   //       userId: userId,
    //   //       slug: slug,
    //   //     },
    //   //   },
    //   //   include: { users: true, schedule: true },
    //   // });
    // if (existsWithSlug) {
    //   throw new BadRequestException("User already has an event type with this slug.");
    // }
    // await this.checkUserOwnsSchedule(userId, body.scheduleId);
    // const eventType = await this.eventTypesService.createUserEventType(user, body);

    return {
      status: SUCCESS_STATUS,
      data: eventType,
    };
  }

  @Get("/:eventTypeId")
  // @Permissions([EVENT_TYPE_READ])
  // @UseGuards(ApiAuthGuard)
  async getEventTypeById(@Param("eventTypeId") eventTypeId: string): Promise<GetEventTypeOutput_2024_06_14> {
    const { data: eventType } = await supabase
      .from("EventType")
      .select("*")
      .eq("id", eventTypeId)
      .limit(1)
      .single();

    if (!eventType) {
      throw new NotFoundException(`Event type with ID=${eventTypeId} does not exist.`);
    }

    return {
      status: SUCCESS_STATUS,
      data: eventType as any,
    };
  }

  @Get("/")
  async getEventTypes(
    @Query() queryParams: GetEventTypesQuery_2024_06_14
  ): Promise<GetEventTypesOutput_2024_06_14> {
    const { eventSlug, username, usernames } = queryParams;
    let supabaseQuery = supabase.from("EventType").select("*");

    switch (true) {
      case !!username:
        const { data: user } = await supabase
          .from("users")
          .select("id")
          .eq("username", username)
          .limit(1)
          .single();

        if (!user)
          return {
            status: SUCCESS_STATUS,
            data: [],
          };
        supabaseQuery = supabaseQuery.eq("userId", user.id);
      // case !!usernames:
      //   const { data: users } = await supabase
      //     .from("users")
      //     .select("id")
      //     .in("username", usernames as string[]);

      //   if (!users)
      //     return {
      //       status: SUCCESS_STATUS,
      //       data: [],
      //     };

      //   const userIds = users.map((user) => user.id);

      //   supabaseQuery = supabaseQuery.in("userId", userIds as string[]);
      // case !!eventSlug:
      //   supabaseQuery = supabaseQuery.eq("slug", eventSlug);
    }

    const { data: eventTypes, error } = await supabaseQuery;

    if (error)
      return {
        status: ERROR_STATUS,
        data: error,
      };

    return {
      status: SUCCESS_STATUS,
      data: eventTypes,
    };
  }

  @Patch("/:eventTypeId")
  // @Permissions([EVENT_TYPE_WRITE])
  // @UseGuards(ApiAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateEventType(
    @Param("eventTypeId") eventTypeId: number,
    @Body() body: UpdateEventTypeInput_2024_06_14
  ): Promise<UpdateEventTypeOutput_2024_06_14> {
    const { data: eventType } = await supabase
      .from("EventType")
      .select("id, slug, title")
      .eq("id", eventTypeId)
      .limit(1)
      .single();

    if (!eventType) {
      throw new NotFoundException(`Event type with ID=${eventTypeId} does not exist.`);
    }

    const { data: newEventType } = await supabase
      .from("EventType")
      .update(body)
      .eq("id", eventTypeId)
      .select("*");

    return {
      status: SUCCESS_STATUS,
      data: newEventType as any,
    };
  }

  @Delete("/:eventTypeId")
  // @Permissions([EVENT_TYPE_WRITE])
  // @UseGuards(ApiAuthGuard)
  async deleteEventType(
    @Param("eventTypeId") eventTypeId: number
  ): Promise<DeleteEventTypeOutput_2024_06_14> {
    const { data: eventType } = await supabase
      .from("EventType")
      .select("id, slug, title, length")
      .eq("id", eventTypeId)
      .limit(1)
      .single();

    if (!eventType) {
      throw new NotFoundException(`Event type with ID=${eventTypeId} does not exist.`);
    }

    await supabase.from("EventType").delete().eq("id", eventTypeId);

    return {
      status: SUCCESS_STATUS,
      data: {
        id: eventType.id,
        lengthInMinutes: eventType.length,
        slug: eventType.slug,
        title: eventType.title,
      },
    };
  }
}
