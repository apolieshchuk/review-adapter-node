import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('planets/:id')
  getPlanet(@Param('id', ParseIntPipe) planetId: number): Promise<string> {
    // console.log('planetId', planetId);
    // console.log('query', query);
    // console.log('param', id);
    return this.appService.getPlanet(planetId);
  }
}
