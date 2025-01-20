import { Module } from '@nestjs/common';
import { IpLookupController } from './ip-lookup.controller';
import { IpLookupService } from './ip-lookup.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { IpLookupEntity } from '@/ip-lookup/ip-lookup.entity';
import { IpWhoisService } from '@/ip-lookup/service/ip-whois.service';

@Module({
  imports: [MikroOrmModule.forFeature([IpLookupEntity])],
  controllers: [IpLookupController],
  providers: [IpLookupService, IpWhoisService],
})
export class IpLookupModule {}
