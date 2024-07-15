import { Module } from '@nestjs/common';
import { BlockUserService } from './block-user.service';
import { BlockUserController } from './block-user.controller';
import { BlockUser } from './entities/block-user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlockUser]),
  ],
  controllers: [BlockUserController],
  providers: [BlockUserService],
  exports: [BlockUserService],
})
export class BlockUserModule {}
