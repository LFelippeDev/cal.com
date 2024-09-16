import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DeploymentsRepository } from "../deployments/deployments.repository";

const CACHING_TIME = 86400000; // 24 hours in milliseconds

const getLicenseCacheKey = (key: string) => `api-v2-license-key-url-${key}`;

type LicenseCheckResponse = {
  valid: boolean;
};
@Injectable()
export class DeploymentsService {
  constructor(
    private readonly deploymentsRepository: DeploymentsRepository,
    private readonly configService: ConfigService
  ) {}

  async checkLicense() {
    if (this.configService.get("e2e")) {
      return true;
    }
    let licenseKey = this.configService.get("api.licenseKey");

    if (!licenseKey) {
      /** We try to check on DB only if env is undefined */
      const deployment = await this.deploymentsRepository.getDeployment();
      licenseKey = deployment?.licenseKey ?? undefined;
    }

    if (!licenseKey) {
      return false;
    }
    const licenseKeyUrl = this.configService.get("api.licenseKeyUrl") + `?key=${licenseKey}`;

    const response = await fetch(licenseKeyUrl, { mode: "cors" });
    const data = (await response.json()) as LicenseCheckResponse;
    const cacheKey = getLicenseCacheKey(licenseKey);
    return data.valid;
  }
}
