import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionGateway } from './session.gateway';
import { SessionController } from './session.controller';

@Module({
  providers: [SessionGateway, SessionService],
  controllers: [SessionController]
})
export class SessionModule {}
