// block-user.service.ts
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockUser } from './entities/block-user.entity';
import { CreateBlockUserDto } from './dto/create-block-user.dto';

@Injectable()
export class BlockUserService {
    constructor(
        @InjectRepository(BlockUser)
        private readonly blockUserRepository: Repository<BlockUser>,
    ) {}

    async block(userId:number, createBlockUserDto: CreateBlockUserDto) {
      const { blockIds } = createBlockUserDto;
    
      const promises = blockIds.map(async (blockId) => {
        const existingBlockData = await this.blockUserRepository.findOne({ where: { userId, blockId } });
        if (!existingBlockData) {
          const blockData = this.blockUserRepository.create({ userId, blockId });
          return this.blockUserRepository.save(blockData);
        } else {
          // Return some message if the block data already exists
          return Promise.resolve(`User ${blockId} has already been blocked by ${userId}`);
        }
      });
    
      return Promise.all(promises);
    }

    async unblock(userId:number, createBlockUserDto: CreateBlockUserDto) {
        const { blockIds } = createBlockUserDto;
        const promises = blockIds.map(async (blockId) => {
            const existingBlockData = await this.blockUserRepository.findOneBy({ userId, blockId });
            if (existingBlockData) {
                await this.blockUserRepository.remove(existingBlockData);
                return Promise.resolve(`user:${userId} has unblocked user:${blockId}`);
            }
        });
        return Promise.all(promises);
    }

    async findAll(userId: number): Promise<{ userId: number; blockIds: number[] }|BlockUser[]> {
        const blockData = await this.blockUserRepository.findBy({ userId });
        if (!blockData) {
            throw new HttpException('User Not Found', 404);
        }
        const blockIds = blockData.map(d => d.blockId);
        return { userId, blockIds};
        return blockData;
    }
}
