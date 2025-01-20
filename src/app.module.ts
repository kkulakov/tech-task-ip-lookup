import {
  MiddlewareConsumer,
  Module,
  OnModuleInit,
  RequestMethod,
} from '@nestjs/common';
import { IpLookupModule } from '@/ip-lookup/ip-lookup.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '@/config/app.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MikroORM, SqliteDriver } from '@mikro-orm/sqlite';
import { HttpLoggerMiddleware } from '@/middleware/http-logger.middleware';
import { AppController } from '@/app.controller';

@Module({
  imports: [
    IpLookupModule,
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
    }),
    MikroOrmModule.forRoot({
      driver: SqliteDriver,
      dbName: 'ip-lookup-db.sqlite3',
      autoLoadEntities: true,
    }),
  ],
  controllers: [AppController],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit() {
    const generator = this.orm.getSchemaGenerator();
    await generator.ensureDatabase();
    await generator.updateSchema();
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpLoggerMiddleware)
      .exclude({ path: '*', method: RequestMethod.OPTIONS })
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
