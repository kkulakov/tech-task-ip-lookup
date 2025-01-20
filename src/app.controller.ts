import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  @ApiResponse({ status: 200, description: 'App health' })
  @Get('health')
  health(): { success: true } {
    return { success: true };
  }
}
