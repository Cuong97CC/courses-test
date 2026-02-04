import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { DatabaseConfig } from './sql.config';

@Module({
  imports: [
    ConfigModule.forFeature(DatabaseConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(DatabaseConfig)],
      useFactory: (config: ConfigType<typeof DatabaseConfig>) => ({
        type: 'postgres',
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        database: config.database,
        autoLoadEntities: true,
        synchronize: false,
        logging: config.logging,
        extra: {
          max: config.maxConnections,
          idleTimeoutMillis: config.idleTimeout,
        },
      }),
      inject: [DatabaseConfig.KEY],
    }),
  ],
  providers: [],
  exports: [],
})
export class SqlModule {}
