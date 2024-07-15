// block-user.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BlockUserService } from './block-user.service';
import { CreateBlockUserDto } from './dto/create-block-user.dto';

@Controller('block-user')
export class BlockUserController {
    constructor(private readonly blockUserService: BlockUserService) {}

    @Post('/block')
    async block(@Body() createBlockUserDto: CreateBlockUserDto) {
        return await this.blockUserService.block(createBlockUserDto);
    }

    @Post('/unblock')
    async unblock(@Body() createBlockUserDto: CreateBlockUserDto) {
        return await this.blockUserService.unblock(createBlockUserDto);
    }

    @Get('/:id')
    async findAll(@Param('id') id: number) {
        return await this.blockUserService.findAll(id);
    }
}
