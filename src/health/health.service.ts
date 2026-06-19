import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class HealthService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  getHealth() {
    const states: Record<number, string> = {
      0: 'disconnected',
      1: 'ok',
      2: 'connecting',
      3: 'disconnecting',
    };

    const database = states[this.connection.readyState] ?? 'unknown';

    return {
      status: database === 'ok' ? 'ok' : 'degraded',
      service: 'hortifacil-api',
      database,
      timestamp: new Date().toISOString(),
    };
  }
}

