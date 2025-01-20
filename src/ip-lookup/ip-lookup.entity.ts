import { Entity, JsonType, PrimaryKey, Property } from '@mikro-orm/core';
import { IpWhoisInfo } from '@/ip-lookup/model/ip-whois-info.model';

@Entity()
export class IpLookupEntity {
  @PrimaryKey()
  ip: string;

  @Property({
    type: JsonType,
  })
  info: IpWhoisInfo;

  @Property()
  expiresAt: number;
}
