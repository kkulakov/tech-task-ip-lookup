import { Config } from './config.enum';
import { registerAs } from '@nestjs/config';

export interface AppConfig {
  ipWhoisUrl: string;
  recordTtlSeconds: number;
}

const defaultAppConfig: AppConfig = {
  ipWhoisUrl: 'https://ipwho.is',
  recordTtlSeconds: 60,
};

export const appConfig: () => AppConfig = registerAs(Config.APP, () => ({
  ipWhoisUrl: process.env.IP_WHOIS_URL || defaultAppConfig.ipWhoisUrl,
  recordTtlSeconds:
    process.env.RECORD_TTL_SECONDS != null
      ? parseInt(process.env.RECORD_TTL_SECONDS)
      : defaultAppConfig.recordTtlSeconds,
}));
