import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { HttpCode } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import { SessionService } from './session.service';

@Controller('session')
export class SessionController {
    constructor(private readonly sessionService: SessionService){}

    @Post()
    async newSession(@Body() hostSocketId : string){
        return this.sessionService.newSession(hostSocketId);
    }

    @HttpCode(HttpStatus.FOUND)
    @Get('check/:sessionId')
    async checkSession(@Param('sessionId') sessionId: string){
        return this.sessionService.checkSession(sessionId)
    }

}
