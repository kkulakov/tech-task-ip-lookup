import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig, Config } from '@/config';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IpLookupEntity } from '@/ip-lookup/ip-lookup.entity';
import { IpWhoisService } from '@/ip-lookup/service/ip-whois.service';
import { EntityRepository } from '@mikro-orm/core';
import { IpWhoisInfo } from '@/ip-lookup/model/ip-whois-info.model';

@Injectable()
export class IpLookupService {
  constructor(
    private readonly configService: ConfigService,
    private readonly ipWhoisService: IpWhoisService,
    @InjectRepository(IpLookupEntity)
    private readonly ipLookupRepository: EntityRepository<IpLookupEntity>,
  ) {}

  async getInfo(ip: string): Promise<IpWhoisInfo> {
    const appConfig = this.configService.get<AppConfig>(Config.APP);
    const cachedLookup = await this.ipLookupRepository.findOne({ ip });

    if (cachedLookup && cachedLookup.expiresAt > Date.now()) {
      return cachedLookup.info;
    }

    const result = await this.ipWhoisService.getWhois(ip);

    if (result.success === false) {
      throw new BadRequestException(result.message);
    }

    await this.ipLookupRepository.upsert({
      ip: result.ip,
      info: result,
      expiresAt: Date.now() + appConfig.recordTtlSeconds * 1000,
    });

    return result;
  }

  async deleteCached(ip: string): Promise<void> {
    const cachedLookup = await this.ipLookupRepository.findOne({ ip });

    if (!cachedLookup) {
      throw new NotFoundException(`Lookup for IP address ${ip} not found.`);
    }

    await this.ipLookupRepository.nativeDelete({ ip });
  }
}
