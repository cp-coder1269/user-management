// @ts-nocheck
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { BlockUserModule } from './block-user/block-user.module';
import { BlockUser } from './block-user/entities/block-user.entity';
import { AuthModule } from './auth/auth.module';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      password: '',
      username: 'chandraprakashpal',
      entities: [],
      database: 'user_management',
      entities: [User, BlockUser],
      synchronize: true,
      logging: false,
    }),
    UsersModule,
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 300000, // 5 minutes
      max: 100,  // maximum number of items in cache
      isGlobal: true
    }),
    BlockUserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
