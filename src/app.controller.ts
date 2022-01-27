import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('planets/:id')
  getPlanet(@Param('id', ParseIntPipe) planetId: number): Promise<string> {
    return this.appService.getPlanet(planetId);
  }
}
