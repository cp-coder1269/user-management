// block-user.controller.ts
// @ts-nocheck
import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { BlockUserService } from './block-user.service';
import { CreateBlockUserDto } from './dto/create-block-user.dto';
import { Request } from 'express';

@Controller('block-user')
export class BlockUserController {
    constructor(private readonly blockUserService: BlockUserService) {}

    @Post('/block')
    async block(@Body() createBlockUserDto: CreateBlockUserDto, @Req() req: Request) {
        const userId = req?.auth_user?.sub;
        return await this.blockUserService.block(userId, createBlockUserDto);
    }

    @Post('/unblock')
    async unblock(@Body() createBlockUserDto: CreateBlockUserDto, @Req() req: Request) {
        const userId = req.auth_user.sub;
        return await this.blockUserService.unblock(userId, createBlockUserDto);
    }

    @Get()
    async findAll(@Req() req: Request) {
        const userId = req.auth_user.sub;
        return await this.blockUserService.findAll(userId);
    }
}
