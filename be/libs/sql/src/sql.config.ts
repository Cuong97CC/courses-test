import { registerAs } from '@nestjs/config';

export const DatabaseConfig = registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'course_enrollment',
  logging: process.env.DB_LOGGING === 'true' || false,
  maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10),
  idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
}));
