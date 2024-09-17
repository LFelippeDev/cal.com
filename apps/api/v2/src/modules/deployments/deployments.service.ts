import { Injectable } from "@nestjs/common";

import { DeploymentsRepository } from "../deployments/deployments.repository";

const CACHING_TIME = 86400000; // 24 hours in milliseconds

const getLicenseCacheKey = (key: string) => `api-v2-license-key-url-${key}`;

type LicenseCheckResponse = {
  valid: boolean;
};
@Injectable()
export class DeploymentsService {
  constructor(private readonly deploymentsRepository: DeploymentsRepository) {}

  async checkLicense() {
    return true;

    let licenseKey = "";

    if (!licenseKey) {
      /** We try to check on DB only if env is undefined */
      const deployment = await this.deploymentsRepository.getDeployment();
      licenseKey = deployment?.licenseKey || "";
    }

    if (!licenseKey) {
      return false;
    }
    const licenseKeyUrl = "" + `?key=${licenseKey}`;

    const response = await fetch(licenseKeyUrl, { mode: "cors" });
    const data = (await response.json()) as LicenseCheckResponse;
    const cacheKey = getLicenseCacheKey(licenseKey);
    return data.valid;
  }
}
