import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";

import { AppConfig } from "../../config/type";

@Injectable()
export class StripeService {
  public stripe: Stripe;

  constructor(configService: ConfigService<AppConfig>) {
    this.stripe = new Stripe(configService.get("stripe.apiKey", { infer: true }) ?? "", {
      apiVersion: "2020-08-27",
    });
  }
}
