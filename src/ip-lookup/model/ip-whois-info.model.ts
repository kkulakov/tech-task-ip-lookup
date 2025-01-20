import { ApiProperty } from '@nestjs/swagger';

class Flag {
  @ApiProperty()
  img: string;

  @ApiProperty()
  emoji: string;

  @ApiProperty()
  emoji_unicode: string;
}

class Connection {
  @ApiProperty()
  asn: number;

  @ApiProperty()
  org: string;

  @ApiProperty()
  isp: string;

  @ApiProperty()
  domain: string;
}

class Timezone {
  @ApiProperty()
  id: string;

  @ApiProperty()
  abbr: string;

  @ApiProperty()
  is_dst: boolean;

  @ApiProperty()
  offset: number;

  @ApiProperty()
  utc: string;

  @ApiProperty()
  current_time: string;
}

export class IpWhoisInfo {
  @ApiProperty()
  ip: string;

  @ApiProperty()
  success: true;

  @ApiProperty()
  type: string;

  @ApiProperty()
  continent: string;

  @ApiProperty()
  continent_code: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  country_code: string;

  @ApiProperty()
  region: string;

  @ApiProperty()
  region_code: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  is_eu: boolean;

  @ApiProperty()
  postal: string;

  @ApiProperty()
  calling_code: string;

  @ApiProperty()
  capital: string;

  @ApiProperty()
  borders: string;

  @ApiProperty({ type: () => Flag })
  flag: Flag;

  @ApiProperty({ type: () => Connection })
  connection: Connection;

  @ApiProperty({ type: () => Timezone })
  timezone: Timezone;
}
