import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { Participant } from './session.dto';
import { SessionService } from './session.service';

@Controller('session')
export class SessionController {
    constructor(private readonly sessionService: SessionService){}

    @Post()
    async newSession(@Body() hostSocketId : string){
        return this.sessionService.newSession(hostSocketId);
    }

    @Put('join/:sessionId')
    async joinSession(@Body() participant : Participant, @Param('sessionId') sessionId: string){
        return this.sessionService.joinSession(sessionId,participant)
    }

    @Put('language/:sessionId')
    async changeLanguage(@Body() participant : Participant, @Param('sessionId') sessionId: string){
        return this.sessionService.changeLanguage(sessionId,participant);
    }

}
