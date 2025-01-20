import { IsIP } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IpAddressParamsDto {
  @IsIP(null, { message: 'Incorrect IP address format' })
  @ApiProperty({
    required: true,
    description: 'IP address (V4 or V6)',
    example: '8.8.8.8',
  })
  ip: string;
}
