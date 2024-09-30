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
  Headers,
  BadRequestException,
} from "@nestjs/common";
import { ApiTags as DocsTags } from "@nestjs/swagger";

import { ERROR_STATUS, EVENT_TYPE_READ, EVENT_TYPE_WRITE, SUCCESS_STATUS } from "@calcom/platform-constants";
import {
  CreateEventTypeInput_2024_06_14,
  UpdateEventTypeInput_2024_06_14,
  GetEventTypesQuery_2024_06_14,
} from "@calcom/platform-types";
import { SchedulingType } from "@calcom/prisma/enums";
import { TCreateInputSchema } from "@calcom/trpc/server/routers/viewer/eventTypes/create.schema";

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
@DocsTags("Event types")
export class EventTypesController_2024_06_14 {
  constructor(private readonly eventTypesService: EventTypesService_2024_06_14) {}

  @Post("/")
  async createEventType(
    @Body() body: CreateEventTypeInput_2024_06_14,
    @Headers("Authorization") apiKey: string
  ): Promise<CreateEventTypeOutput_2024_06_14> {
    await this.validateApiKey(apiKey);
    const userId = body.userId;
    const scheduleId = body.scheduleId;

    if (!userId) throw new BadRequestException("User ID is required.");
    if (!scheduleId) throw new BadRequestException("Schedule ID is required.");

    const { data: existsWithSlug } = await supabase
      .from("EventType")
      .select("id")
      .eq("slug", body.slug)
      .eq("userId", userId)
      .limit(1)
      .single();

    if (existsWithSlug) throw new BadRequestException("User already has an event type with this slug.");

    const { data: schedule } = await supabase
      .from("Schedule")
      .select("id")
      .eq("id", scheduleId)
      .eq("userId", userId)
      .limit(1)
      .single();

    if (!schedule)
      throw new BadRequestException(`User with ID=${userId} does not own schedule with ID=${scheduleId}`);

    return {
      status: SUCCESS_STATUS,
      data: null,
    };
  }

  @Get("/:eventTypeId")
  async getEventTypeById(
    @Param("eventTypeId") eventTypeId: string,
    @Headers("Authorization") apiKey: string
  ): Promise<GetEventTypeOutput_2024_06_14> {
    await this.validateApiKey(apiKey);
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
    @Query() queryParams: GetEventTypesQuery_2024_06_14,
    @Headers("Authorization") apiKey: string
  ): Promise<GetEventTypesOutput_2024_06_14> {
    // await this.validateApiKey(apiKey);
    const { eventSlug, username, usernames } = queryParams;
    let supabaseQuery = supabase.from("EventType").select("*");

    if (!!username) {
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
    }

    if (!!usernames) {
      const { data: users } = await supabase
        .from("users")
        .select("id")
        .in("username", usernames as string[]);

      if (!users)
        return {
          status: SUCCESS_STATUS,
          data: [],
        };

      const userIds = users.map((user) => user.id);

      supabaseQuery = supabaseQuery.in("userId", userIds as string[]);
    }

    if (!!eventSlug) supabaseQuery = supabaseQuery.eq("slug", eventSlug);

    const { data: eventTypes, error } = await supabaseQuery;

    if (error)
      return {
        status: ERROR_STATUS,
        data: null,
      };

    return {
      status: SUCCESS_STATUS,
      data: eventTypes,
    };
  }

  @Patch("/:eventTypeId")
  @HttpCode(HttpStatus.OK)
  async updateEventType(
    @Param("eventTypeId") eventTypeId: number,
    @Body() body: UpdateEventTypeInput_2024_06_14,
    @Headers("Authorization") apiKey: string
  ): Promise<UpdateEventTypeOutput_2024_06_14> {
    await this.validateApiKey(apiKey);
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
  async deleteEventType(
    @Param("eventTypeId") eventTypeId: number,
    @Headers("Authorization") apiKey: string
  ): Promise<DeleteEventTypeOutput_2024_06_14> {
    await this.validateApiKey(apiKey);
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

  async createEventTypeHandler(input: TCreateInputSchema & { userId: string }): Promise<any> {
    const {
      userId,
      schedulingType,
      teamId,
      metadata,
      locations: inputLocations,
      scheduleId,
      ...rest
    } = input;

    const { data: user } = await supabase.from("users").select("*").eq("id", userId).limit(1).single();

    const isManagedEventType = schedulingType === SchedulingType.MANAGED;
    // const isOrgAdmin = !!user?.organization?.isOrgAdmin;

    // const locations: EventTypeLocation[] =
    //   inputLocations && inputLocations.length !== 0 ? inputLocations : await getDefaultLocations(ctx.user);

    // const data = {
    //   ...rest,
    //   owner: teamId ? undefined : { connect: { id: userId } },
    //   metadata: metadata ?? undefined,
    //   // Only connecting the current user for non-managed event types and non team event types
    //   users: isManagedEventType || schedulingType ? undefined : { connect: { id: userId } },
    //   locations,
    //   schedule: scheduleId ? { connect: { id: scheduleId } } : undefined,
    // } as any;

    if (teamId && schedulingType) {
      const { data: hasMembership } = await supabase
        .from("Membership")
        .select("role")
        .eq("userId", userId)
        .eq("teamId", teamId)
        .eq("accepted", true)
        .limit(1)
        .single();

      const isSystemAdmin = user.role === "ADMIN";

      if (
        !isSystemAdmin &&
        (!hasMembership?.role || !["ADMIN", "OWNER"].includes(hasMembership.role))
        // || isOrgAdmin)
      ) {
        console.warn(`User ${userId} does not have permission to create this new event type`);
        throw new BadRequestException("UNAUTHORIZED");
      }

      // data.team = {
      //   connect: {
      //     id: teamId,
      //   },
      // };
      // data.schedulingType = schedulingType;
    }

    // If we are in an organization & they are not admin & they are not creating an event on a teamID
    // Check if evenTypes are locked.
    if (user.organizationId && !user?.organization?.isOrgAdmin && !teamId) {
      const { data: orgSettings } = await supabase
        .from("OrganizationSettings")
        .select("lockEventTypeCreationForUsers")
        .eq("organizationId", user.organizationId)
        .limit(1)
        .single();

      const orgHasLockedEventTypes = !!orgSettings?.lockEventTypeCreationForUsers;
      if (orgHasLockedEventTypes) {
        console.warn(
          `User ${userId} does not have permission to create this new event type - Locked status: ${orgHasLockedEventTypes}`
        );
        throw new BadRequestException({ code: "UNAUTHORIZED" });
      }
    }

    // const profile = user.profile;
    // try {
    //   const eventType = await EventTypeRepository.create({
    //     ...data,
    //     profileId: profile.id,
    //   });
    //   return { eventType };
    // } catch (e) {
    //   console.warn(e);
    //   if (e instanceof PrismaClientKnownRequestError) {
    //     if (e.code === "P2002" && Array.isArray(e.meta?.target) && e.meta?.target.includes("slug")) {
    //       throw new TRPCError({ code: "BAD_REQUEST", message: "URL Slug already exists for given user." });
    //     }
    //   }
    //   throw new TRPCError({ code: "BAD_REQUEST" });
    // }
  }

  async validateApiKey(apiKey: string): Promise<void> {
    const { data: validatedApiKey } = await supabase
      .from("ApiKey")
      .select("id")
      .eq("id", apiKey)
      .limit(1)
      .single();

    if (!validatedApiKey) {
      throw new NotFoundException(`Api Key with value=${apiKey} does not exist.`);
    }
  }
}
