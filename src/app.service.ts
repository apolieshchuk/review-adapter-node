import { BadGatewayException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  getPlanet(planetId: number): Promise<string> {
    return this.getPlanetWrapper(planetId);
  }

  async getPlanetWrapper(planetId: number): Promise<string> {
    this.logger.log('Run getPlanetWrapper');
    const errorThreshhold = 0.5;
    const minResponseTime = 100;
    const maxResponseTime = 3000;

    const shouldBeError = Math.random() <= errorThreshhold;
    const responseTime = Math.floor(
      minResponseTime + Math.random() * (maxResponseTime - minResponseTime),
    );

    const shouldRequestProceed = await new Promise((resolve, reject) =>
      setTimeout(
        () => (shouldBeError ? reject() : resolve(null)),
        responseTime,
      ),
    )
      .then(() => true)
      .catch(() => false);

    if (shouldRequestProceed) {
      this.logger.log('Try to fetch planet from SWAPI');
      return this.fetchPlanet(planetId);
    }
    this.logger.error('Simulated API error');
    throw new InternalServerErrorException('Goddam API breaks again!!!');
  }

  fetchPlanet(planetId: number): Promise<any> {
    const swapiUrl = this.configService.get('SWAPI');
    const url = [swapiUrl, 'planets', planetId].join('/');
    return this.httpService
      .get(url)
      .pipe(
        map(async (planet) => {
          this.logger.log('Planet successfully fetched from SWAPI');
          return planet.data;
        }),
        catchError(() => {
          throw new BadGatewayException('Error on fetch planet from SWAPI');
        }),
      )
      .toPromise();
  }
}
