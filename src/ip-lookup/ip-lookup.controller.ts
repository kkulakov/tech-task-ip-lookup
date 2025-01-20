import { Controller, Delete, Get, HttpCode, Param } from '@nestjs/common';
import { IpLookupService } from './ip-lookup.service';
import { IpAddressParamsDto } from '@/ip-lookup/dto/ip-address-params.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IpWhoisInfo } from '@/ip-lookup/model/ip-whois-info.model';

@ApiTags('IP Lookup')
@Controller('ip-lookup')
export class IpLookupController {
  constructor(private readonly ipLookupService: IpLookupService) {}

  @Get('/:ip')
  @ApiResponse({
    status: 200,
    description: 'Return IP address info',
    type: IpWhoisInfo,
  })
  @ApiResponse({ status: 400, description: 'Incorrect IP address format' })
  @ApiResponse({ status: 400, description: 'Reserved range' })
  getInfo(@Param() params: IpAddressParamsDto): Promise<IpWhoisInfo> {
    return this.ipLookupService.getInfo(params.ip);
  }

  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted',
  })
  @ApiResponse({ status: 400, description: 'Incorrect IP address format' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  @HttpCode(204)
  @Delete('/:ip')
  async deleteCached(@Param() params: IpAddressParamsDto): Promise<void> {
    await this.ipLookupService.deleteCached(params.ip);
  }
}
