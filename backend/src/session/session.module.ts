import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionGateway } from './session.gateway';

@Module({
  providers: [SessionGateway, SessionService],
})
export class SessionModule {}
