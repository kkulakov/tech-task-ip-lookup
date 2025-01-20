import { IpWhoisResponse } from '@/ip-lookup/model/ip-whois-response.model';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig, Config } from '@/config';

@Injectable()
export class IpWhoisService {
  private readonly logger = new Logger(IpWhoisService.name);

  constructor(private readonly configService: ConfigService) {}

  async getWhois(ip: string): Promise<IpWhoisResponse> {
    try {
      const config = this.configService.get<AppConfig>(Config.APP);
      const response = await fetch(`${config.ipWhoisUrl}/${ip}`);
      return await response.json();
    } catch (error) {
      this.logger.error(error);

      return {
        ip,
        success: false,
        message: 'An unexpected error occurred.',
      };
    }
  }
}
