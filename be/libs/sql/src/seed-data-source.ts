import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables for CLI commands
config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'course_enrollment',

  // Migrations
  migrations: [__dirname + '/seeds/**/*{.ts,.js}'],
  migrationsTableName: 'seeds',

  // Don't synchronize - use migrations
  synchronize: false,
  logging: false,
};

// DataSource for TypeORM CLI (migrations, seeds)
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
