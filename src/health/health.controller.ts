import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller({
  path: 'health',
  version: '1',
})
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @ApiOperation({
    summary: 'Healthcheck da API',
    description: 'Retorna o status basico da API e da conexao com o banco.',
  })
  @ApiOkResponse({
    description: 'API e banco respondendo normalmente.',
    schema: {
      example: {
        status: 'ok',
        service: 'hortifacil-api',
        database: 'ok',
        timestamp: '2026-06-20T23:30:00.000Z',
      },
    },
  })
  @Get()
  getHealth() {
    return this.healthService.getHealth();
  }
}
